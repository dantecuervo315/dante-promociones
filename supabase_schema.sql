-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC NOT NULL,
  imagen TEXT,
  categoria TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar datos de ejemplo para cada categoría
INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, stock)
VALUES 
  ('Suero Facial Rejuvenecedor', 'Con ácido hialurónico y vitamina C para una piel radiante.', 85000, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&h=400&fit=crop', 'belleza', 50),
  ('Chaqueta Premium "Dante"', 'Diseño exclusivo, tela de alta calidad y corte moderno.', 145000, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&h=400&fit=crop', 'ropa', 20),
  ('Auriculares Inalámbricos Pro', 'Cancelación de ruido activa y sonido de alta fidelidad.', 210000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&fit=crop', 'tecnologia', 15),
  ('Paleta de Sombras "Nude"', '12 colores altamente pigmentados para cualquier ocasión.', 65000, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&h=400&fit=crop', 'belleza', 30),
  ('Camiseta Algodón Orgánico', 'Comodidad y estilo sostenible para el día a día.', 45000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&h=400&fit=crop', 'ropa', 100),
  ('Reloj Inteligente Sport', 'Monitorea tu salud y actividad física con elegancia.', 180000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=400&fit=crop', 'tecnologia', 25),
  ('Combo Belleza Total', 'Kit completo de sueros y paleta con 20% de descuento.', 120000, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&h=400&fit=crop', 'promociones', 10);

-- Configurar políticas de seguridad (RLS) para permitir lectura pública
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de productos" 
ON productos FOR SELECT 
USING (true);
