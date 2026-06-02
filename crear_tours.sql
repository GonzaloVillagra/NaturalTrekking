CREATE TABLE IF NOT EXISTS tours_programados (
  id SERIAL PRIMARY KEY,
  nombre_ruta TEXT REFERENCES rutas(nombre) ON DELETE CASCADE,
  fecha_viaje DATE NOT NULL,
  correo_guia TEXT REFERENCES usuarios(correo) ON DELETE SET NULL,
  patente_transporte TEXT REFERENCES transportes(patente) ON DELETE SET NULL,
  estado TEXT DEFAULT 'Programado' CHECK (estado IN ('Programado', 'En Curso', 'Finalizado', 'Cancelado'))
);

CREATE TABLE IF NOT EXISTS turistas (
  id SERIAL PRIMARY KEY,
  rut_pasaporte TEXT UNIQUE NOT NULL,
  nombre_completo TEXT NOT NULL,
  telefono_contacto TEXT,
  contacto_emergencia TEXT,
  condicion_medica TEXT,
  tour_id INTEGER REFERENCES tours_programados(id) ON DELETE CASCADE
);

-- Insertar un tour de prueba
INSERT INTO tours_programados (nombre_ruta, fecha_viaje, correo_guia, patente_transporte) 
VALUES ('Sendero Los Cóndores', CURRENT_DATE + INTERVAL '5 days', 'guia1@naturaltrekking.com', 'ABCD-12');

-- Obtener el ID del tour insertado
DO $$ 
DECLARE tour_id INTEGER;
BEGIN
    SELECT id INTO tour_id FROM tours_programados ORDER BY id DESC LIMIT 1;
    -- Insertar un turista de prueba asignado a ese tour
    INSERT INTO turistas (rut_pasaporte, nombre_completo, telefono_contacto, contacto_emergencia, condicion_medica, tour_id)
    VALUES ('12345678-9', 'Pablo Turista', '+56912345678', 'Madre: +56987654321', 'Asma leve', tour_id);
END $$;
