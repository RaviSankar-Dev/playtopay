from rest_framework.exceptions import ValidationError
from .models import NotificationLog

class KYCStateMachine:
    """
    Handles strict state transitions for KYC Submission.
    Any invalid transition throws a ValidationError.
    """
    VALID_TRANSITIONS = {
        'draft': ['submitted'],
        'submitted': ['under_review'],
        'under_review': ['approved', 'rejected', 'more_info_requested'],
        'more_info_requested': ['submitted'],
        'approved': [],
        'rejected': [],
    }

    @classmethod
    def transition(cls, submission, new_status, payload=None):
        if new_status not in cls.VALID_TRANSITIONS.get(submission.status, []):
            raise ValidationError({"error": "Illegal state transition"})

        submission.status = new_status
        submission.save()

        # Log notification
        if payload is None:
            payload = {}
        
        NotificationLog.objects.create(
            merchant=submission.user,
            event_type=new_status,
            payload=payload
        )
        return submission
