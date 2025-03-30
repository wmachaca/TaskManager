# Task Manager Setup

## Development Environment

1. Clone the repository
2. Set up **backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your values
   npx prisma migrate dev
   npm start/node server.js
3. Set up **frontend**:
    cd ../frontend
    npm install
    npm run dev   

## Editor Setup
This project uses EditorConfig to maintain consistent coding styles. 
Most modern editors support this natively or via plugins.    