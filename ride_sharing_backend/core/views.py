from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import User, Token, Request, Connection
from .serializers import *
from .utils import haversine_distance

# Email verification helper
def send_verification_email(user):
    refresh = RefreshToken.for_user(user)
    verification_link = f"http://localhost:8000/api/verify-email/{refresh.access_token}/"
    send_mail(
        'Verify your email',
        f'Click here to verify: {verification_link}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_verification_email(user)
            return Response({'message': 'User created. Please verify email.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        from rest_framework_simplejwt.tokens import AccessToken
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            user.email_verified = True
            user.save()
            return Response({'message': 'Email verified successfully'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if user:
            if not user.email_verified:
                return Response({'error': 'Email not verified'}, status=status.HTTP_400_BAD_REQUEST)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# --- Token Management ---
class MyTokenView(APIView):
    def get(self, request):
        token = Token.objects.filter(user=request.user, status='active').first()
        if token:
            serializer = TokenSerializer(token)
            return Response(serializer.data)
        return Response({'message': 'No active token'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        token = Token.objects.filter(user=request.user, status='active').first()
        if token:
            if not token.is_editable():
                return Response({'error': 'Cannot delete token before 2 minutes'}, status=status.HTTP_400_BAD_REQUEST)
            token.status = 'deleted'
            token.save()
            return Response({'message': 'Token deleted'})
        return Response({'error': 'No active token'}, status=status.HTTP_404_NOT_FOUND)

class CreateTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Check if user already has active token
        if Token.objects.filter(user=request.user, status='active').exists():
            return Response({'error': 'You already have an active token. Delete or edit it first.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TokenCreateSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.save(user=request.user, status='active')
            # After creation, find nearby tokens (last 15 mins, within 200m, excluding own)
            lat = token.latitude
            lng = token.longitude
            cutoff = timezone.now() - timedelta(minutes=15)
            nearby_tokens = Token.objects.filter(
                status='active',
                created_at__gte=cutoff
            ).exclude(user=request.user)

            result = []
            for t in nearby_tokens:
                dist = haversine_distance(lat, lng, t.latitude, t.longitude)
                if dist <= 200:
                    result.append(TokenSerializer(t).data)

            return Response({
                'token': TokenSerializer(token).data,
                'nearby_tokens': result
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditTokenView(APIView):
    def put(self, request):
        token = Token.objects.filter(user=request.user, status='active').first()
        if not token:
            return Response({'error': 'No active token'}, status=status.HTTP_404_NOT_FOUND)
        if not token.is_editable():
            return Response({'error': 'Can edit only after 2 minutes'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TokenCreateSerializer(token, data=request.data, partial=True)
        if serializer.is_valid():
            token = serializer.save()
            token.created_at = timezone.now()  # Reset countdown
            token.updated_at = timezone.now()
            token.save()
            return Response(TokenSerializer(token).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    def post(self, request):
        token = Token.objects.filter(user=request.user, status='active').first()
        if not token:
            return Response({'error': 'No active token'}, status=status.HTTP_404_NOT_FOUND)
        if not token.is_editable():
            return Response({'error': 'Can refresh only after 2 minutes'}, status=status.HTTP_400_BAD_REQUEST)

        # Update location if provided
        new_lat = request.data.get('latitude')
        new_lng = request.data.get('longitude')
        if new_lat is not None and new_lng is not None:
            token.latitude = new_lat
            token.longitude = new_lng
        token.created_at = timezone.now()
        token.updated_at = timezone.now()
        token.save()
        return Response(TokenSerializer(token).data)

class NearbyTokensView(APIView):
    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        if not lat or not lng:
            return Response({'error': 'lat and lng required'}, status=status.HTTP_400_BAD_REQUEST)

        lat = float(lat)
        lng = float(lng)
        cutoff = timezone.now() - timedelta(minutes=15)
        tokens = Token.objects.filter(status='active', created_at__gte=cutoff).exclude(user=request.user)

        nearby = []
        for t in tokens:
            dist = haversine_distance(lat, lng, t.latitude, t.longitude)
            if dist <= 200:
                nearby.append(TokenSerializer(t).data)
        return Response(nearby)

# --- Requests ---
class SendRequestView(APIView):
    def post(self, request):
        token_id = request.data.get('token_id')
        try:
            target_token = Token.objects.get(id=token_id, status='active')
        except Token.DoesNotExist:
            return Response({'error': 'Token not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

        if target_token.user == request.user:
            return Response({'error': 'Cannot request your own token'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if request already exists
        if Request.objects.filter(from_user=request.user, to_token=target_token).exists():
            return Response({'error': 'Request already sent'}, status=status.HTTP_400_BAD_REQUEST)

        req = Request.objects.create(from_user=request.user, to_token=target_token)
        return Response(RequestSerializer(req).data, status=status.HTTP_201_CREATED)

class IncomingRequestsView(APIView):
    def get(self, request):
        # Requests sent to user's active token(s) - but user has only one active token
        user_token = Token.objects.filter(user=request.user, status='active').first()
        if not user_token:
            return Response([])
        requests = Request.objects.filter(to_token=user_token, status='pending')
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

class AcceptRequestView(APIView):
    def post(self, request, request_id):
        try:
            req = Request.objects.get(id=request_id, to_token__user=request.user, status='pending')
        except Request.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # Accept: create connection
        conn, created = Connection.objects.get_or_create(
            user1=req.from_user,
            user2=request.user,
            defaults={'token': req.to_token}
        )
        # Mark token as completed
        req.to_token.status = 'completed'
        req.to_token.save()
        # Delete all other pending requests for this token
        Request.objects.filter(to_token=req.to_token, status='pending').exclude(id=req.id).delete()
        req.status = 'accepted'
        req.save()

        return Response({'message': 'Request accepted', 'connection_id': conn.id})

class RejectRequestView(APIView):
    def delete(self, request, request_id):
        try:
            req = Request.objects.get(id=request_id, to_token__user=request.user, status='pending')
            req.delete()
            return Response({'message': 'Request rejected'})
        except Request.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

# --- Connections ---
class ConnectionsView(APIView):
    def get(self, request):
        connections = Connection.objects.filter(user1=request.user) | Connection.objects.filter(user2=request.user)
        serializer = ConnectionSerializer(connections, many=True, context={'request': request})
        return Response(serializer.data)