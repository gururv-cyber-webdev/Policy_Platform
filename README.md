# 📜 Policy Platform – Corporate Compliance & Quiz System

A full-stack **Policy Management & Compliance Platform** that ensures employees read updated company policies and complete mandatory quizzes after every policy update.

Built with **MERN Stack (MongoDB, Express, React, Node.js)**.

---

## ✨ Key Features

### 👤 User Features

* Secure login & registration
* Policy viewing & tracking
* Automatic reset after policy updates
* Mandatory quiz after updates
* Track:

  * Last visited time
  * Quiz status & score
  * Policies read after update

### 🛡️ Admin Features

* Upload & update policies
* Policy versioning (auto increment)
* Reset user compliance on policy update
* Approve employees
* View reports & analytics

### 🧠 Compliance Logic

* Every policy update **resets**:

  * User visits count
  * Quiz status
* Quiz is **mandatory after updates**
* Only **latest quiz score** is stored
* Visits are counted **only after last update**

---

## 🧱 Tech Stack

* **Frontend:** React, Axios, Context API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Auth:** JWT
* **File Uploads:** Multer
* **Security:** Password hashing, protected routes

---

## 📁 Project Folder Structure

```
projv2demo/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── seedAdmin.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── policyController.js
│   │   │   ├── quizController.js
│   │   │   ├── registerController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Policy.js
│   │   │   ├── PendingPolicy.js
│   │   │   ├── Quiz.js
│   │   │   ├── QuizAttempt.js
│   │   │   ├── User.js
│   │   │   └── ViewLog.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── policies.js
│   │   │   ├── pendingPolicies.js
│   │   │   ├── quiz.js
│   │   │   ├── reports.js
│   │   │   ├── search.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── utils/
│   │   │   └── versioning.js
│   │   │
│   │   └── uploads/
│   │
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── policies.js
│   │   │   ├── quiz.js
│   │   │   └── users.js
│   │   │
│   │   ├── components/
│   │   │   ├── GuardedRoute.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   ├── PolicyCard.js
│   │   │   ├── QuizCard.js
│   │   │   └── Sidebar.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── PendingPolicies.js
│   │   │   ├── Policies.js
│   │   │   ├── PolicyDetails.js
│   │   │   ├── QuizPage.js
│   │   │   ├── Register.js
│   │   │   ├── Reports.js
│   │   │   ├── SearchBar.js
│   │   │   └── UserPage.js
│   │   │
│   │   ├── App.js
│   │   ├── routes.js
│   │   └── index.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### 📌 Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/policy_platform
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
UPLOAD_DIR=uploads
```

### 📌 Frontend `.env`

```env
REACT_APP_API_BASE=http://localhost:5000/api
```

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/gururv-cyber-webdev/Policy_Platform.git
cd Policy_Platform
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at 👉 `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at 👉 `http://localhost:3000`

---

## 🧪 Default Admin Setup

Run once to create an admin user:

```bash
node src/config/seedAdmin.js
```

---

## 🔐 Authentication Flow

* JWT stored in `localStorage`
* Token attached via Axios interceptor
* Protected routes via middleware

---

## 📊 Compliance Tracking Logic

* **Policy update ⇒ Version increment**
* **User visits reset**
* **Quiz forced after update**
* **Only latest quiz score stored**
* **Visits counted after lastVisitedAt**

---

## 🏁 Future Enhancements

* Email notifications
* Time-spent analytics
* Policy acknowledgment certificates
* Role-based dashboards
