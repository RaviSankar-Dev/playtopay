# Playto KYC Pipeline Challenge

A full-stack web application for a merchant KYC onboarding and reviewer approval system.

## Tech Stack
* **Frontend:** React, Tailwind CSS, Zustand, React Router DOM
* **Backend:** Django, Django REST Framework, SimpleJWT
* **Database:** SQLite

## Features
* **Role-Based Authentication:** Merchants can manage their KYC submissions, and Reviewers can view all submissions in a queue.
* **State Machine:** Strict state transitions handled centrally (`draft -> submitted -> under_review -> approved/rejected`).
* **Multi-Step Form:** Merchant dashboard includes a multi-step form for personal details, business details, and document upload (validated for max 5MB and specific types).
* **Metrics Dashboard:** Reviewer dashboard features vital statistics (Queue length, avg time, approval rate, risk).
* **Document Management:** Upload, preview, and review functionality for PAN, Aadhaar, and Bank Statements.

## Local Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt # (or install django djangorestframework djangorestframework-simplejwt django-cors-headers)

python manage.py makemigrations
python manage.py migrate

# Seed the database with mock data (Merchant 1, Merchant 2, Reviewer 1)
python manage.py seed

# Run the server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Usage

Access the frontend at `http://localhost:5173`.
* **Login as Reviewer:** `reviewer1` / `password123`
* **Login as Draft Merchant:** `merchant_draft` / `password123`
* **Login as Under Review Merchant:** `merchant_review` / `password123`

## Deployment Guides

### Frontend -> Vercel
1. Push the `frontend` directory to a GitHub repository.
2. Link the repository to Vercel.
3. Vercel will automatically detect the Vite setup. Set the Root Directory to `frontend`.
4. Add any required environment variables (e.g., API base URL).
5. Deploy!

### Backend -> Render
1. Push the `backend` directory to a GitHub repository.
2. In Render, create a new **Web Service**.
3. Select your repository and set the Root Directory to `backend`.
4. Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start Command: `gunicorn core.wsgi:application`
6. Add environment variables: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, and configure external storage like AWS S3 for media uploads.
