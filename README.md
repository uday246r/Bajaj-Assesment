# BFHL REST APIs

Two REST endpoints as required:

- **POST /bfhl** — Accepts exactly one of: `fibonacci`, `prime`, `lcm`, `hcf`, `AI`
- **GET /health** — Health check

## Response structure

All success responses include:

```json
{
  "is_success": true,
  "official_email": "YOUR CHITKARA EMAIL",
  "data": ...
}
```

Errors return appropriate HTTP status codes and `is_success: false`.

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env`
   - Set `OFFICIAL_EMAIL` to your Chitkara email (e.g. `your.name@chitkara.edu.in`)
   - For the **AI** key: set `GEMINI_API_KEY` (free key from [Google AI Studio](https://aistudio.google.com) → Get API Key)

3. **Run locally**
   ```bash
   npm start
   ```
   Server runs at `http://localhost:3000` (or `PORT` from env).

## API usage

- **GET /health**
  ```bash
  curl http://localhost:3000/health
  ```

- **POST /bfhl** (examples)
  ```bash
  # Fibonacci
  curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"fibonacci\": 7}"

  # Prime filter
  curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"prime\": [2,4,7,9,11]}"

  # LCM
  curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"lcm\": [12,18,24]}"

  # HCF
  curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"hcf\": [24,36,60]}"

  # AI (requires GEMINI_API_KEY)
  curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"AI\": \"What is the capital city of Maharashtra?\"}"
  ```

## Deployment

### Vercel

1. Login at [vercel.com](https://vercel.com) → New Project → Import your Git repository.
2. Set environment variables: `OFFICIAL_EMAIL`, `GEMINI_API_KEY`.
3. Deploy. Use the generated URL (e.g. `https://your-app.vercel.app`).

### Railway

1. New Project → Deploy from GitHub → Select this repo.
2. Add variables: `OFFICIAL_EMAIL`, `GEMINI_API_KEY`.
3. Deploy and copy the public URL.

### Render

1. New → Web Service → Connect repository.
2. Runtime: Node. Build: `npm install`. Start: `npm start`.
3. Add env vars: `OFFICIAL_EMAIL`, `GEMINI_API_KEY`.
4. Deploy and copy the URL.

### ngrok (local testing)

```bash
npm start
# In another terminal:
ngrok http 3000
```

Use the ngrok URL; keep the local server running.

## Tech stack

- Node.js (≥18)
- Express
- Google Gemini API for the **AI** key (single-word answer)

## License

MIT
