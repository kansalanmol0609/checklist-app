# Checklist App Backend

This is the Express + Mongoose backend for the checklist app, written in TypeScript.

## Setup

1. Copy `.env.example` to `.env` and fill in your Mongo URI and PORT.

2. Install dependencies:
   ```bash
   npm install
   ```
3. Run MongoDB in Docker (if not already running):
   ```bash
   docker run -d --name nudgeme-mongo -p 27017:27017 -v "$(pwd)/mongo-data:/data/db" -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo:6.0
   ```
4. Start in dev mode with live reload:
   ```bash
   npm run dev
   ```
5. (Optional) Build for production:
   ```bash
   npm run build
   npm start
   ```

The API will be available at `http://localhost:3000/api/checklists`.
