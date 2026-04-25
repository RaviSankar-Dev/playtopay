from django.urls import path
from .views import SignupView, MyKYCView, SaveDraftView, SubmitKYCView, ReviewerQueueView, ReviewerApplicationDetailView, ReviewerActionView
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    authentication_classes = []

urlpatterns = [
    # Auth
    path('signup', SignupView.as_view(), name='signup'),
    path('login', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # Merchant
    path('my-kyc', MyKYCView.as_view(), name='my-kyc'),
    path('kyc/save-draft', SaveDraftView.as_view(), name='save-draft'),
    path('kyc/submit', SubmitKYCView.as_view(), name='submit-kyc'),

    # Reviewer
    path('reviewer/queue', ReviewerQueueView.as_view(), name='reviewer-queue'),
    path('reviewer/application/<int:pk>', ReviewerApplicationDetailView.as_view(), name='reviewer-application'),
    path('reviewer/action', ReviewerActionView.as_view(), name='reviewer-action'),
]
