from decimal import Decimal, InvalidOperation

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Withdrawal
from .serializers import WithdrawalSerializer


class WithdrawalView(APIView):
    """User: submit a withdrawal request or list own withdrawals."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Parse & validate amount
        try:
            amount = Decimal(str(request.data.get('amount', '')))
        except InvalidOperation:
            return Response({'error': 'Invalid amount.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response(
                {'error': 'Amount must be greater than zero.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # KYC limit: $500 max without approved KYC
        if user.kyc_status != 'approved' and amount > Decimal('500'):
            return Response(
                {'error': 'KYC verification required for withdrawals over $500. Complete your KYC in Profile Settings to unlock unlimited withdrawals.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Balance check
        if amount > user.balance:
            return Response(
                {'error': 'Insufficient balance.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        crypto         = request.data.get('crypto', '').strip()
        network        = request.data.get('network', '').strip()
        wallet_address = request.data.get('wallet_address', '').strip()

        if not crypto or not network or not wallet_address:
            return Response(
                {'error': 'crypto, network, and wallet_address are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Deduct balance immediately to prevent double-spending
        user.balance -= amount
        user.withdrawal_this_month += amount
        user.withdrawal_all_time   += amount
        user.save(update_fields=['balance', 'withdrawal_this_month', 'withdrawal_all_time'])

        withdrawal = Withdrawal.objects.create(
            user=user,
            amount=amount,
            crypto=crypto,
            network=network,
            wallet_address=wallet_address,
            status=Withdrawal.STATUS_PENDING,
        )

        return Response(WithdrawalSerializer(withdrawal).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        withdrawals = Withdrawal.objects.filter(user=request.user)
        return Response(WithdrawalSerializer(withdrawals, many=True).data)


class AdminWithdrawalView(APIView):
    """Admin: list all withdrawals."""
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Withdrawal.objects.select_related('user').all()
        return Response(WithdrawalSerializer(qs, many=True).data)
