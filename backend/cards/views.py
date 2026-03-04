from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from .models import CardOrder
from .serializers import CardOrderSerializer, CardOrderCreateSerializer


class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        orders = CardOrder.objects.filter(user=request.user)
        return Response(CardOrderSerializer(orders, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = CardOrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save(user=request.user)
            return Response(
                CardOrderSerializer(order, context={'request': request}).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserActiveCardsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = CardOrder.objects.filter(user=request.user, status='confirmed')
        return Response(CardOrderSerializer(orders, many=True, context={'request': request}).data)


class AdminOrdersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = CardOrder.objects.select_related('user').all()
        status_filter = request.query_params.get('status')
        if status_filter in ('pending', 'confirmed', 'rejected'):
            qs = qs.filter(status=status_filter)
        return Response(CardOrderSerializer(qs, many=True, context={'request': request}).data)


class AdminOrderDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, order_id):
        try:
            order = CardOrder.objects.select_related('user').get(pk=order_id)
        except CardOrder.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(CardOrderSerializer(order, context={'request': request}).data)


class AdminOrderActionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, order_id):
        try:
            order = CardOrder.objects.get(pk=order_id)
        except CardOrder.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')

        if action == 'confirm':
            order.status = 'confirmed'
            order.reviewed_at = timezone.now()
            order.save(update_fields=['status', 'reviewed_at'])
        elif action == 'reject':
            order.status = 'rejected'
            order.reviewed_at = timezone.now()
            order.save(update_fields=['status', 'reviewed_at'])
        else:
            return Response(
                {"error": "Invalid action. Use 'confirm' or 'reject'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(CardOrderSerializer(order, context={'request': request}).data)
