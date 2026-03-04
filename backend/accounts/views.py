from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, KYCSubmission
from .serializers import (
    RegisterSerializer, UserSerializer, LoginSerializer,
    UpdateProfileSerializer, AdminFundSerializer,
    KYCSubmissionSerializer, KYCSubmitSerializer,
    ChangePasswordSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Account created. Awaiting admin approval."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Check if user exists
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "invalid_credentials", "message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Check approval before authenticate() — is_active=False would mask this
        if not user_obj.is_approved:
            return Response(
                {"error": "pending_approval", "message": "Your account is pending admin approval."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Validate password (authenticate also checks is_active)
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"error": "invalid_credentials", "message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProfileView(APIView):
    """Update profile info or delete own account."""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Account deleted."}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(serializer.validated_data['current_password']):
            return Response(
                {'current_password': 'Incorrect password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        return Response({'message': 'Password updated successfully.'})


class PendingUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pending = User.objects.filter(is_approved=False).order_by('date_joined')
        return Response(UserSerializer(pending, many=True).data)


class ApproveUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action', 'approve')

        if action == 'approve':
            user.is_approved = True
            user.is_active = True
            user.save(update_fields=['is_approved', 'is_active'])
            return Response({"message": f"{user.email} approved.", "user": UserSerializer(user).data})

        if action == 'deactivate':
            user.is_approved = False
            user.is_active = False
            user.save(update_fields=['is_approved', 'is_active'])
            return Response({"message": f"{user.email} deactivated.", "user": UserSerializer(user).data})

        return Response({"error": "Invalid action. Use 'approve' or 'deactivate'."}, status=status.HTTP_400_BAD_REQUEST)


class AdminFundUserView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminFundSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        fields_to_update = []
        for field, value in serializer.validated_data.items():
            setattr(user, field, value)
            fields_to_update.append(field)

        if fields_to_update:
            user.save(update_fields=fields_to_update)

        return Response(UserSerializer(user).data)


class AllUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by('date_joined')
        return Response(UserSerializer(users, many=True).data)


class KYCSubmitView(APIView):
    """User submits their KYC documents."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user

        # Already approved — no need to resubmit
        if user.kyc_status == User.KYC_APPROVED:
            return Response({'detail': 'KYC already approved.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update or create the submission record
        instance = getattr(user, 'kyc_submission', None)
        serializer = KYCSubmitSerializer(instance, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        submission = serializer.save(user=user)
        submission.reviewed_at = None
        submission.admin_note = ''
        submission.save(update_fields=['reviewed_at', 'admin_note'])

        user.kyc_status = User.KYC_PENDING
        user.save(update_fields=['kyc_status'])

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    def get(self, request):
        """Return current KYC submission for the authenticated user."""
        try:
            submission = request.user.kyc_submission
        except KYCSubmission.DoesNotExist:
            return Response(None)
        return Response(KYCSubmissionSerializer(submission, context={'request': request}).data)


class AdminKYCListView(APIView):
    """Admin: list all KYC submissions."""
    permission_classes = [AllowAny]

    def get(self, request):
        qs = KYCSubmission.objects.select_related('user').order_by('-submitted_at')
        return Response(KYCSubmissionSerializer(qs, many=True, context={'request': request}).data)


class AvatarUploadView(APIView):
    """User: upload or replace their profile picture."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        avatar_file = request.FILES.get('avatar')
        if not avatar_file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if user.avatar:
            user.avatar.delete(save=False)
        user.avatar = avatar_file
        user.save(update_fields=['avatar'])
        return Response(UserSerializer(user).data)


class AdminKYCActionView(APIView):
    """Admin: approve or reject a KYC submission."""
    permission_classes = [AllowAny]

    def post(self, request, submission_id):
        try:
            submission = KYCSubmission.objects.select_related('user').get(pk=submission_id)
        except KYCSubmission.DoesNotExist:
            return Response({'error': 'Submission not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        note = request.data.get('note', '')

        if action == 'approve':
            submission.user.kyc_status = User.KYC_APPROVED
        elif action == 'reject':
            submission.user.kyc_status = User.KYC_REJECTED
        else:
            return Response({'error': "Use 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        submission.user.save(update_fields=['kyc_status'])
        submission.reviewed_at = timezone.now()
        submission.admin_note = note
        submission.save(update_fields=['reviewed_at', 'admin_note'])

        return Response(KYCSubmissionSerializer(submission, context={'request': request}).data)
