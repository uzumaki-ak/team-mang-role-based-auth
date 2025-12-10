# Team Management Role-Based Authentication System 🚀

A robust Next.js application implementing role-based authentication and authorization, supporting team management, user roles, and secure login/logout workflows.

---

![Next.js](https://img.shields.io/badge/Next.js-16.0.6-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-blue)
![JWT](https://img.shields.io/badge/JWT-9.0.2-yellow)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.0-cyan)

---

## Overview

**Team Management Role-Based Authentication System** is a Next.js-based web application that provides secure user registration, login, and role management within teams. It leverages Prisma ORM for database interactions, JWT tokens for authentication, and Tailwind CSS for styling. The system supports multiple roles such as ADMIN, MANAGER, USER, and GUEST, each with different access levels, along with team assignment functionalities.

## Features

- User registration with optional team association via team codes
- Secure login/logout with JWT stored in HTTP-only cookies
- Fetch current authenticated user details
- Role-based access control (Admin, Manager, User, Guest)
- Assign and update user roles
- Assign users to teams and manage team memberships
- View and filter users based on roles and team associations
- Health check endpoint for database connectivity
- Seed script for initial database setup with sample users and teams

## Tech Stack

| Technology       | Purpose                                    |
|------------------|--------------------------------------------|
| Next.js 16       | React framework for server-side rendering  |
| TypeScript       | Type safety and improved developer experience |
| Prisma ORM       | Database modeling and querying             |
| PostgreSQL       | Relational database                        |
| Tailwind CSS     | Utility-first CSS framework                |
| JWT              | Token-based authentication                 |
| bcrypt           | Password hashing                           |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or above
- [PostgreSQL](https://www.postgresql.org/) database
- Environment variables setup (see **Configuration** section)

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/team-mang-role-based-auth-main.git
cd team-mang-role-based-auth-main
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Setup Environment Variables

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/yourdatabase
JWT_SECRET=your_jwt_secret_key
```

Replace placeholders with your actual database credentials and a secure secret key.

### Database Migration & Seeding

Run Prisma migrations:

```bash
npx prisma db push
```

Seed the database with sample data:

```bash
npx tsx prisma/seed.ts
```

---

## Usage

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Authentication Flows

- Register a new user (POST `/api/auth/register`)
- Login (POST `/api/auth/login`)
- Fetch current user info (GET `/api/auth/me`)
- Logout (POST `/api/auth/logout`)

### Managing Users

- View all users (GET `/api/user`)
- Change user roles (PATCH `/api/user/[userId]/role`)
- Assign user to a team (PATCH `/api/user/[userId]/team`)

### Health Check

Verify API server health and database connection:

- GET `/api/health`

---

## Project Structure Overview

```
team-mang-role-based-auth-main/
├── app/
│   ├── api/
│   │   ├── auth/             # Authentication routes: login, logout, me, register
│   │   ├── health/           # Health check endpoint
│   │   ├── user/             # User management: list, update role, assign team
│   │   │   └── [userId]/
│   │   │       ├── role.ts
│   │   │       └── team.ts
│   │   └── user.ts             # Fetch users with filters
│   ├── lib/                   # Utility functions: auth, db connection
│   ├── types/                 # TypeScript interfaces and enums
│   ├── layout.tsx             # Root layout with fonts
│   ├── globals.css            # Tailwind CSS styles
│   └── page.tsx               # Home page
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script for initial data
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── .gitignore                 # Files to ignore in version control
```

---

## Configuration

### Environment Variables

Create a `.env` file at the root:

```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database>
JWT_SECRET=<your-secret-key>
```

Ensure your PostgreSQL database is running and accessible.

### Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma db push
```

Seed sample data:

```bash
npx tsx prisma/seed.ts
```

---

## API Documentation

### Authentication

- **POST `/api/auth/register`**  
  Register a new user. Request body: `{ email, name, password, teamCode? }`

- **POST `/api/auth/login`**  
  Authenticate user with email and password. Request body: `{ email, password }`

- **GET `/api/auth/me`**  
  Fetch current authenticated user.

- **POST `/api/auth/logout`**  
  Log out the current user.

### User Management

- **GET `/api/user`**  
  Retrieve users with optional filters: `teamId`, `role`.

- **PATCH `/api/user/[userId]/role`**  
  Update user role. Request body: `{ role }`  
  Only accessible by ADMIN.

- **PATCH `/api/user/[userId]/team`**  
  Assign or remove user from a team. Request body: `{ teamId }`  
  Only accessible by ADMIN.

### Health Check

- **GET `/api/health`**  
  Checks database connectivity and API health.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a pull request

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## Final Notes

This project provides a solid foundation for role-based access control with team management in Next.js. Feel free to customize roles, permissions, and features to suit your application's needs.

---

**Happy coding! 🚀**