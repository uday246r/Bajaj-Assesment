/**
 * REST API server: POST /bfhl and GET /health
 * Strict response structure, validation, and error handling.
 */

require('dotenv').config();

const express = require('express');
const { fibonacci, primesFromArray, lcmOfArray, hcfOfArray } = require('./lib/logic');
const { askGemini } = require('./lib/ai');

const app = express();

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'YOUR CHITKARA EMAIL';
const VALID_KEYS = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
const MAX_BODY_SIZE = '50kb';

app.use(express.json({ limit: MAX_BODY_SIZE }));
app.use(express.urlencoded({ extended: false, limit: MAX_BODY_SIZE }));

function successResponse(data) {
  return {
    is_success: true,
    official_email: OFFICIAL_EMAIL,
    data,
  };
}

function getExactlyOneKey(body) {
  if (!body || typeof body !== 'object') return { err: 'Request body must be a JSON object' };
  const present = VALID_KEYS.filter((k) => body[k] !== undefined && body[k] !== null);
  if (present.length === 0) return { err: 'Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI' };
  if (present.length > 1) return { err: 'Request must contain exactly one key, found: ' + present.join(', ') };
  return { key: present[0] };
}

function validateFibonacci(val) {
  const n = Number(val);
  if (typeof val === 'boolean' || !Number.isInteger(n) || n < 0) return { err: 'fibonacci must be a non-negative integer' };
  if (n > 10000) return { err: 'fibonacci value too large' };
  return { n };
}

function validateIntegerArray(val, keyName) {
  if (!Array.isArray(val)) return { err: `${keyName} must be an array` };
  if (val.length === 0) return { err: `${keyName} array cannot be empty` };
  if (val.length > 100) return { err: `${keyName} array too long` };
  const nums = [];
  for (let i = 0; i < val.length; i++) {
    const n = Number(val[i]);
    if (typeof val[i] === 'boolean' || !Number.isInteger(n) || n < 0) return { err: `${keyName} must be an array of non-negative integers` };
    nums.push(n);
  }
  return { arr: nums };
}

function validateAI(val) {
  if (typeof val !== 'string') return { err: 'AI must be a string (question)' };
  const s = val.trim();
  if (s.length === 0) return { err: 'AI question cannot be empty' };
  if (s.length > 2000) return { err: 'AI question too long' };
  return { question: s };
}

app.get('/health', (req, res) => {
  try {
    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
    });
  } catch (e) {
    res.status(500).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: 'Internal error' });
  }
});

app.post('/bfhl', async (req, res) => {
  let body;
  try {
    body = req.body;
  } catch (e) {
    return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: 'Invalid JSON body' });
  }

  const one = getExactlyOneKey(body);
  if (one.err) {
    return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: one.err });
  }

  const key = one.key;

  try {
    if (key === 'fibonacci') {
      const v = validateFibonacci(body.fibonacci);
      if (v.err) return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: v.err });
      const data = fibonacci(v.n);
      return res.status(200).json(successResponse(data));
    }

    if (key === 'prime') {
      const v = validateIntegerArray(body.prime, 'prime');
      if (v.err) return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: v.err });
      const data = primesFromArray(v.arr);
      return res.status(200).json(successResponse(data));
    }

    if (key === 'lcm') {
      const v = validateIntegerArray(body.lcm, 'lcm');
      if (v.err) return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: v.err });
      const data = lcmOfArray(v.arr);
      return res.status(200).json(successResponse(data));
    }

    if (key === 'hcf') {
      const v = validateIntegerArray(body.hcf, 'hcf');
      if (v.err) return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: v.err });
      const data = hcfOfArray(v.arr);
      return res.status(200).json(successResponse(data));
    }

    if (key === 'AI') {
      const v = validateAI(body.AI);
      if (v.err) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: v.err
        });
      }
    
      const data = await askGemini(v.question);
    
      if (!data) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: 'Invalid AI question'
        });
      }
    
      return res.status(200).json(successResponse(data));
    }
    
  } catch (err) {
    const msg = err && err.message ? String(err.message) : 'Internal server error';
    const status = msg.includes('API') || msg.includes('GEMINI') ? 502 : 500;
    return res.status(status).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: msg });
  }

  return res.status(400).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: 'Unsupported key' });
});

app.use((req, res) => {
  res.status(404).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: 'Not Found' });
});

app.use((err, req, res, next) => {
  const isJsonParseError = err.status === 400 || (err.message && /JSON|parse|body|Unexpected/.test(err.message));
  const status = isJsonParseError ? 400 : 500;
  const message = isJsonParseError ? 'Invalid JSON body' : 'Internal server error';
  res.status(status).json({ is_success: false, official_email: OFFICIAL_EMAIL, error: message });
});

const PORT = Number(process.env.PORT) || 3000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
