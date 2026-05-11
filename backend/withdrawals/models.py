from django.db import models
from django.conf import settings


class Withdrawal(models.Model):
    STATUS_PENDING    = 'pending'
    STATUS_PROCESSING = 'processing'
    STATUS_COMPLETED  = 'completed'
    STATUS_FAILED     = 'failed'

    STATUS_CHOICES = [
        (STATUS_PENDING,    'Pending'),
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_COMPLETED,  'Completed'),
        (STATUS_FAILED,     'Failed'),
    ]

    user           = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='withdrawals',
    )
    amount         = models.DecimalField(max_digits=14, decimal_places=2)
    crypto         = models.CharField(max_length=20)
    network        = models.CharField(max_length=100)
    wallet_address = models.CharField(max_length=200)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at     = models.DateTimeField(auto_now_add=True)
    processed_at   = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} – {self.crypto} {self.amount} [{self.status}]"
