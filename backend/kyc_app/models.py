from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('merchant', 'Merchant'),
        ('reviewer', 'Reviewer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='merchant')

class KYCSubmission(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('more_info_requested', 'More Info Requested'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kyc')
    
    # Personal Details
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    # Business Details
    business_name = models.CharField(max_length=255, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    expected_monthly_volume = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    # Documents
    pan_card = models.FileField(upload_to='documents/', blank=True, null=True)
    aadhaar_card = models.FileField(upload_to='documents/', blank=True, null=True)
    bank_statement = models.FileField(upload_to='documents/', blank=True, null=True)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='draft')
    
    # Reviewer actions
    rejection_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"KYC - {self.user.username} ({self.status})"

class NotificationLog(models.Model):
    merchant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    event_type = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} for {self.merchant.username}"
