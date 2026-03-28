# RPG Portfolio Admin Backend Server

Express.js server for managing RPG portfolio data via REST API.

## Setup

Install dependencies:
```bash
npm install
```

## Running the Server

Start the server:
```bash
npm start
```

The server will run on **http://localhost:3001** with CORS enabled for:
- http://localhost:8080
- http://localhost:5173

## API Endpoints

### Get All Data
```
GET /api/data/all
```
Returns all portfolio data (character, talents, professions, inventory, achievements).

### Translations

Get translation for specific language:
```
GET /api/translations/:lang
```
Supported languages: `en`, `ka`, `ru`

Save translation for specific language:
```
PUT /api/translations/:lang
```
Body: Full translation JSON object

### Character

Get character data:
```
GET /api/character
```

Save character data:
```
PUT /api/character
```
Body: Character JSON object

### Talents

Get talent tree (nodes and edges):
```
GET /api/talents
```

Save talent tree:
```
PUT /api/talents
```
Body: `{ nodes: [...], edges: [...] }`

### Professions

Get professions array:
```
GET /api/professions
```

Save professions array:
```
PUT /api/professions
```
Body: Array of profession objects

### Inventory

Get inventory (backpack items):
```
GET /api/inventory
```

Save inventory:
```
PUT /api/inventory
```
Body: Array of backpack items

### Achievements

Get achievements array:
```
GET /api/achievements
```

Save achievements:
```
PUT /api/achievements
```
Body: Array of achievement objects

### Health Check

```
GET /api/health
```

## Data Structure

All JSON data files are stored in the `server/data/` directory:
- `character.json` - Character info, stats, attributes, skills, languages, hobbies, religion
- `talents.json` - Talent tree nodes and edges
- `professions.json` - Profession data
- `inventory.json` - Backpack items
- `achievements.json` - Completed achievements
- `locales/` - Translation files (en.json, ka.json, ru.json)

## Error Handling

The server returns appropriate HTTP status codes:
- **200** - Success
- **400** - Bad request (invalid language, etc.)
- **404** - Endpoint not found
- **500** - Server error

All error responses include a message explaining the issue.

## Logging

All requests are logged with timestamp, HTTP method, and path:
```
[2024-01-15T10:30:45.123Z] GET /api/character
[2024-01-15T10:30:46.456Z] PUT /api/character
```

## File Operations

The server uses synchronous file I/O (`fs.readFileSync` and `fs.writeFileSync`) for JSON data persistence. Files are written with 2-space indentation for readability.
