# 🔐 MERN Stack Authentication Backend Blueprint

A production-ready, secure authentication system featuring user registration, session-based login, and two-factor authentication (2FA) with time-based one-time passwords (TOTP). Built with Express.js, MongoDB, and Passport.js.

---

## ✨ Features

### Core Authentication
- **User Registration** - Secure account creation with bcrypt password hashing
- **Session-Based Login/Logout** - Passport.js local strategy authentication
- **Persistent Sessions** - MongoDB session storage with connect-mongo
- **Authentication Status Check** - Real-time user authentication state

### Security Features
- **Two-Factor Authentication (2FA)** - TOTP-based verification
- **QR Code Generation** - Easy setup with authenticator apps (Google Authenticator, Authy, etc.)
- **JWT Token Support** - Token-based authentication after 2FA verification
- **Password Encryption** - Bcrypt hashing with salt rounds
- **Session Security** - HTTP-only cookies and configurable security settings

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | - |
| **Framework** | Express.js | ^5.2.1 |
| **Database** | MongoDB + Mongoose | ^9.0.1 |
| **Authentication** | Passport.js (Local Strategy) | ^0.7.0 |
| **Session Management** | express-session + connect-mongo | ^1.18.2 / ^6.0.0 |
| **Password Hashing** | bcryptjs | ^3.0.3 |
| **2FA/OTP** | speakeasy | ^2.0.0 |
| **QR Code** | qrcode | ^1.5.4 |
| **JWT** | jsonwebtoken | ^9.0.3 |
| **Environment** | dotenv | ^17.2.3 |
| **CORS** | cors | ^2.8.5 |
| **Dev Tools** | nodemon | ^3.1.11 |

---

## 📁 Project Structure

```
backend/
├── configs/
│   ├── dbconnect.js          # MongoDB connection configuration
│   └── passportConfig.js     # Passport.js strategy setup
├── controllers/
│   └── authController.js     # Authentication logic and handlers
├── models/
│   └── user.js              # User schema and model
├── routes/
│   └── authRoutes.js        # API route definitions
├── .env                     # Environment variables (not in repo)
├── index.js                 # Application entry point
└── package.json             # Dependencies and scripts
```

---

## 🚀 Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Initialize and install dependencies
npm init -y
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/your-database-name
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Session Secret (generate a strong random string)
SESSION_SECRET=your-super-secure-session-secret-here

# JWT Secret (for 2FA token generation)
JWT_SECRET=your-jwt-secret-key-here

# CORS (optional, defaults to http://localhost:5173)
CLIENT_URL=http://localhost:5173
```

**🔒 Security Note:** Never commit the `.env` file to version control!

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
node index.js
```

Server will run on `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL: `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/register` | Register new user | ❌ |
| **POST** | `/login` | Login user | ❌ |
| **POST** | `/logout` | Logout user | ✅ |
| **GET** | `/status` | Check authentication status | ❌ |
| **POST** | `/2fa/setup` | Enable 2FA and get QR code | ✅ |
| **POST** | `/2fa/verify` | Verify 2FA token | ✅ |
| **POST** | `/2fa/reset` | Disable 2FA | ✅ |

---

## 🧪 Testing with Postman

### 1. Register a New User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "username": "testuser",
    "isMfaActive": false
  }
}
```

### 3. Check Authentication Status

```http
GET http://localhost:5000/api/auth/status
```

**Response:**
```json
{
  "isAuthenticated": true,
  "user": {
    "username": "testuser",
    "isMfaActive": false
  }
}
```

### 4. Setup 2FA

```http
POST http://localhost:5000/api/auth/2fa/setup
```

**Response:**
```json
{
  "secret": "BASE32_ENCODED_SECRET",
  "qrCode": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Steps:**
1. Scan the QR code with Google Authenticator or Authy
2. Use the 6-digit code from the app to verify

### 5. Verify 2FA Token

```http
POST http://localhost:5000/api/auth/2fa/verify
Content-Type: application/json

{
  "token": "123456"
}
```

**Response:**
```json
{
  "message": "2FA successful",
  "token": "JWT_TOKEN_HERE"
}
```

### 6. Reset 2FA

```http
POST http://localhost:5000/api/auth/2fa/reset
```

**Response:**
```json
{
  "message": "2FA reset successful"
}
```

### 7. Logout

```http
POST http://localhost:5000/api/auth/logout
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

## 🗄 Database Schema

### User Model

```javascript
{
  username: String,        // Unique username
  password: String,        // Bcrypt hashed password
  isMfaActive: Boolean,    // 2FA enabled status
  twoFactorSecret: String, // TOTP secret (optional)
  timestamps: true         // createdAt, updatedAt
}
```

---

## 🔐 Security Best Practices

### Implemented Security Measures

✅ **Password Hashing** - Bcrypt with 10 salt rounds  
✅ **HTTP-Only Cookies** - Prevents XSS attacks  
✅ **Session Security** - Secure session storage in MongoDB  
✅ **CORS Configuration** - Controlled cross-origin access  
✅ **Environment Variables** - Sensitive data kept secure  
✅ **2FA Support** - Additional authentication layer  
✅ **Session Expiry** - 1-hour session timeout

### Production Recommendations

🔒 **Always use HTTPS** in production  
🔒 Set `cookie.secure: true` for HTTPS  
🔒 Use strong, unique secrets (32+ characters)  
🔒 Regularly update dependencies  
🔒 Implement rate limiting (e.g., express-rate-limit)  
🔒 Add request validation (e.g., express-validator)  
🔒 Enable MongoDB authentication  
🔒 Use environment-specific configurations  

---

## 🎯 Key Implementation Details

### Session Configuration

```javascript
session({
  name: 'mern-2fa-session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false, // Set true in production with HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
})
```

### 2FA Flow

1. User enables 2FA via `/2fa/setup`
2. Backend generates TOTP secret using speakeasy
3. QR code is created and returned to client
4. User scans QR code with authenticator app
5. User enters 6-digit code to verify
6. Backend validates token and issues JWT

---



**Built with ❤️ for secure, scalable authentication**
