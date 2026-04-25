from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, F, ExpressionWrapper, DurationField
from django.utils import timezone
from .models import KYCSubmission, NotificationLog
from .serializers import UserSerializer, KYCSubmissionSerializer, KYCSubmissionReviewerSerializer
from .services import KYCStateMachine
from rest_framework.exceptions import ValidationError

User = get_user_model()

class IsMerchant(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'merchant'

class IsReviewer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'reviewer'

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class MyKYCView(APIView):
    permission_classes = [IsMerchant]

    def get(self, request):
        kyc, created = KYCSubmission.objects.get_or_create(user=request.user)
        serializer = KYCSubmissionSerializer(kyc)
        return Response(serializer.data)

class SaveDraftView(APIView):
    permission_classes = [IsMerchant]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        kyc, created = KYCSubmission.objects.get_or_create(user=request.user)
        
        # Only allow if it's draft or more_info_requested
        if kyc.status not in ['draft', 'more_info_requested']:
            return Response({"error": f"Cannot edit in {kyc.status} state."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = KYCSubmissionSerializer(kyc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubmitKYCView(APIView):
    permission_classes = [IsMerchant]

    def post(self, request):
        kyc, created = KYCSubmission.objects.get_or_create(user=request.user)
        try:
            # We call the state machine
            KYCStateMachine.transition(kyc, 'submitted', payload={"message": "KYC Submitted by Merchant"})
            return Response({"status": "success", "message": "KYC Submitted"})
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

# Reviewer Views

class ReviewerQueueView(APIView):
    permission_classes = [IsReviewer]

    def get(self, request):
        # Order by oldest first
        queue = KYCSubmission.objects.exclude(status__in=['draft']).order_by('updated_at')
        
        # Metrics
        total_count = queue.count()
        
        # Avg time in queue (for under_review and submitted)
        now = timezone.now()
        waiting_apps = queue.filter(status__in=['submitted', 'under_review'])
        
        # Risk > 24 hours
        at_risk = waiting_apps.filter(updated_at__lt=now - timezone.timedelta(hours=24)).count()

        # Simple avg time calculation
        waiting_time = 0
        if waiting_apps.exists():
            times = [(now - app.updated_at).total_seconds() for app in waiting_apps]
            waiting_time = sum(times) / len(times) / 3600 # in hours
        
        # Approval rate last 7 days
        seven_days_ago = now - timezone.timedelta(days=7)
        recent_apps = KYCSubmission.objects.filter(updated_at__gte=seven_days_ago)
        approved_count = recent_apps.filter(status='approved').count()
        total_resolved = recent_apps.filter(status__in=['approved', 'rejected']).count()
        
        approval_rate = (approved_count / total_resolved * 100) if total_resolved > 0 else 0

        serializer = KYCSubmissionReviewerSerializer(queue, many=True)
        
        return Response({
            "metrics": {
                "total_count": total_count,
                "avg_time_hours": round(waiting_time, 2),
                "approval_rate": round(approval_rate, 2),
                "at_risk": at_risk
            },
            "queue": serializer.data
        })

class ReviewerApplicationDetailView(generics.RetrieveAPIView):
    permission_classes = [IsReviewer]
    queryset = KYCSubmission.objects.all()
    serializer_class = KYCSubmissionReviewerSerializer

class ReviewerActionView(APIView):
    permission_classes = [IsReviewer]

    def post(self, request):
        submission_id = request.data.get('submission_id')
        action = request.data.get('action') # 'under_review', 'approved', 'rejected', 'more_info_requested'
        reason = request.data.get('reason', '')

        try:
            kyc = KYCSubmission.objects.get(id=submission_id)
        except KYCSubmission.DoesNotExist:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            if action == 'rejected' or action == 'more_info_requested':
                kyc.rejection_reason = reason
                
            KYCStateMachine.transition(kyc, action, payload={"reason": reason, "reviewer": request.user.username})
            return Response({"status": "success", "new_status": kyc.status})
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
