# BFHL REST APIs

This project provides a simple REST API built using **Node.js and Express**.
It exposes two endpoints as part of the BFHL assignment and supports basic mathematical operations along with a small AI-based query feature.

---

## Available Endpoints

### 1. `POST /bfhl`

Accepts **exactly one** of the following keys in the request body:

* `fibonacci`
* `prime`
* `lcm`
* `hcf`
* `AI`

Only one operation is allowed per request.

---

### 2. `GET /health`

Used to check whether the server is running properly.

---

## Response Format

All **successful responses** follow this structure:

```json
{
  "is_success": true,
  "official_email": "YOUR_CHITKARA_EMAIL",
  "data": ...
}
```

If an error occurs, the API returns:

* An appropriate HTTP status code
* `is_success: false`

---

## Setup Instructions

### Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

---

### Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Update the `.env` file with:

```env
OFFICIAL_EMAIL=yourname@chitkara.edu.in
GEMINI_API_KEY=your_google_gemini_api_key
```

> The Gemini API key can be generated for free from **Google AI Studio**.

---

### Run Locally

```bash
npm start
```

The server will start on:

```
http://localhost:3000
```

(or the port specified in `PORT`)

---

## API Usage Examples

### Health Check

```bash
curl http://localhost:3000/health
```

---

### Fibonacci

```bash
curl -X POST http://localhost:3000/bfhl \
-H "Content-Type: application/json" \
-d "{\"fibonacci\": 7}"
```

---

### Prime Number Filter

```bash
curl -X POST http://localhost:3000/bfhl \
-H "Content-Type: application/json" \
-d "{\"prime\": [2,4,7,9,11]}"
```

---

### LCM

```bash
curl -X POST http://localhost:3000/bfhl \
-H "Content-Type: application/json" \
-d "{\"lcm\": [12,18,24]}"
```

---

### HCF

```bash
curl -X POST http://localhost:3000/bfhl \
-H "Content-Type: application/json" \
-d "{\"hcf\": [24,36,60]}"
```

---

### AI Query (Requires Gemini API Key)

```bash
curl -X POST http://localhost:3000/bfhl \
-H "Content-Type: application/json" \
-d "{\"AI\": \"What is the capital city of Maharashtra?\"}"
```

> The AI response returns a **single-word or short factual answer**.

---

## Deployment (Render)

This project is deployed using **Render**.

### Steps:

1. Go to **Render Dashboard**
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure:

   * **Runtime:** Node
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. Add environment variables:

   * `OFFICIAL_EMAIL`
   * `GEMINI_API_KEY`
6. Deploy the service

After deployment, Render will provide a public URL that can be used to access the API.

---

## Tech Stack

* Node.js (v18 or higher)
* Express.js
* Google Gemini API (for AI responses)

---

## License

MIT License

