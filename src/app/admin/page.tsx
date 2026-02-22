'use client'

import { useEffect, useState } from 'react'
import { Producto, getProductos } from '@/lib/productosService'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [cargando, setCargando] = useState(true)

    const cargarProductos = async () => {
        setCargando(true)
        const data = await getProductos()
        setProductos(data)
        setCargando(false)
    }

    useEffect(() => {
        cargarProductos()
    }, [])

    const eliminarProducto = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Error al eliminar el producto: ' + error.message)
        } else {
            setProductos(productos.filter(p => p.id !== id))
        }
    }

    if (cargando) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando panel de administración...</div>

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title-gradient">Panel de Administración</h1>
                <Link href="/admin/nuevo">
                    <button className="btn-primary glass" style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold' }}>
                        + Nuevo Producto
                    </button>
                </Link>
            </div>

            <div className="glass" style={{ overflowX: 'auto', padding: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Imagen</th>
                            <th style={{ padding: '1rem' }}>Nombre</th>
                            <th style={{ padding: '1rem' }}>Categoría</th>
                            <th style={{ padding: '1rem' }}>Precio</th>
                            <th style={{ padding: '1rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>{producto.nombre}</td>
                                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{producto.categoria}</td>
                                <td style={{ padding: '1rem' }}>$ {producto.precio.toLocaleString('es-CO')}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/admin/editar/${producto.id}`}>
                                            <button style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
                                                Editar
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => eliminarProducto(producto.id)}
                                            style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {productos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>No hay productos registrados.</div>
                )}
            </div>
        </div>
    )
}
