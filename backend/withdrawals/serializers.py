from rest_framework import serializers
from .models import Withdrawal


class WithdrawalSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name  = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model  = Withdrawal
        fields = (
            'id', 'user_email', 'user_name',
            'amount', 'crypto', 'network', 'wallet_address',
            'status', 'created_at', 'processed_at',
        )
        read_only_fields = ('id', 'user_email', 'user_name', 'status', 'created_at', 'processed_at')
