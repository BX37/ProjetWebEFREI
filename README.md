# Dernier Metro - Projet pédagogique

<<<<<<< HEAD
Résolution des problemes de CONST en faisant 'npm install cors' dans le terminal, 
SWAGGER est fonctionnel en localhost:8080



=======
Petit service qui simule si un usager peut attraper le **dernier métro** à Paris.
>>>>>>> 1dcf19b80fd042b48251d4416155c633c87f7aa8

## Ce que contient ce dépôt
- `server.js` : application Express minimale
- `package.json` : dépendances et scripts
- `Dockerfile.v1` : image pour l'exercice
- `.dockerignore`
- `docker-compose.yml` : (optionnel) pour démarrer via Compose
- `openapi.yaml` : spec OpenAPI minimale pour Swagger UI
- `scripts/validate.sh` : quelques cURL pour valider l'API

## Lancer localement
```bash
# installer les dépendances
npm install
# démarrer
npm start
# l'API écoute sur http://localhost:3000
```

## Lancer avec Docker
```bash
docker build -t dernier-metro -f Dockerfile.v1 .
docker run -p 3000:3000 --env PORT=3000 --rm dernier-metro
```

## Lancer avec Docker Compose
```bash
docker compose up --build
```

## Endpoints
- `GET /health` -> `{ "status": "ok" }`
- `GET /next-metro?station=NAME` -> `{ station, line, headwayMin, nextArrival, isLast, tz }` ou `{ station, line, service: "closed", tz }`

## Exemples cURL (scripts/validate.sh)
- `curl http://localhost:3000/health`
- `curl "http://localhost:3000/next-metro?station=Chatelet"`
- `curl "http://localhost:3000/next-metro"` -> renvoie 400

## Notes pédagogiques
- Horaires simulés : plage de service 05:30 -> 01:15, fréquence par défaut 3 minutes.
- `isLast` = true entre 00:45 et 01:15.
- L'application formate et calcule en heure locale **Europe/Paris**.
