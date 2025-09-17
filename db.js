const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,  // Nombre maximum de connexions
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('Erreur inattendue sur le pool de connexions:', err);
});

// Teste la connexion avec reconnexion
const testConnection = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('Connexion à la base de données réussie. Heure actuelle:', res.rows[0].now);
      break;
    } catch (err) {
      retries--;
      console.error(`Erreur de connexion (essai ${5 - retries}/5):`, err.message);
      if (retries === 0) {
        console.error('Impossible de se connecter à la base de données après 5 tentatives.');
        process.exit(1);  // Arrête l'application si la connexion échoue
      }
      await new Promise(resolve => setTimeout(resolve, 5000));  // Attend 5 secondes avant de réessayer
    }
  }
};

testConnection();  // Appelle la fonction de test

module.exports = pool;
