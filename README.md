# MemoraSearch

**Business Context & Memory Management System for AI Agents**

MemoraSearch is a prototype decision support system that gives AI agents memory. Instead of treating every business event in isolation, it stores past context — supplier quality issues, payment disputes, delivery problems — and uses that history to inform current decisions, exactly like an experienced professional would.

---

## The Problem It Solves

When an invoice arrives from a supplier, a junior system looks at the invoice and approves it. A senior professional thinks differently:

- *"This supplier sent us broken stock four months ago."*
- *"The delivery warehouse had flood damage last monsoon — always delays."*
- *"They disputed our last payment and we had to escalate."*

MemoraSearch teaches an AI agent to think the same way. It maintains structured memory, scores each memory by how recent and important it is, and feeds the most relevant context to an LLM to generate a decision with a clear explanation.

---

## Tech Stack

All tools used here are free.

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Free Tier) |
| LLM Inference | Groq API (Free Tier) |
| Model | `llama3-8b-8192` via Groq |
| HTTP Client | Axios |

---

## Project Structure

```
memorasearch/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/
│   │   ├── Supplier.js              # Supplier schema
│   │   ├── Invoice.js               # Invoice schema
│   │   └── Memory.js                # Core memory schema
│   │
│   ├── controllers/
│   │   ├── memoryController.js      # Add and fetch memories
│   │   └── decisionController.js   # Decision generation via Groq
│   │
│   ├── services/
│   │   ├── retrievalEngine.js       # Fetch memories by supplier
│   │   ├── relevanceEngine.js       # Score memories by relevance
│   │   └── lifecycleManager.js      # Handle stale and archived memory
│   │
│   ├── utils/
│   │   └── timeDecay.js             # Recency weight calculation
│   │
│   ├── routes/
│   │   ├── memoryRoutes.js
│   │   └── decisionRoutes.js
│   │
│   ├── seed.js                      # Sample data for testing
│   ├── .env.example                 # Environment variable template
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InvoiceForm.jsx      # Submit a new invoice
│   │   │   ├── MemoryPanel.jsx      # View retrieved memories and scores
│   │   │   ├── DecisionPanel.jsx    # View AI decision (Approve / Hold / Reject)
│   │   │   └── ExplanationPanel.jsx # View reasoning behind the decision
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Axios calls to backend
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## How It Works

1. User submits an invoice through the frontend (supplier, amount, date).
2. `retrievalEngine` fetches all memories stored for that supplier.
3. `relevanceEngine` scores each memory based on recency and importance.
4. `lifecycleManager` checks whether any memories have gone stale or should be archived.
5. The top memories plus invoice details are assembled into a structured prompt.
6. The prompt is sent to Groq (`llama3-8b-8192`).
7. Groq returns a decision — `APPROVE`, `HOLD`, or `REJECT` — with an explanation.
8. The frontend displays the decision, the memories that influenced it, and the reasoning.

---

## Core Concepts

### Memory Types

| Type | What It Stores |
|---|---|
| `quality` | Product defects, damage rates, inspection failures |
| `payment` | Invoice disputes, early payment behavior, delays |
| `logistics` | Delivery delays, location issues, handling costs |
| `seasonal` | Patterns tied to time of year or weather |

### Relevance Scoring

Each memory gets a relevance score before being passed to the LLM.

```
relevanceScore = baseScore x timeDecayWeight x importanceMultiplier
```

Time decay weights by age:

| Memory Age | Weight |
|---|---|
| Under 1 month | 1.0 |
| 1 to 3 months | 0.8 |
| 3 to 6 months | 0.6 |
| 6 to 12 months | 0.3 |
| Over 1 year | 0.1 |

Only the top 5 memories are passed to the LLM to keep the context clean and decisions fast.

### Memory Lifecycle

| State | Age | Behavior |
|---|---|---|
| `active` | Under 90 days | Full weight, always included |
| `stale` | 90 to 365 days | Reduced weight, still included |
| `archived` | Over 365 days | Excluded from decisions |


---

## Local Setup

### Prerequisites

- Node.js v18 or higher
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A free [Groq API key](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/your-team/memorasearch.git
cd memorasearch
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
GROQ_API_KEY=gsk_your_key_here
MONGODB_URI=mongodb+srv://your_cluster_url
PORT=5000
```

Start the server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Seed Sample Data

Run once to populate the database with sample suppliers and memories:

```bash
cd backend
node seed.js
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check server is running |
| POST | `/api/memories` | Add a new memory |
| GET | `/api/suppliers` | List all suppliers |
| POST | `/api/decision` | Submit invoice and get a decision |

### POST `/api/decision` — Request Body

```json
{
  "supplierId": "supplier_xyz_001",
  "amount": 250000,
  "date": "2024-12-01",
  "description": "Monthly supply of raw materials"
}
```

### POST `/api/decision` — Response

```json
{
  "decision": "HOLD",
  "explanation": "This supplier had a 30% defect rate four months ago resulting in significant replacement costs. Combined with a payment dispute eight months ago, additional quality verification is recommended before approving this invoice.",
  "memoriesUsed": [
    {
      "type": "quality",
      "content": "Delivered 30% broken products — ₹50,000 in replacement costs.",
      "finalScore": 0.85,
      "lifecycleState": "active"
    }
  ],
  "conflictFlag": true
}
```

---

## Environment Variables

Commit this `.env.example` to the repo so teammates know what to configure:

```
GROQ_API_KEY=
DATABASE_URL=
PORT=5000
```

---