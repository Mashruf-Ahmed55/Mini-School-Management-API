# 🏫 Mini School Management API

A complete, production-ready **School Management API** built with **NestJS**, **PostgreSQL**, and **Prisma ORM**, featuring JWT authentication, role-based access, and full student/class management.

---

## 🔥 Features

### Authentication & Authorization

- JWT access & refresh tokens
- Role-based access control (**Admin, Teacher, Student**)
- Password hashing with **bcryptjs**
- Protected routes with **Guards**

### Student Management

- Create students (Admin only)
- List students with pagination & search
- Get student details
- Automatic user account creation

### Class Management

- Create classes (Admin only)
- Enroll students in classes
- Get class details and student lists
- Prevent duplicate enrollments

### Database Design

- Proper relationships between entities
- Indexes for performance
- Data validation and constraints

### Technical Stack

- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** class-validator & class-transformer
- **Documentation:** Postman
- **Dockerized** for easy setup
- **Database seeding script** included

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone <your-repo>
cd school-management-api
npm install
cp .env.example .env  # Update with your database URL
```

### 2. Start Database

```bash
docker-compose up -d postgres
```

### 3. Setup Database

```bash
npx prisma db push
npm run prisma:seed
```

### 4. Start Development

```bash
npm run start:dev
```

- API is available at: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Configuration (`.env`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/school_management"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRATION_TIME="15m"
JWT_REFRESH_EXPIRATION_TIME="7d"
```

---

## 📦 Package.json Scripts

```json
{
  "prisma:generate": "prisma generate",
  "prisma:push": "prisma db push",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "tsx prisma/seed.ts",
  "db:reset": "prisma migrate reset --force"
}
```

---

## 🛠️ API Endpoints

### Authentication

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | `/auth/signup`  | User registration               |
| POST   | `/auth/login`   | User login                      |
| POST   | `/auth/logout`  | User logout (requires JWT)      |
| GET    | `/auth/profile` | Get user profile (requires JWT) |

### Students

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| POST   | `/students`     | Create student (Admin only)       |
| GET    | `/students`     | List all students (Admin/Teacher) |
| GET    | `/students/:id` | Get student details               |

### Classes

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| POST   | `/classes`              | Create class (Admin only)               |
| GET    | `/classes`              | List all classes                        |
| GET    | `/classes/:id`          | Get class details                       |
| POST   | `/classes/:id/enroll`   | Enroll student in class (Admin/Teacher) |
| GET    | `/classes/:id/students` | Get students of a class                 |

---

## 🧪 Testing with Sample Credentials

```json
# Admin
{
  "email": "admin@school.com",
  "password": "admin123"
}

# Teacher
{
  "email": "teacher@school.com",
  "password": "teacher123"
}

# Student
{
  "email": "alice.johnson@student.school.com",
  "password": "student123"
}
```

---

## 📄 Postman Collection

Save this as `school-management-api.postman_collection.json` and import into Postman.

---

## 📝 Notes

- JWT access token expires in 15 minutes; refresh token expires in 7 days.
- Role-based guards ensure only authorized users can perform actions.
- Database is pre-seeded with admin, teacher, and student accounts.

💡 **Pro Tip:** Keep your `.env` secrets safe! Never push them to public repos.
