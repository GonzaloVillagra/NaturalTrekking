-- 1. Insertar Transporte
INSERT INTO transportes (patente, capacidad)
VALUES ('XX-YY-99', 15)
ON CONFLICT (patente) DO NOTHING;

-- 2. Eliminar Ruta si existe
DELETE FROM rutas WHERE nombre = 'Sendero Los Cóndores';

-- 3. Insertar Ruta
INSERT INTO rutas (nombre, descripcion, distancia_km, tiempo_estimado, dificultad, correo_usuario, ruta_gps)
VALUES (
  'Sendero Los Cóndores', 
  'Ruta montañosa de 2.5km con pendientes moderadas, ideal para avistamiento de aves.',
  2.5,
  '3 horas',
  'Media',
  'admin@admin.com',
  ST_GeomFromText('LINESTRING(-70.5200 -33.4000, -70.5100 -33.4020, -70.5000 -33.4050, -70.4900 -33.4100)', 4326)
);

-- 4. Insertar Hitos
DELETE FROM hitos WHERE nombre_ruta = 'Sendero Los Cóndores';

INSERT INTO hitos (nombre, descripcion, ubicacion, nombre_ruta)
VALUES 
('Punto de Encuentro', 'Inicio del sendero, revisión de equipo.', ST_GeomFromText('POINT(-70.5200 -33.4000)', 4326), 'Sendero Los Cóndores'),
('Mirador del Valle', 'Excelente vista a la ciudad de Santiago. Punto fotográfico.', ST_GeomFromText('POINT(-70.5100 -33.4020)', 4326), 'Sendero Los Cóndores'),
('Zona de Hidratación', 'Cruce de estero natural, agua apta para rellenar botellas.', ST_GeomFromText('POINT(-70.5000 -33.4050)', 4326), 'Sendero Los Cóndores'),
('Cumbre', 'Fin de la ruta, área de descanso para el snack.', ST_GeomFromText('POINT(-70.4900 -33.4100)', 4326), 'Sendero Los Cóndores');

-- 5. Insertar Tour Programado
DELETE FROM tours_programados WHERE nombre_ruta = 'Sendero Los Cóndores';

INSERT INTO usuarios (correo, nombre, contraseña, tipo) 
VALUES ('guia1@naturaltrekking.com', 'Guia Prueba 1', 'guia', 'guia')
ON CONFLICT (correo) DO NOTHING;

INSERT INTO tours_programados (nombre_ruta, correo_guia, patente_transporte, fecha_viaje)
VALUES ('Sendero Los Cóndores', 'guia1@naturaltrekking.com', 'XX-YY-99', CURRENT_DATE + INTERVAL '2 days');

-- 6. Insertar Turistas
-- Obtenemos el id del tour
DO $$ 
DECLARE tour_id_var INT;
BEGIN
  SELECT id INTO tour_id_var FROM tours_programados WHERE nombre_ruta = 'Sendero Los Cóndores' LIMIT 1;
  
  INSERT INTO turistas (tour_id, tipo_documento, rut_pasaporte, nombre_completo, fecha_nacimiento, telefono_contacto, contacto_emergencia, condicion_medica)
  VALUES 
  (tour_id_var, 'RUT', '11111111-1', 'Laura Montañista', '1990-05-15', '+56911111111', 'Mamá: +56922222222', 'Alergia a picadura de abejas'),
  (tour_id_var, 'RUT', '22222222-2', 'Pedro Caminante', '1985-08-20', '+56933333333', 'Esposa: +56944444444', ''),
  (tour_id_var, 'Pasaporte', '33333333-3', 'Sofia Senderos', '1995-12-10', '+56955555555', 'Amigo: +56966666666', 'Asma (lleva inhalador)'),
  (tour_id_var, 'Pasaporte', '44444444-4', 'Carlos Aventura', '1988-03-25', '+56977777777', 'Hermano: +56988888888', 'Diabetes Tipo 2');
END $$;
