'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevoProductoPage() {
    const router = useRouter()
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        imagen: '',
        categoria: 'belleza',
        stock: 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setProducto(prev => ({
            ...prev,
            [name]: name === 'precio' || name === 'stock' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setCargando(true)
        setError(null)

        const { error } = await supabase
            .from('productos')
            .insert([producto])

        if (error) {
            setError(error.message)
            setCargando(false)
        } else {
            router.push('/admin')
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }} className="glass">
            <h1 className="title-gradient" style={{ marginBottom: '2rem' }}>Nuevo Producto</h1>

            {error && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nombre del Producto</label>
                    <input
                        type="text"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={handleChange}
                        required
                        rows={4}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit', resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Precio (COP)</label>
                        <input
                            type="number"
                            name="precio"
                            value={producto.precio}
                            onChange={handleChange}
                            required
                            min="0"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Stock Inicial</label>
                        <input
                            type="number"
                            name="stock"
                            value={producto.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>URL de la Imagen</label>
                    <input
                        type="url"
                        name="imagen"
                        value={producto.imagen}
                        onChange={handleChange}
                        required
                        placeholder="https://ejemplo.com/imagen.jpg"
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Categoría</label>
                    <select
                        name="categoria"
                        value={producto.categoria}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit' }}
                    >
                        <option value="belleza">Belleza</option>
                        <option value="ropa">Moda</option>
                        <option value="tecnologia">Tecnología</option>
                        <option value="promociones">Promociones</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        disabled={cargando}
                        className="btn-primary glass"
                        style={{ flex: 1, padding: '1rem', fontWeight: 'bold', height: 'auto' }}
                    >
                        {cargando ? 'Guardando...' : 'Crear Producto'}
                    </button>
                    <Link href="/admin" style={{ flex: 1 }}>
                        <button type="button" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
