<<<<<<< HEAD
require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());  // Active CORS pour toutes les routes
const { Pool } = require('pg');

// Configuration de la base de données
const pool = require('./db');

const PORT = process.env.PORT || 3000;
const HEADWAY_MIN = parseInt(process.env.HEADWAY_MIN || '3', 10);
const LAST_WINDOW_START = process.env.LAST_WINDOW_START || '00:45';
const SERVICE_END = process.env.SERVICE_END || '01:15';
const TZ = 'Europe/Paris';

const { computeNextArrival, toHM, parseHM } = require('./utils');

function nowInParis() {
  return new Date();
}

// Logger simple (inchangé)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// /health (inchangé)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// /next-metro MIS À JOUR POUR UTILISER LA BASE DE DONNÉES
app.get('/next-metro', async (req, res) => {
  const station = req.query.station;
  if (!station) {
    return res.status(400).json({ error: 'missing station' });
  }

  try {
    // 1. Vérifier si la station existe dans la base de données
    const stationQuery = await pool.query(
      'SELECT * FROM stations WHERE LOWER(name) = LOWER($1)',
      [station]
    );

    if (stationQuery.rows.length === 0) {
      // 2. Suggérer des stations similaires
      const suggestionsQuery = await pool.query(
        "SELECT name FROM stations WHERE LOWER(name) LIKE LOWER($1)",
        [`%${station}%`]
      );
      const suggestions = suggestionsQuery.rows.map(row => row.name);
      return res.status(404).json({
        error: "unknown station",
        suggestions
      });
    }

    // 3. Récupérer la ligne de métro associée
    const line = req.query.line || stationQuery.rows[0].line;
    const headway = parseInt(req.query.headwayMin || HEADWAY_MIN, 10);
    const n = Math.min(Math.max(parseInt(req.query.n || '1', 10), 1), 5);

    // 4. Calculer les prochains passages (logique existante)
    let nowParis = nowInParis();
    const schedules = [];
    for (let i = 0; i < n; i++) {
      const result = computeNextArrival(nowParis, headway);
      if (result.service === 'closed') {
        if (i === 0) {
          return res.json({ station, line, service: 'closed', tz: result.tz });
        }
        break;
      }
      schedules.push(result.nextArrival);
      nowParis = new Date(nowParis.getTime() + headway * 60 * 1000);
    }

    // 5. Retourner la réponse
    return res.json({
      station,
      line,
      headwayMin: headway,
      nextArrivals: schedules,
      isLast: computeNextArrival(nowInParis(), headway).isLast,
      tz: TZ
    });

  } catch (err) {
    console.error('Erreur lors de la requête SQL:', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// 404 JSON (inchangé)
app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

// 500 JSON (inchangé)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

// Swagger UI (inchangé)
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Dernier Metro API listening on port ${PORT}`);
});
=======
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const HEADWAY_MIN = parseInt(process.env.HEADWAY_MIN || '3', 10);
const LAST_WINDOW_START = process.env.LAST_WINDOW_START || '00:45';
const SERVICE_END = process.env.SERVICE_END || '01:15';
const TZ = 'Europe/Paris';


const STATIONS = [
  "Chatelet",
  "Bastille",
  "Nation",
  "La Defense",
  "Concorde",
  "Gare de Lyon",
  "Hotel de Ville"
];

function parseHM(hm) {
  const [h, m] = hm.split(':').map(Number);
  let total = h * 60 + m;
  if (h < 5) total += 24 * 60; 
  return total;
}

//Transformation de la date pour un format Paris
function toHM(d) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
}


function nowInParis() {
  return new Date();
}

// Calcul des rams
function computeNextArrival(now = new Date(), headwayMin = HEADWAY_MIN) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  let currMinutes = minutes;
  if (now.getHours() < 5) currMinutes += 24 * 60; // après minuit

  const startMinutes = 5 * 60 + 30; // 05:30
  const endMinutes = parseHM(SERVICE_END);

  if (currMinutes < startMinutes || currMinutes > endMinutes) {
    return { service: 'closed', tz: TZ };
  }

  // Calcul du prochain passage du métro
  const minutesSinceStart = currMinutes - startMinutes;
  const intervals = Math.ceil(minutesSinceStart / headwayMin);
  const nextMinutesFromStart = intervals * headwayMin;
  let nextTotalMinutes = startMinutes + nextMinutesFromStart;

  const nextHour = Math.floor((nextTotalMinutes % (24 * 60)) / 60);
  const nextMinute = nextTotalMinutes % 60;
  const nextDate = new Date(now);
  nextDate.setHours(nextHour, nextMinute, 0, 0);

  // Fenêtre dernier métro
  const lastStartMinutes = parseHM(LAST_WINDOW_START);
  const lastEndMinutes = endMinutes;
  const isLast = (currMinutes >= lastStartMinutes && currMinutes <= lastEndMinutes);

  return {
    nextArrival: toHM(nextDate),
    isLast,
    headwayMin,
    tz: TZ
  };
}


// Logger simple
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// /next-metro
app.get('/next-metro', (req, res) => {
  const station = req.query.station;
  if (!station) {
    return res.status(400).json({ error: 'missing station' });
  }

  // Validation station
  const match = STATIONS.find(s => s.toLowerCase() === station.toLowerCase());
  if (!match) {
    const suggestions = STATIONS.filter(s => s.toLowerCase().includes(station.toLowerCase()));
    return res.status(404).json({
      error: "unknown station",
      suggestions
    });
  }

  const line = req.query.line || 'M1';
  const headway = parseInt(req.query.headwayMin || HEADWAY_MIN, 10);
  const n = Math.min(Math.max(parseInt(req.query.n || '1', 10), 1), 5);

  let nowParis = nowInParis();
  const schedules = [];

  for (let i = 0; i < n; i++) {
    const result = computeNextArrival(nowParis, headway);
    if (result.service === 'closed') {
      if (i === 0) {
        return res.json({ station, line, service: 'closed', tz: result.tz });
      }
      break;
    }
    schedules.push(result.nextArrival);
    nowParis = new Date(nowParis.getTime() + headway * 60 * 1000);
  }

  return res.json({
    station,
    line,
    headwayMin: headway,
    nextArrivals: schedules,
    isLast: computeNextArrival(nowInParis(), headway).isLast,
    tz: TZ
  });
});

// 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

// 500 JSON
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});


app.listen(PORT, () => {
  console.log(`Dernier Metro API listening on port ${PORT}`);
});
>>>>>>> 1dcf19b80fd042b48251d4416155c633c87f7aa8
