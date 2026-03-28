# Server Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start the Server
```bash
npm start
```

You should see:
```
RPG Portfolio Server is running on http://localhost:3001
CORS enabled for: http://localhost:8080, http://localhost:5173
Data directory: /path/to/server/data
```

### 3. Test the Server

Check server health:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "RPG Portfolio Server is running"
}
```

Get all data:
```bash
curl http://localhost:3001/api/data/all | jq
```

Get character data:
```bash
curl http://localhost:3001/api/character | jq
```

## File Structure

```
server/
├── index.js              # Main Express application
├── package.json          # Dependencies (express, cors, body-parser)
├── README.md             # API documentation
├── SETUP_GUIDE.md        # This file
├── .gitignore            # Git ignore patterns
└── data/
    ├── character.json    # Character stats, skills, info
    ├── talents.json      # Talent tree (nodes & edges)
    ├── professions.json  # Profession data
    ├── inventory.json    # Backpack items
    ├── achievements.json # Completed achievements
    └── locales/
        ├── en.json       # English translations
        ├── ka.json       # Georgian translations
        └── ru.json       # Russian translations
```

## API Features

- RESTful endpoints for all portfolio data
- JSON file persistence
- CORS enabled for frontend on ports 8080 and 5173
- Request logging with timestamps
- Error handling with descriptive messages
- Support for 3 languages (English, Georgian, Russian)

## Data Persistence

All data is stored in JSON files in the `data/` directory:
- Character data includes: info, stats, attributes, soft skills, languages, unique skill, hobbies, religion
- Talents include: 40+ technology nodes across 5 trees (Frontend, Backend, SQL, VoIP, Shared)
- Professions: Frontend Developer, Backend Developer, VoIP Developer
- Inventory: 16 development tools and technologies
- Achievements: 6 major project milestones
- Translations: Complete i18n support in 3 languages

## Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/data/all` | Get all portfolio data |
| GET | `/api/health` | Server health check |
| GET | `/api/character` | Get character data |
| PUT | `/api/character` | Update character data |
| GET | `/api/talents` | Get talent tree |
| PUT | `/api/talents` | Update talent tree |
| GET | `/api/professions` | Get professions |
| PUT | `/api/professions` | Update professions |
| GET | `/api/inventory` | Get inventory |
| PUT | `/api/inventory` | Update inventory |
| GET | `/api/achievements` | Get achievements |
| PUT | `/api/achievements` | Update achievements |
| GET | `/api/translations/:lang` | Get translation (en/ka/ru) |
| PUT | `/api/translations/:lang` | Update translation |

## Frontend Integration

The frontend should be configured to make requests to:
```
http://localhost:3001/api/...
```

Example using fetch:
```javascript
// Get character data
const response = await fetch('http://localhost:3001/api/character');
const data = await response.json();

// Update character data
await fetch('http://localhost:3001/api/character', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedCharacterData)
});
```

## Troubleshooting

**Port already in use:**
Edit the PORT variable in `index.js` or set environment variable:
```bash
PORT=3002 npm start
```

**CORS errors:**
Ensure frontend is running on port 8080 or 5173, or update the CORS origins in `index.js`.

**File not found errors:**
Verify `server/data/` directory exists with all JSON files.

**JSON parsing errors:**
Check that JSON files are valid. Use:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('./data/character.json')))"
```
