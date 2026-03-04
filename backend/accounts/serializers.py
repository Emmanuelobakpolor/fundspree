from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from datetime import timedelta
from .models import User, KYCSubmission


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )
    referral_code = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'referral_code')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            is_active=False,
            is_approved=False,
        )
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code.strip().upper())
                user.referred_by = referrer
                user.save(update_fields=['referred_by'])
                referrer.referral_bonus += 50
                referrer.save(update_fields=['referral_bonus'])
            except User.DoesNotExist:
                pass
        return user


class UserSerializer(serializers.ModelSerializer):
    welcomeBonus = serializers.IntegerField(source='welcome_bonus', read_only=True)
    dateOfBirth = serializers.DateField(source='date_of_birth', required=False, allow_null=True)
    referralBonus = serializers.DecimalField(source='referral_bonus', max_digits=14, decimal_places=2, read_only=True)
    withdrawalThisMonth = serializers.DecimalField(source='withdrawal_this_month', max_digits=14, decimal_places=2, read_only=True)
    withdrawalAllTime = serializers.DecimalField(source='withdrawal_all_time', max_digits=14, decimal_places=2, read_only=True)
    referralCode = serializers.CharField(source='referral_code', read_only=True)
    referralCount = serializers.SerializerMethodField()
    kycStatus = serializers.CharField(source='kyc_status', read_only=True)
    avatarUrl = serializers.SerializerMethodField()
    isOnline = serializers.SerializerMethodField()
    lastLogin = serializers.DateTimeField(source='last_login', read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'name', 'phone', 'country', 'dateOfBirth',
            'welcomeBonus', 'balance', 'referralBonus',
            'withdrawalThisMonth', 'withdrawalAllTime',
            'referralCode', 'referralCount', 'kycStatus', 'avatarUrl', 'isOnline',
            'lastLogin',
        )

    def get_avatarUrl(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None

    def get_isOnline(self, obj):
        if not obj.last_seen:
            return False
        return timezone.now() - obj.last_seen < timedelta(minutes=5)

    def get_referralCount(self, obj):
        return obj.referrals.count()


class UpdateProfileSerializer(serializers.ModelSerializer):
    dateOfBirth = serializers.DateField(
        source='date_of_birth', required=False, allow_null=True
    )

    class Meta:
        model = User
        fields = ('name', 'email', 'phone', 'country', 'dateOfBirth')
        extra_kwargs = {'email': {'required': False}}

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("That email is already taken.")
        return value

    def update(self, instance, validated_data):
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        # Keep username in sync with email
        if 'email' in validated_data:
            instance.username = validated_data['email']
        instance.save()
        return instance


class AdminFundSerializer(serializers.Serializer):
    balance = serializers.DecimalField(max_digits=14, decimal_places=2, required=False)
    welcome_bonus = serializers.IntegerField(required=False)
    referral_bonus = serializers.DecimalField(max_digits=14, decimal_places=2, required=False)
    withdrawal_this_month = serializers.DecimalField(max_digits=14, decimal_places=2, required=False)
    withdrawal_all_time = serializers.DecimalField(max_digits=14, decimal_places=2, required=False)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class KYCSubmissionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    kyc_status = serializers.CharField(source='user.kyc_status', read_only=True)
    government_id_url = serializers.SerializerMethodField()
    passport_url = serializers.SerializerMethodField()

    class Meta:
        model = KYCSubmission
        fields = (
            'id', 'user_email', 'user_name', 'kyc_status',
            'home_address', 'government_id_url', 'passport_url',
            'submitted_at', 'reviewed_at', 'admin_note',
        )

    def get_government_id_url(self, obj):
        if obj.government_id:
            return obj.government_id.url
        return None

    def get_passport_url(self, obj):
        if obj.passport:
            return obj.passport.url
        return None


class KYCSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCSubmission
        fields = ('government_id', 'passport', 'home_address')
