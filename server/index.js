import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const LOCALES_DIR = path.join(DATA_DIR, 'locales');

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw error;
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
    throw error;
  }
};

app.get('/api/data/all', (req, res) => {
  try {
    const character = readJsonFile(path.join(DATA_DIR, 'character.json'));
    const talents = readJsonFile(path.join(DATA_DIR, 'talents.json'));
    const professions = readJsonFile(path.join(DATA_DIR, 'professions.json'));
    const inventory = readJsonFile(path.join(DATA_DIR, 'inventory.json'));
    const achievements = readJsonFile(path.join(DATA_DIR, 'achievements.json'));

    res.json({
      character,
      talents,
      professions,
      inventory,
      achievements
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data files', message: error.message });
  }
});

app.get('/api/translations/:lang', (req, res) => {
  try {
    const { lang } = req.params;
    const validLangs = ['en', 'ka', 'ru'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ error: 'Invalid language. Supported: en, ka, ru' });
    }

    const translation = readJsonFile(path.join(LOCALES_DIR, `${lang}.json`));
    res.json(translation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read translation file', message: error.message });
  }
});

app.put('/api/translations/:lang', (req, res) => {
  try {
    const { lang } = req.params;
    const validLangs = ['en', 'ka', 'ru'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ error: 'Invalid language. Supported: en, ka, ru' });
    }

    const translationData = req.body;
    const translationPath = path.join(LOCALES_DIR, `${lang}.json`);

    writeJsonFile(translationPath, translationData);
    res.json({ message: `Translation for ${lang} saved successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save translation file', message: error.message });
  }
});

app.get('/api/character', (req, res) => {
  try {
    const character = readJsonFile(path.join(DATA_DIR, 'character.json'));
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read character data', message: error.message });
  }
});

app.put('/api/character', (req, res) => {
  try {
    const characterData = req.body;
    const characterPath = path.join(DATA_DIR, 'character.json');

    writeJsonFile(characterPath, characterData);
    res.json({ message: 'Character data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save character data', message: error.message });
  }
});

app.get('/api/talents', (req, res) => {
  try {
    const talents = readJsonFile(path.join(DATA_DIR, 'talents.json'));
    res.json(talents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read talents data', message: error.message });
  }
});

app.put('/api/talents', (req, res) => {
  try {
    const talentsData = req.body;
    const talentsPath = path.join(DATA_DIR, 'talents.json');

    writeJsonFile(talentsPath, talentsData);
    res.json({ message: 'Talents data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save talents data', message: error.message });
  }
});

app.get('/api/professions', (req, res) => {
  try {
    const professions = readJsonFile(path.join(DATA_DIR, 'professions.json'));
    res.json(professions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read professions data', message: error.message });
  }
});

app.put('/api/professions', (req, res) => {
  try {
    const professionsData = req.body;
    const professionsPath = path.join(DATA_DIR, 'professions.json');

    writeJsonFile(professionsPath, professionsData);
    res.json({ message: 'Professions data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save professions data', message: error.message });
  }
});

app.get('/api/inventory', (req, res) => {
  try {
    const inventory = readJsonFile(path.join(DATA_DIR, 'inventory.json'));
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read inventory data', message: error.message });
  }
});

app.put('/api/inventory', (req, res) => {
  try {
    const inventoryData = req.body;
    const inventoryPath = path.join(DATA_DIR, 'inventory.json');

    writeJsonFile(inventoryPath, inventoryData);
    res.json({ message: 'Inventory data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save inventory data', message: error.message });
  }
});

app.get('/api/achievements', (req, res) => {
  try {
    const achievements = readJsonFile(path.join(DATA_DIR, 'achievements.json'));
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read achievements data', message: error.message });
  }
});

app.put('/api/achievements', (req, res) => {
  try {
    const achievementsData = req.body;
    const achievementsPath = path.join(DATA_DIR, 'achievements.json');

    writeJsonFile(achievementsPath, achievementsData);
    res.json({ message: 'Achievements data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save achievements data', message: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RPG Portfolio Server is running' });
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`RPG Portfolio Server is running on port ${PORT}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
