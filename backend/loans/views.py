from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import LoanApplication
from .serializers import LoanApplicationSerializer, LoanApplicationCreateSerializer

TIER_LOAN_LIMITS = {'platinum': 2000, 'business': 8000}


class UserLoansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        loans = LoanApplication.objects.filter(user=request.user)
        return Response(LoanApplicationSerializer(loans, many=True).data)

    def post(self, request):
        serializer = LoanApplicationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        tier = serializer.validated_data['tier']
        amount = serializer.validated_data['amount']

        if tier not in TIER_LOAN_LIMITS:
            return Response(
                {'error': 'Gold card does not have loan access.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if amount > TIER_LOAN_LIMITS[tier]:
            return Response(
                {'error': f'Amount exceeds your {tier} card limit of ${TIER_LOAN_LIMITS[tier]:,}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        loan = serializer.save(user=request.user)
        return Response(LoanApplicationSerializer(loan).data, status=status.HTTP_201_CREATED)


class AdminLoansView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = LoanApplication.objects.select_related('user').all()
        status_filter = request.query_params.get('status')
        if status_filter in ('pending', 'approved', 'rejected'):
            qs = qs.filter(status=status_filter)
        return Response(LoanApplicationSerializer(qs, many=True).data)


class AdminLoanActionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, loan_id):
        try:
            loan = LoanApplication.objects.get(pk=loan_id)
        except LoanApplication.DoesNotExist:
            return Response({'error': 'Loan not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'approve':
            loan.status = 'approved'
            loan.reviewed_at = timezone.now()
            loan.save(update_fields=['status', 'reviewed_at'])
        elif action == 'reject':
            loan.status = 'rejected'
            loan.reviewed_at = timezone.now()
            loan.save(update_fields=['status', 'reviewed_at'])
        else:
            return Response(
                {'error': "Invalid action. Use 'approve' or 'reject'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(LoanApplicationSerializer(loan).data)
