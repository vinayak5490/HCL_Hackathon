# FastAPI Server for HCL_Hackathon

This folder contains a minimal FastAPI server connected to MongoDB and configured to work with the React + Vite client.

Quick start (Windows `cmd.exe`):

```
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

rem Set Mongo environment variables (adjust URI if needed)
set MONGO_URI=mongodb://localhost:27017
set MONGO_DB=hackathon_db

rem Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The client Vite dev server is configured to proxy `/api` requests to `http://localhost:8000`.

API endpoints:

- `GET /api/health` — health check
- `GET /api/items` — list items from `items` collection
- `POST /api/items` — create a new item (JSON body)
