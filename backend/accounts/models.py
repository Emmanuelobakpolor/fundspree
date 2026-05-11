import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


def _generate_referral_code():
    return uuid.uuid4().hex[:8].upper()


class User(AbstractUser):
    # Use email as the primary login identifier
    email = models.EmailField(unique=True)

    # Custom fields
    name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    welcome_bonus = models.IntegerField(default=10)
    balance = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    referral_bonus = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    withdrawal_this_month = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    withdrawal_all_time = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)

    # Referral system
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    referred_by = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='referrals'
    )

    # Avatar
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    # Online tracking
    last_seen = models.DateTimeField(null=True, blank=True)

    # KYC
    KYC_NONE = 'none'
    KYC_PENDING = 'pending'
    KYC_APPROVED = 'approved'
    KYC_REJECTED = 'rejected'
    KYC_STATUS_CHOICES = [
        (KYC_NONE,     'Not Submitted'),
        (KYC_PENDING,  'Pending Review'),
        (KYC_APPROVED, 'Approved'),
        (KYC_REJECTED, 'Rejected'),
    ]
    kyc_status = models.CharField(max_length=20, choices=KYC_STATUS_CHOICES, default=KYC_NONE)

    USERNAME_FIELD = 'email'
    # username is kept (required by AbstractUser) but auto-populated from email
    REQUIRED_FIELDS = ['username', 'name']

    def save(self, *args, **kwargs):
        if not self.referral_code:
            code = _generate_referral_code()
            while User.objects.filter(referral_code=code).exists():
                code = _generate_referral_code()
            self.referral_code = code
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


class KYCSubmission(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kyc_submission')
    government_id = models.ImageField(upload_to='kyc/gov_id/')
    passport = models.ImageField(upload_to='kyc/passport/')
    home_address = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_note = models.TextField(blank=True)

    def __str__(self):
        return f"KYC – {self.user.email} [{self.user.kyc_status}]"
