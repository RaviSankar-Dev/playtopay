# Playto KYC Pipeline System 🚀

A high-performance, ultra-premium Merchant Onboarding and Compliance Audit system. Built for speed, security, and exceptional user experience.

![Premium UI](https://img.shields.io/badge/UI-Ultra--Premium-f2b759?style=for-the-badge&logo=glassdoor&logoColor=0a4a3c)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Django%20%7C%20Tailwind%204-0a4a3c?style=for-the-badge)

## ✨ Executive Overview
This system provides a seamless, decentralized pipeline for merchant verification. Featuring a state-of-the-art **"Audit Command Center"** for reviewers and a **"Bento-style Onboarding"** experience for merchants.

### 💎 Key Features
*   **Role-Based Security**: Advanced authentication protocols with secure state-driven access control.
*   **State Machine Architecture**: Centralized lifecycle management (`Draft` → `Submitted` → `Auditing` → `Cleared/Declined`).
*   **Intelligent Onboarding**: Multi-step merchant hub with real-time sync, file validation (5MB max), and cryptographic asset tracking.
*   **Audit Command Center**: High-density reviewer dashboard with real-time operational metrics (Queue length, Avg. Response Time, SLA Risk).
*   **Modern Aesthetics**: "Apple-style" glassmorphism, layered shadows, and high-performance cubic-bezier animations.

---

## 🛠️ Technical Stack
- **Frontend**: React 19 (Vite), Tailwind CSS 4, Zustand (State), Axios (Network), React Router 7
- **Backend**: Django 5.1, Django REST Framework, SimpleJWT (Auth), SQLite (Dev DB)
- **Design System**: Custom design tokens with mesh gradients and backdrop-blur utilities.

---

## 🚀 Rapid Deployment

### 1. Engine (Backend)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
```

### 2. Interface (Frontend)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Operational Credentials
Access the system via the following pre-authorized identities:

| Role | Username | Password |
| :--- | :--- | :--- |
| **System Auditor** | `reviewer1` | `password123` |
| **Merchant (Draft)** | `merchant_draft` | `password123` |
| **Merchant (Active)** | `merchant_review` | `password123` |

---

## 📈 System Architecture
The application utilizes a strict state-transition protocol to ensure data integrity. 
1. **Merchant Entry**: Entity details and assets are established in the registry.
2. **Protocol Submission**: Submission triggers a lock on the record, moving it to the Audit Queue.
3. **Audit Execution**: Reviewers lock the record for auditing, performing asset verification.
4. **Final Determination**: Approval triggers clearance; rejection requires mandatory rationale.

---

Designed with ❤️ by **Playto Engineering**