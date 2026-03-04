from rest_framework import serializers
from .models import LoanApplication


class LoanApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = ['amount', 'purpose', 'tier']


class LoanApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = LoanApplication
        fields = [
            'id', 'amount', 'purpose', 'tier', 'status',
            'applied_at', 'reviewed_at', 'user_email', 'user_name',
        ]
