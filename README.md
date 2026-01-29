# Pulse Employment Backend

Backend API for Pulse Employment, an Australian job eligibility assessment platform.

## Features
- **User Registration**: Register users with profile details.
- **Profession Management**: List of accepted Australian professions.
- **Assessment Engine**: Rule-based engine to evaluate eligibility (Age, Profession).

## Tech Stack
- Node.js & Express
- MongoDB & Mongoose

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/assessment/start` | Run eligibility assessment |
| GET | `/api/professions` | List all accepted professions |

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` with `MONGO_URI`.
3. Seed professions: `node src/utils/seedProfessions.js`
4. Start server: `node src/server.js`
