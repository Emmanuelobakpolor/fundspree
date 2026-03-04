from rest_framework import serializers
from .models import CardOrder


class CardOrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardOrder
        fields = [
            'tier', 'payment_method', 'proof_image',
            'card_number', 'card_expiry', 'card_holder', 'card_cvv',
        ]

    def create(self, validated_data):
        return CardOrder.objects.create(**validated_data)


class CardOrderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    proof_image_url = serializers.SerializerMethodField()

    class Meta:
        model = CardOrder
        fields = [
            'id', 'tier', 'payment_method', 'proof_image_url',
            'status', 'card_number', 'card_expiry', 'card_holder', 'card_cvv',
            'submitted_at', 'reviewed_at', 'user_email', 'user_name',
        ]

    def get_proof_image_url(self, obj):
        request = self.context.get('request')
        if obj.proof_image and request:
            return request.build_absolute_uri(obj.proof_image.url)
        return None
