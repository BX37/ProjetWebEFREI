-- les stations de metro

INSERT INTO stations (name) VALUES
                                ('Châtelet'),
                                ('République'),
                                ('Nation'),
                                ('Concorde'),
                                ('Bastille'),
                                ('La Défense'),
                                ('Gare de Lyon'),
                                ('Montparnasse'),
                                ('Opéra'),
                                ('Belleville')
    ON CONFLICT DO NOTHING;

-- Timing entre chaque metro
INSERT INTO headways (station_id, minutes)
SELECT id,
       CASE name
           WHEN 'Châtelet'     THEN 3
           WHEN 'République'   THEN 2
           WHEN 'Nation'       THEN 5
           WHEN 'Concorde'     THEN 4
           WHEN 'Bastille'     THEN 6
           WHEN 'La Défense'   THEN 7
           WHEN 'Gare de Lyon' THEN 3
           WHEN 'Montparnasse' THEN 4
           WHEN 'Opéra'        THEN 2
           WHEN 'Belleville'   THEN 3
           ELSE 3
           END
FROM stations
    ON CONFLICT DO NOTHING;

-- Les derniers metro, avec des heures différente pour exemple.
INSERT INTO last_metro (station_id, departed_at)
SELECT id,
       CASE name
           WHEN 'Châtelet'     THEN '01:15'
           WHEN 'République'   THEN '01:10'
           WHEN 'Nation'       THEN '01:05'
           WHEN 'Concorde'     THEN '00:55'
           WHEN 'Bastille'     THEN '01:00'
           WHEN 'La Défense'   THEN '01:20'
           WHEN 'Gare de Lyon' THEN '01:15'
           WHEN 'Montparnasse' THEN '01:12'
           WHEN 'Opéra'        THEN '00:50'
           WHEN 'Belleville'   THEN '01:08'
           ELSE '01:15'
           END::time
FROM stations
    ON CONFLICT DO NOTHING;