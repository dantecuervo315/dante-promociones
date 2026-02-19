import { supabase } from './supabase';

export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: 'belleza' | 'ropa' | 'tecnologia' | 'promociones';
    stock?: number;
}

export async function getProductos() {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }

    return data as Producto[];
}
