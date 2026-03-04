import random
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from cards.models import CardOrder
from .models import SpinResult

# ─── Config ────────────────────────────────────────────────────────────────────

PRIZES = [
    {'label': '$0',        'amount': Decimal('0'),  'index': 0},
    {'label': '$5',        'amount': Decimal('5'),  'index': 1},
    {'label': '$0',        'amount': Decimal('0'),  'index': 2},
    {'label': '$10',       'amount': Decimal('10'), 'index': 3},
    {'label': '$0',        'amount': Decimal('0'),  'index': 4},
    {'label': '$2',        'amount': Decimal('2'),  'index': 5},
    {'label': '$0',        'amount': Decimal('0'),  'index': 6},
    {'label': 'Try Again', 'amount': Decimal('0'),  'index': 7},
]
# Weighted: $0 and Try Again are most common
WEIGHTS = [30, 5, 30, 2, 30, 8, 30, 15]

TIER_SPIN_LIMITS = {'platinum': 2, 'business': 5}


def get_eligible_tier(user):
    """Return the user's highest eligible tier (platinum/business) or None."""
    for tier in ['business', 'platinum']:
        if CardOrder.objects.filter(user=user, status='confirmed', tier=tier).exists():
            return tier
    return None


def get_spins_used_today(user):
    today = timezone.now().date()
    return SpinResult.objects.filter(user=user, spun_at__date=today).count()


# ─── Views ─────────────────────────────────────────────────────────────────────

class UserSpinStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tier = get_eligible_tier(user)
        max_spins = TIER_SPIN_LIMITS.get(tier, 0) if tier else 0
        spins_used = get_spins_used_today(user)
        spins_left = max(0, max_spins - spins_used)
        total_won = SpinResult.objects.filter(user=user).aggregate(
            total=Sum('prize_amount')
        )['total'] or Decimal('0')

        return Response({
            'eligible_tier': tier,
            'max_spins': max_spins,
            'spins_left': spins_left,
            'total_won': str(total_won),
        })


class UserSpinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        tier = get_eligible_tier(user)
        if not tier:
            return Response(
                {'error': 'You need a Platinum or Business card to use Spin & Win.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        max_spins = TIER_SPIN_LIMITS[tier]
        spins_used = get_spins_used_today(user)
        if spins_used >= max_spins:
            return Response(
                {'error': 'No spins remaining today. Come back tomorrow!'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Server-side prize selection
        prize = random.choices(PRIZES, weights=WEIGHTS, k=1)[0]

        # Record the spin
        SpinResult.objects.create(
            user=user,
            prize_label=prize['label'],
            prize_amount=prize['amount'],
            prize_index=prize['index'],
        )

        # Credit winnings to user balance
        if prize['amount'] > 0:
            user.balance = user.balance + prize['amount']
            user.save(update_fields=['balance'])

        spins_left = max(0, max_spins - spins_used - 1)
        total_won = SpinResult.objects.filter(user=user).aggregate(
            total=Sum('prize_amount')
        )['total'] or Decimal('0')

        return Response({
            'prize_label': prize['label'],
            'prize_amount': str(prize['amount']),
            'prize_index': prize['index'],
            'spins_left': spins_left,
            'total_won': str(total_won),
        })


class SpinLeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = timezone.now().date()
        results = (
            SpinResult.objects
            .filter(spun_at__date=today, prize_amount__gt=0)
            .select_related('user')
            .order_by('-prize_amount')[:10]
        )
        leaderboard = []
        for i, r in enumerate(results, start=1):
            name = r.user.name or r.user.email.split('@')[0]
            masked = name[:4].ljust(4, '*') + '****' if len(name) >= 4 else name + '****'
            leaderboard.append({
                'rank': i,
                'name': masked,
                'prize': f'${r.prize_amount}',
                'date': 'Today',
            })
        return Response(leaderboard)


class AdminSpinResultsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = SpinResult.objects.select_related('user').all()
        user_id = request.query_params.get('user_id')
        if user_id:
            qs = qs.filter(user_id=user_id)
        data = [
            {
                'id': r.id,
                'user_email': r.user.email,
                'prize_label': r.prize_label,
                'prize_amount': str(r.prize_amount),
                'prize_index': r.prize_index,
                'spun_at': r.spun_at.isoformat(),
            }
            for r in qs[:200]
        ]
        return Response(data)
