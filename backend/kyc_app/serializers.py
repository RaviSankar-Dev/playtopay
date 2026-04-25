from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import KYCSubmission, NotificationLog

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'merchant')
        )
        return user

class KYCSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCSubmission
        fields = '__all__'
        read_only_fields = ('user', 'status', 'rejection_reason', 'created_at', 'updated_at')

    def validate(self, attrs):
        # File validation logic for < 5MB and type PDF/JPG/PNG
        max_size = 5 * 1024 * 1024 # 5MB

        for field_name in ['pan_card', 'aadhaar_card', 'bank_statement']:
            file = attrs.get(field_name)
            if file:
                if file.size > max_size:
                    raise serializers.ValidationError({field_name: "File size cannot exceed 5MB."})
                
                ext = file.name.split('.')[-1].lower()
                if ext not in ['pdf', 'jpg', 'jpeg', 'png']:
                    raise serializers.ValidationError({field_name: "Only PDF, JPG, or PNG files are allowed."})
                
        return attrs

class KYCSubmissionReviewerSerializer(serializers.ModelSerializer):
    merchant_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = KYCSubmission
        fields = '__all__'

class NotificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationLog
        fields = '__all__'

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token
