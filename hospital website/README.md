# MediCare - Hospital Management System

A full-stack production-ready Hospital Management Web Application built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)

### 1. Setup Backend

```bash
cd backend
npm install

# Edit .env if needed (default uses localhost MongoDB)
# Configure MONGO_URI in backend/.env

npm run seed     # Seed database with demo data
npm run dev      # Start backend (port 5000)
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev      # Start frontend (port 5173)
```

### 3. Open App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔐 Demo Login Credentials

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@hospital.com       | admin123   |
| Doctor  | sarah@hospital.com       | doctor123  |
| Patient | patient@hospital.com     | patient123 |

---

## 📁 Project Structure

```
hospital-website/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & error middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── uploads/        # Uploaded files
│   ├── server.js       # Entry point
│   └── seed.js         # Database seeder
│
└── frontend/
    └── src/
        ├── api/        # Axios API calls
        ├── components/ # Shared components
        ├── context/    # React contexts
        └── pages/
            ├── public/   # Home, Login, Register
            ├── patient/  # Patient dashboard pages
            ├── doctor/   # Doctor dashboard pages
            └── admin/    # Admin dashboard pages
```

---

## 🧩 Features

### Patient
- Dashboard with stats
- Book appointments with doctor selection & time slots
- View medical reports (PDF/image)
- Medicine store with cart & checkout
- Lab test store with cart & checkout
- Order history tracking
- Find doctors with specialization filter
- Health articles
- AI MRI scan analysis (simulated)

### Doctor
- Dashboard with appointment stats
- Patient list
- View patient reports
- Manage appointments (confirm/reject/complete)
- Add prescriptions and feedback

### Admin
- System dashboard with analytics
- Manage all users (CRUD)
- Upload patient reports
- Manage appointments
- Manage medicines inventory
- Manage lab tests
- Manage orders
- Publish health articles
- Analytics with charts (bar, pie)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/users/doctors | List doctors |
| GET | /api/appointments/my | My appointments |
| POST | /api/appointments | Book appointment |
| GET | /api/medicines | List medicines |
| GET | /api/labtests | List lab tests |
| POST | /api/orders | Place order |
| GET | /api/reports/my | My reports |
| GET | /api/articles | List articles |
| GET | /api/notifications | Get notifications |

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcryptjs
- **File Upload**: Multer

---

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospitaldb
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```
