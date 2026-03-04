from django.db import models
from django.conf import settings


class LoanApplication(models.Model):
    TIER_CHOICES = [
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
        ('business', 'Business'),
    ]
    PURPOSE_CHOICES = [
        ('business', 'Business Expansion'),
        ('personal', 'Personal'),
        ('education', 'Education'),
        ('medical', 'Medical'),
        ('travel', 'Travel'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='loan_applications',
    )
    amount = models.IntegerField()
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.user.email} — ${self.amount} ({self.status})"
