export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: 'belleza' | 'ropa' | 'tecnologia' | 'promociones';
}

export const PRODUCTOS: Producto[] = [
    {
        id: '1',
        nombre: 'Suero Facial Rejuvenecedor',
        descripcion: 'Con ácido hialurónico y vitamina C para una piel radiante.',
        precio: 85000,
        imagen: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&h=400&fit=crop',
        categoria: 'belleza',
    },
    {
        id: '2',
        nombre: 'Chaqueta Premium "Dante"',
        descripcion: 'Diseño exclusivo, tela de alta calidad y corte moderno.',
        precio: 145000,
        imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&h=400&fit=crop',
        categoria: 'ropa',
    },
    {
        id: '3',
        nombre: 'Auriculares Inalámbricos Pro',
        descripcion: 'Cancelación de ruido activa y sonido de alta fidelidad.',
        precio: 210000,
        imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&fit=crop',
        categoria: 'tecnologia',
    },
    {
        id: '4',
        nombre: 'Paleta de Sombras "Nude"',
        descripcion: '12 colores altamente pigmentados para cualquier ocasión.',
        precio: 65000,
        imagen: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&h=400&fit=crop',
        categoria: 'belleza',
    },
];
