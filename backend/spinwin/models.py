from django.db import models
from django.conf import settings


class SpinResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='spin_results',
    )
    prize_label = models.CharField(max_length=20)
    prize_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prize_index = models.IntegerField()
    spun_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-spun_at']

    def __str__(self):
        return f"{self.user.email} — {self.prize_label} at {self.spun_at:%Y-%m-%d %H:%M}"
