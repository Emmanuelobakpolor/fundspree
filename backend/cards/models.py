from django.db import models
from django.conf import settings


class CardOrder(models.Model):
    TIER_CHOICES = [
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
        ('business', 'Business'),
    ]
    PAYMENT_CHOICES = [
        ('btc', 'BTC'),
        ('usdt', 'USDT'),
        ('eth', 'ETH'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='card_orders',
    )
    tier = models.CharField(max_length=20, choices=TIER_CHOICES)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES)
    proof_image = models.ImageField(upload_to='payment_proofs/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    card_number = models.CharField(max_length=20)
    card_expiry = models.CharField(max_length=7)
    card_holder = models.CharField(max_length=255)
    card_cvv = models.CharField(max_length=3)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user.email} — {self.tier} ({self.status})"
