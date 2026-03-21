# Node.js Authentication Backend

This is a backend authentication system built using Node.js, Express, MongoDB, and JWT.  
It includes user registration, login, email verification, protected routes, and logout functionality.

---

## Features

- User registration with email verification
- Secure login using JWT
- Password hashing with bcrypt
- Protected routes (current user)
- Logout functionality
- Health check API
- Modular folder structure

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcryptjs
- Nodemailer
- dotenv
- cors

---

## Project Structure
backend/
│
├── controller/
│ ├── auth_controller.js
│ └── healthcheck_controller.js
│
├── db/
│ └── db.js
│
├── middleware/
│ └── auth_middleware.js
│
├── models/
│ └── user_model.js
│
├── router/
│ ├── auth_route.js
│ └── healthcheck_route.js
│
├── utils/
│ └── sendEmail.js
│
├── .env
├── .gitignore
├── app.js
├── index.js
├── package.json

---

## Installation and Setup
### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/backend

2. Install dependencies
npm install

3. Setup environment variables
Create a .env file in the root directory:
PORT=8000
# CORS
CORS_ORIGIN=http://localhost:3000
# Database
MONGO_URI=your_mongodb_connection_string
# JWT
JWT_SECRET=your_jwt_secret

# Email (Mailtrap or SMTP)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password

Running the Server
npm run dev

Server will run on:
http://localhost:8000

API Endpoints
Authentication Routes
#Register User
POST /auth/register
Description: Register a new user and send verification email
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

#Login User
POST /auth/login
Description: Authenticate user and return JWT
Request Body:
{
  "email": "john@example.com",
  "password": "123456"
}

#Get Current User
GET /auth/currentUser
Description: Get logged-in user details (protected route)
Headers:
Authorization: Bearer <token>
Notes

#Logout User
POST /auth/logout
Description: Logout user (requires authentication)
Headers:
Authorization: Bearer <token>
All protected routes require JWT in headers:
Authorization: Bearer <your_token>
Base URL:
http://localhost:8000