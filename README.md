# 🔐 Authify — Full Stack Authentication System

A secure, production-ready authentication system built with **Spring Boot** (backend) and **React + Vite** (frontend). Authify provides a complete user authentication flow including registration, login, email verification via OTP, and password reset.

---

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 21 + Spring Boot 4.0 | Core framework |
| Spring Security + JWT | Authentication & authorization |
| Spring Data JPA + Hibernate | Database ORM |
| MySQL | Database |
| JavaMail (Brevo SMTP) | Email OTP delivery |
| Lombok | Boilerplate reduction |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework & build tool |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client |
| Context API | Global auth state management |
| Pure CSS | Styling (no UI framework) |

---

## ✨ Features

- ✅ User Registration with input validation
- ✅ User Login with JWT authentication
- ✅ JWT stored as **HttpOnly cookie** (XSS protection)
- ✅ Email Verification via OTP
- ✅ Password Reset via OTP
- ✅ Protected routes (dashboard only accessible when logged in)
- ✅ Auto-redirect (logged in users skip login/register pages)
- ✅ Persistent session (cookie survives page refresh)
- ✅ Verification status badge in header
- ✅ Responsive design — works on mobile and desktop
- ✅ CORS configured for local development

---

## 📁 Project Structure
```
Authify/
├── authify/                             # Spring Boot Backend
│   ├── src/main/java/in/tanu/authify/
│   │   ├── controller/
│   │   │   ├── AuthController.java      # Login, OTP, Reset Password
│   │   │   └── ProfileController.java   # Register, Get Profile
│   │   ├── entity/
│   │   │   └── UserEntity.java          # User database model
│   │   ├── service/
│   │   │   ├── ProfileServiceImpl.java
│   │   │   └── EmailService.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java      # JWT + CORS config
│   │   ├── filter/
│   │   │   └── JwtRequestFilter.java    # JWT validation filter
│   │   └── util/
│   │       └── JwtUtil.java             # Token generation/validation
│   └── src/main/resources/
│       └── application.properties       # Config (use your own values)
│
└── authify-frontend/                    # React + Vite Frontend
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Home.jsx                 # Dashboard
        │   ├── EmailVerify.jsx
        │   └── ResetPassword.jsx
        ├── components/
        │   ├── Header.jsx
        │   ├── ProtectedRoute.jsx
        │   └── VerificationModal.jsx
        ├── context/
        │   └── AuthContext.jsx          # Global auth state
        └── services/
            └── authService.js           # All API calls
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:-------------:|-------------|
| POST | `/api/v1.0/register` | ❌ | Create new account |
| POST | `/api/v1.0/login` | ❌ | Login, sets JWT cookie |
| GET | `/api/v1.0/is-authenticated` | ❌ | Check if session is valid |
| GET | `/api/v1.0/profile` | ✅ | Get logged-in user profile |
| POST | `/api/v1.0/send-otp` | ✅ | Send email verification OTP |
| POST | `/api/v1.0/verify-otp` | ✅ | Verify email with OTP |
| POST | `/api/v1.0/send-reset-otp` | ❌ | Send password reset OTP |
| POST | `/api/v1.0/reset-password` | ❌ | Reset password with OTP |

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+
- Maven

---

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/authify.git
cd authify
```

### 2. Backend Setup

**Create the MySQL database:**
```sql
CREATE DATABASE authify_app;
```

**Fill in your `application.properties`:**
```properties
server.port=8081
server.servlet.context-path=/api/v1.0

spring.datasource.url=jdbc:mysql://localhost:3306/authify_app
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update

jwt.secret.key=your_jwt_secret_key_here

spring.mail.host=smtp-relay.brevo.com
spring.mail.port=587
spring.mail.username=your_brevo_smtp_username
spring.mail.password=your_brevo_smtp_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.protocol=smtp
spring.mail.properties.mail.smtp.from=your_email@gmail.com
```

**Run the backend:**
```bash
cd authify
./mvnw spring-boot:run
```
> Backend runs at: `http://localhost:8081`

---

### 3. Frontend Setup
```bash
cd authify-frontend
npm install
npm run dev
```
> Frontend runs at: `http://localhost:5173`

---

## 🔐 Authentication Flow
```
Register ──► Auto Login ──► JWT Cookie Set ──► Dashboard
                                                   │
                                          Verify Email (OTP)
                                                   │
                                         Full Account Access

Forgot Password ──► Send OTP to Email ──► Enter OTP + New Password ──► Login
```

---

## 🌐 Environment Variables

**Frontend** — create `authify-frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8081/api/v1.0
```

---

## 👩‍💻 Author

**Tanushree**  
GitHub: [@tanushree31303](https://github.com/tanushree31303)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
