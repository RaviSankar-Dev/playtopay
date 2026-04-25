from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from kyc_app.models import KYCSubmission
from kyc_app.services import KYCStateMachine

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with initial users and KYC data'

    def handle(self, *args, **kwargs):
        # Create Reviewer
        reviewer, created = User.objects.get_or_create(username='reviewer1', role='reviewer')
        if created:
            reviewer.set_password('password123')
            reviewer.save()
            self.stdout.write(self.style.SUCCESS('Successfully created reviewer1'))

        # Create Merchant 1 (Draft)
        merchant_1, created = User.objects.get_or_create(username='merchant_draft', role='merchant')
        if created:
            merchant_1.set_password('password123')
            merchant_1.save()
            kyc_1 = KYCSubmission.objects.create(
                user=merchant_1,
                full_name='Merchant Draft User',
                business_name='Draft Business LLC',
                status='draft'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created merchant_draft (Draft)'))

        # Create Merchant 2 (Under Review)
        merchant_2, created = User.objects.get_or_create(username='merchant_review', role='merchant')
        if created:
            merchant_2.set_password('password123')
            merchant_2.save()
            
            kyc_2 = KYCSubmission.objects.create(
                user=merchant_2,
                full_name='Merchant Review User',
                business_name='Review Business LLC',
                status='draft'
            )
            
            # Transition through state machine
            KYCStateMachine.transition(kyc_2, 'submitted')
            KYCStateMachine.transition(kyc_2, 'under_review')

            self.stdout.write(self.style.SUCCESS('Successfully created merchant_review (Under Review)'))
