# FastAPI + React Monorepo

This project demonstrates a FastAPI backend with a React frontend, both hosted on the same domain.

## Setup

1. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

4. Run the FastAPI server:
   ```
   cd backend
   uvicorn main:app --reload
   ```

5. Open your browser and navigate to `http://localhost:8000`

## Development

- For frontend development, run `npm start` in the `frontend` directory.
- For backend development, run `uvicorn main:app --reload` in the `backend` directory.