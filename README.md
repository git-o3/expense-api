# Expense Tracker API

A production-ready RESTful API for tracking business expenses, built with Node.js, Express, and MongoDB. Features JWT authentication, category-wise spending analytics, flexible date filtering, and one-click CSV export for tax compliance.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![Express](https://img.shields.io/badge/Express-v5-blue) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## Features

- **Full CRUD** — create, read, update, and delete expenses with strict ownership checks
- **Date Filtering** — filter by past week, past month, last 3 months, or a custom date range
- **Search** — case-insensitive regex search across expense notes
- **Pagination** — all list queries support `?page=1&limit=10` with total count metadata
- **Spending Analytics** — MongoDB aggregation pipeline grouped by category with total amount, transaction count, and average spend
- **CSV Export** — download all expenses as a CSV file for accounting and tax filing
- **Joi Validation** — strict schema-based validation on all request bodies and query params
- **JWT Authentication** — secure registration and login with 24-hour token expiry
- **Rate Limiting** — protects endpoints from abuse
- **Global Error Handling** — `asyncHandler` + `globalErrorHandler` for consistent, crash-free responses
- **Dual Logging** — Morgan for HTTP request monitoring, Winston for system-level logs

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Validation | Joi |
| Auth | JWT  |
| Logging | Winston + Morgan |
| Rate Limiting | Express-rate-limiter

## Project Structure

```
expense-tracker-api/
├── src/
│   ├── auth/            # # JWT protect middleware + auth routes                
│   ├── config/          # DB connection and environment setup                     
│   ├── controllers/     # Request handling
│   │-- middleware/      # Middleware helper 
│   │-- models/          # Mongoose schema (compound indexed)
│   │-- routes/          # Expense route definitions 
│   │-- service/         # Business logic and date filtering
│   │-- utils/           # Logger and response helpers
│   ├── validators/      # Joi schemas for expenses and users                                        
│   |               
│   ├                   
│   └── app.js           # Express app setup        
├── server.js            # Entry point                    
├── .env
└── package.json
```

## Installation

```bash
git clone https://github.com/git-o3/expense-api
cd expense-tracker-api
npm install
```

## Environment Setup

Create a `.env` file in the root:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_ultra_secure_secret
```

## Running the Server

```bash
# Development (with Nodemon)
npm run dev

# Production
npm start
```

```
🚀 Server running in development mode on port 3000 Chief 🫡
```

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive a JWT |

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "james", "email": "james@example.com", "password": "secret123" }'
```

**Response:**
```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

---

### Expenses (Protected — requires Bearer Token)

```
Authorization: Bearer <your_token>
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/expenses` | List expenses with search, filter, and pagination |
| GET | `/api/v1/expenses/stats` | Category-wise spending analytics |
| GET | `/api/v1/expenses/export` | Download all expenses as CSV |
| POST | `/api/v1/expenses` | Create a new expense |
| PUT | `/api/v1/expenses/:id` | Update an expense (ownership enforced) |
| DELETE | `/api/v1/expenses/:id` | Delete an expense (ownership enforced) |

### Health Check

```
GET /api/v1/health  →  200 OK
```

---

## Filtering & Search

```bash
# Filter by time period
GET /api/v1/expenses?filter=past_week
GET /api/v1/expenses?filter=past_month
GET /api/v1/expenses?filter=last_3_months

# Custom date range
GET /api/v1/expenses?filter=custom&startDate=2026-01-01&endDate=2026-03-31

# Search by note
GET /api/v1/expenses?search=groceries

# Pagination
GET /api/v1/expenses?page=2&limit=5
```

## Spending Analytics

```bash
GET /api/v1/expenses/stats
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "Groceries", "totalAmount": 540, "count": 12, "avgSpending": 45 },
    { "_id": "Utilities", "totalAmount": 320, "count": 4, "avgSpending": 80 }
  ]
}
```

Powered by a MongoDB aggregation pipeline — groups by category, sums total spend, counts transactions, and calculates average spend per category, sorted by highest spend first.

## CSV Export

```bash
GET /api/v1/expenses/export
```

Downloads a `expenses.csv` file containing all your expenses:

```
Date,Category,Amount,Note
2026-05-01T10:00:00.000Z,Groceries,45,"Weekly shop"
2026-04-28T14:30:00.000Z,Utilities,120,"Electricity bill"
```

## Categories

| Category |
|---|
| Groceries |
| Leisure |
| Electronics |
| Utilities |
| Clothing |
| Health |
| Others |

## Security Model

**Ownership enforcement** — every update and delete operation uses `findOneAndUpdate({ _id, userId })`, meaning a user can never modify another user's records even with a valid token.

**Password hashing** — passwords are hashed. The password field is excluded from all queries by default and only fetched explicitly during login.

**Token expiry** — JWTs expire after 24 hours. Expired or missing tokens are rejected by the `protect` middleware before reaching any controller.

## Requirements

- Node.js v18+
- MongoDB running locally or via MongoDB Atlas

## License

MIT