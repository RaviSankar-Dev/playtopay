from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from .models import KYCSubmission
from .services import KYCStateMachine

User = get_user_model()

class KYCStateMachineTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_merchant', password='password123', role='merchant')
        self.submission = KYCSubmission.objects.create(user=self.user, status='approved')

    def test_approved_to_draft_fails(self):
        with self.assertRaises(ValidationError) as context:
            KYCStateMachine.transition(self.submission, 'draft')
        
        self.assertIn("error", context.exception.detail)
        self.assertEqual(str(context.exception.detail["error"]), "Illegal state transition")
