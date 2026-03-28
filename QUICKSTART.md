# Quick Start - RPG Portfolio Backend

## Start Backend Server

```bash
cd server
npm install
npm start
```

Server will run on `http://localhost:3001`

## Test Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Get all data
curl http://localhost:3001/api/data/all | jq

# Get character
curl http://localhost:3001/api/character | jq

# Update character (example)
curl -X PUT http://localhost:3001/api/character \
  -H "Content-Type: application/json" \
  -d '{"characterInfo":{"name":"New Name"}}'
```

## API Endpoints

- `GET /api/data/all` - All portfolio data
- `GET /api/character` - Get character data
- `PUT /api/character` - Update character data
- `GET /api/talents` - Get talent tree
- `PUT /api/talents` - Update talent tree
- `GET /api/professions` - Get professions
- `PUT /api/professions` - Update professions
- `GET /api/inventory` - Get backpack items
- `PUT /api/inventory` - Update backpack
- `GET /api/achievements` - Get achievements
- `PUT /api/achievements` - Update achievements
- `GET /api/translations/:lang` - Get translation (en/ka/ru)
- `PUT /api/translations/:lang` - Update translation

## Server Configuration

The server is configured for:
- Port: 3001
- CORS Origins: http://localhost:8080, http://localhost:5173
- Data Files: `server/data/` directory
- File Format: JSON with pretty-printing

See `server/README.md` for full API documentation.
