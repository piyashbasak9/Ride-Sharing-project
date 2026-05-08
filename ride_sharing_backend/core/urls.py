from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view()),
    path('verify-email/<str:token>/', views.VerifyEmailView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('profile/', views.ProfileView.as_view()),
    path('token/my/', views.MyTokenView.as_view()),
    path('token/create/', views.CreateTokenView.as_view()),
    path('token/edit/', views.EditTokenView.as_view()),
    path('token/refresh/', views.RefreshTokenView.as_view()),
    path('token/nearby/', views.NearbyTokensView.as_view()),
    path('requests/send/', views.SendRequestView.as_view()),
    path('requests/incoming/', views.IncomingRequestsView.as_view()),
    path('requests/accept/<int:request_id>/', views.AcceptRequestView.as_view()),
    path('requests/reject/<int:request_id>/', views.RejectRequestView.as_view()),
    path('connections/', views.ConnectionsView.as_view()),
]