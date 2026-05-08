from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

# ----------------------------------------------
# Custom User Manager (uses email as username)
# ----------------------------------------------
class UserManager(BaseUserManager):
    """Custom manager for User with email as unique identifier instead of username"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('email_verified', True)  # Superuser auto-verified
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


# ----------------------------------------------
# Custom User Model
# ----------------------------------------------
class User(AbstractUser):
    username = None  # Remove username field (use email as USERNAME_FIELD)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    nid_card_picture = models.ImageField(upload_to='nid_cards/', null=True, blank=True)
    address = models.TextField()
    bio = models.TextField(blank=True)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'          # Use email as the login field
    REQUIRED_FIELDS = ['name', 'phone_number']   # Required for createsuperuser

    objects = UserManager()

    def __str__(self):
        return self.email


# ----------------------------------------------
# Token Model (Ride Offer)
# ----------------------------------------------
class Token(models.Model):
    VEHICLE_CHOICES = [
        ('rickshaw', 'Rickshaw'),
        ('cng', 'CNG'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('deleted', 'Deleted'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens')
    title = models.CharField(max_length=255)
    vehicle_type = models.CharField(max_length=100)  # Allow any custom vehicle type
    additional_info = models.TextField(blank=True)
    latitude = models.FloatField()  # Use FloatField for GPS coordinates
    longitude = models.FloatField()  # Use FloatField for GPS coordinates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def is_editable(self):
        # Can edit/refresh/delete only after 2 minutes
        return (timezone.now() - self.created_at).total_seconds() >= 120

    def __str__(self):
        return f"{self.title} - {self.user.email}"


# ----------------------------------------------
# Request Model (Ride Request)
# ----------------------------------------------
class Request(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    to_token = models.ForeignKey(Token, on_delete=models.CASCADE, related_name='requests')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted')],
        default='pending'
    )

    class Meta:
        unique_together = ['from_user', 'to_token']

    def __str__(self):
        return f"Request from {self.from_user.email} to {self.to_token.title}"


# ----------------------------------------------
# Connection Model (Accepted Ride Match)
# ----------------------------------------------
class Connection(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connections_as_user2')
    token = models.ForeignKey(Token, on_delete=models.SET_NULL, null=True)  # The token that led to connection
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user1', 'user2']

    def __str__(self):
        return f"Connection: {self.user1.email} <-> {self.user2.email}"