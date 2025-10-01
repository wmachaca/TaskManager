# Task Manager

Task Manager is a full-stack application for managing tasks with features like user authentication, task creation, updates, and deletion. It is built with **Node.js**, **PostgreSQL**, **React**, and **Prisma ORM**.

🔗 Live Demo (Frontend): taskmanagerfrontwima.netlify.app

---

## Features

- **Backend**: RESTful API with Node.js, Express, PostgreSQL and Prisma.
- **Frontend**: React (Vite) UI.
- **Authentication**: JWT + Google OAuth2.
- **Task Management**: CRUD with validation & soft delete.
- **Testing**: Unit tests for backend endpoints.
- **Security**: Password hashing, rate limiting, centralized error handling

---

## 🚀 Installation & Usage

### Prerequisites

- **Node.js**: `v22.14.0` (use `.nvmrc` for version management).
- **PostgreSQL**: PostgreSQL 15+.
- **NPM**: Comes with Node.js.
- **Test database user:** `testuser` (create with: `CREATE USER testuser WITH PASSWORD 'yourpassword'`)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/wmachaca/TaskManager.git
cd TaskManager

# Copy environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Initialize Databases

#### Development Database

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Run migrations for the development database
npx prisma migrate dev
```

#### Test Database (One-Time Setup)

```bash
# Create the test database
psql -U postgres -h localhost -c "CREATE DATABASE taskmanager_test WITH OWNER testuser"

# Apply migrations to the test database
DATABASE_URL=postgresql://testuser:yourpassword@localhost:5432/taskmanager_test npx prisma migrate deploy
```

### 3. Start Development Servers

```bash
# Start the backend server
npm run dev

# Navigate to the frontend folder
cd ../frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
```

### 4. Testing

```bash
# Navigate to the backend folder
cd backend

# Run unit tests
npm test
```

---

## 📂 Project Structure

### Backend

- **`src/`**: Contains all backend source code.
  - **`api/`**: API routes, controllers, and middleware.
  - **`utils/`**: Utility functions like password hashing.
  - **`config/`**: Configuration files (e.g., Passport.js for Google OAuth).
  - **`database/`**: Prisma ORM client setup.
- **`tests/`**: Unit tests for backend endpoints.

### Frontend

- **`src/`**: Contains all frontend source code.
  - **`components/`**: Reusable React components.
  - **`pages/`**: Page-level components for routing.
  - **`utils/`**: Utility functions like API client setup.
  - **`context/`**: React context for global state management.

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Editor Setup

This project uses **EditorConfig** to maintain consistent coding styles. Most modern editors support this natively or via plugins.

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
