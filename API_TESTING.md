# API Testing Guide

## Base URLs

**Local Development:**
```
http://localhost:5000
```

**Production (Vercel):**
```
https://your-project-name.vercel.app
```

Replace `your-project-name` with your actual Vercel deployment URL.

---

## Endpoints

### 1. Health Check

**Browser/Postman:**
```
GET /health
```

**Example (Local):**
```
http://localhost:5000/health
```

**Example (Vercel):**
```
https://your-project-name.vercel.app/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-21T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "memory": {
    "used": "45 MB",
    "total": "128 MB"
  }
}
```

---

### 2. Root Endpoint

**Browser/Postman:**
```
GET /
```

**Example (Local):**
```
http://localhost:5000/
```

**Example (Vercel):**
```
https://your-project-name.vercel.app/api
```

**Response:**
```json
{
  "message": "Shift Cipher Brute Force API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "analyze": "/api/brute"
  }
}
```

---

### 3. Brute Force Decode (Main Endpoint)

**Postman/Thunder Client:**
```
POST /api/brute
Content-Type: application/json
```

**Request Body:**
```json
{
  "ciphertext": "Khoor Zruog",
  "language": "auto"
}
```

**Example (Local):**
```
POST http://localhost:5000/api/brute
```

**Example (Vercel):**
```
POST https://your-project-name.vercel.app/api/brute
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "shift": 3,
        "text": "Hello World",
        "score": 0.95,
        "confidence": "Very Likely",
        "detectedLanguage": "english",
        "frequencyScore": 0.92,
        "wordMatchScore": 0.98
      },
      {
        "shift": 4,
        "text": "Gdkkn Vnqkc",
        "score": 0.45,
        "confidence": "Possible",
        "detectedLanguage": "english",
        "frequencyScore": 0.40,
        "wordMatchScore": 0.50
      }
      // ... more results
    ],
    "totalResults": 26,
    "processingTime": "0.05s"
  }
}
```

---

## Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Shift Cipher API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Decode Cipher - English",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"ciphertext\": \"Khoor Zruog! Wklv lv d whvw phvvdjh.\",\n  \"language\": \"auto\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/brute",
          "host": ["{{baseUrl}}"],
          "path": ["api", "brute"]
        }
      }
    },
    {
      "name": "Decode Cipher - Kinyarwanda",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"ciphertext\": \"Ltrzmyd\",\n  \"language\": \"auto\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/brute",
          "host": ["{{baseUrl}}"],
          "path": ["api", "brute"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    }
  ]
}
```

---

## cURL Commands

### Health Check
```bash
curl http://localhost:5000/health
```

### Decode Cipher
```bash
curl -X POST http://localhost:5000/api/brute \
  -H "Content-Type: application/json" \
  -d '{
    "ciphertext": "Khoor Zruog",
    "language": "auto"
  }'
```

### For Vercel (Production)
```bash
curl -X POST https://your-project-name.vercel.app/api/brute \
  -H "Content-Type: application/json" \
  -d '{
    "ciphertext": "Khoor Zruog",
    "language": "auto"
  }'
```

---

## Test Examples

### Example 1: Simple English Text
```json
{
  "ciphertext": "Khoor Zruog",
  "language": "auto"
}
```
Expected: "Hello World" with shift 3

### Example 2: Longer Text
```json
{
  "ciphertext": "Wklv lv d whvw phvvdjh iru fubswdqdobvlv",
  "language": "auto"
}
```
Expected: "This is a test message for cryptanalysis" with shift 3

### Example 3: Kinyarwanda
```json
{
  "ciphertext": "Ltrzmyd",
  "language": "auto"
}
```
Expected: "Musanze" with shift 25

### Example 4: French
```json
{
  "ciphertext": "Erqmrxu",
  "language": "auto"
}
```
Expected: "Bonjour" with shift 3

---

## Error Responses

### Missing Ciphertext
```json
{
  "success": false,
  "error": "Ciphertext is required"
}
```

### Invalid Input
```json
{
  "success": false,
  "error": "Invalid ciphertext format"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Finding Your Vercel URL

After deployment:

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Copy the deployment URL (e.g., `https://bruteforce-cryptanalysis.vercel.app`)
4. Your API will be at: `https://bruteforce-cryptanalysis.vercel.app/api/brute`

---

## Quick Test in Browser

**After deployment, test in browser:**

1. Open: `https://your-project-name.vercel.app/health`
2. You should see the health check response
3. For POST requests, use Postman or the frontend app

---

## VS Code REST Client

If using REST Client extension:

```http
### Health Check
GET http://localhost:5000/health

### Decode Cipher
POST http://localhost:5000/api/brute
Content-Type: application/json

{
  "ciphertext": "Khoor Zruog",
  "language": "auto"
}

### Production Health Check
GET https://your-project-name.vercel.app/health

### Production Decode
POST https://your-project-name.vercel.app/api/brute
Content-Type: application/json

{
  "ciphertext": "Khoor Zruog",
  "language": "auto"
}
```

---

**Happy Testing!** 🚀
