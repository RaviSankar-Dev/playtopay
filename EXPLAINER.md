# Playto KYC Pipeline Explainer

### 1. State Machine Location
The KYC State Machine logic is centralized in the backend inside `backend/kyc_app/services.py`. It is implemented as a `KYCStateMachine` class with strict transition rules defined in a dictionary `VALID_TRANSITIONS`. When a transition is requested, the `transition()` method checks if the new state is valid given the current state. If not, it throws a `ValidationError` which is handled by the views to return a `400 Bad Request`.

### 2. Upload Validation Code
Upload validation is implemented in the `KYCSubmissionSerializer` (`backend/kyc_app/serializers.py`). In the `validate()` method, the size of each uploaded document is checked against a 5MB limit, and the file extension is strictly verified to ensure only `PDF`, `JPG`, `JPEG`, or `PNG` files are processed. Similar client-side checks also exist in `frontend/src/pages/merchant/Dashboard.jsx`.

### 3. Reviewer Queue Query
The reviewer queue query is located in `backend/kyc_app/views.py` inside the `ReviewerQueueView`. The base query fetches all non-draft submissions, ordering them by `updated_at` to ensure the oldest applications are shown first:
`queue = KYCSubmission.objects.exclude(status__in=['draft']).order_by('updated_at')`
Additional aggregations run over this query to calculate metrics like "At Risk" (waiting > 24 hours) and "Approval Rate".

### 4. Auth Protection Logic
**Backend**: Protected by Django REST Framework's permission classes. We use custom `IsMerchant` and `IsReviewer` classes located in `backend/kyc_app/views.py`. These check `request.user.role`.
**Frontend**: Auth state is managed globally via `Zustand` (`frontend/src/store/authStore.js`). A custom React component `<ProtectedRoute />` (`frontend/src/components/ProtectedRoute.jsx`) wraps the dashboard routes. If a user tries to access a route that doesn't match their assigned role, they are automatically redirected.

### 5. One AI-Generated Bug Fixed
**Bug**: Incorrectly defining the Django Model inheritance in `kyc_app/models.py`. 
**Details**: Initially, the `KYCSubmission` model was mistakenly declared as `class KYCSubmission(models.fields):`. This would cause fatal errors during `makemigrations` since a model must inherit from `models.Model`, not `models.fields`. I fixed this by using a find-and-replace tool to change it to `class KYCSubmission(models.Model):` before running migrations, ensuring a clean setup. Another issue encountered was adjusting how the `SimpleJWT` user roles were transferred to the frontend without requiring an extra network request, fixed by overriding `TokenObtainPairSerializer`.
