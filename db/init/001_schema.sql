-- Création des tables pour Dernier Metro

CREATE TABLE IF NOT EXISTS stations (
                                        id SERIAL PRIMARY KEY,
                                        name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS headways (
                                        id SERIAL PRIMARY KEY,
                                        station_id INT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    minutes INT NOT NULL CHECK (minutes > 0)
    );

CREATE TABLE IF NOT EXISTS last_metro (
                                          id SERIAL PRIMARY KEY,
                                          station_id INT UNIQUE NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    departed_at TIME NOT NULL
    );

-- Bonus : index
CREATE INDEX IF NOT EXISTS idx_headways_station ON headways(station_id);