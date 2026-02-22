'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Producto } from '@/lib/productosService'

export default function EditarProductoPage() {
    const router = useRouter()
    const { id } = useParams()
    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [producto, setProducto] = useState<Omit<Producto, 'id'>>({
        nombre: '',
        descripcion: '',
        precio: 0,
        imagen: '',
        categoria: 'belleza',
        stock: 0
    })

    useEffect(() => {
        const cargarProducto = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                setError('Error al cargar el producto: ' + error.message)
                setCargando(false)
            } else {
                setProducto({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    precio: data.precio,
                    imagen: data.imagen,
                    categoria: data.categoria,
                    stock: data.stock || 0
                })
                setCargando(false)
            }
        }

        if (id) cargarProducto()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setProducto(prev => ({
            ...prev,
            [name]: name === 'precio' || name === 'stock' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setGuardando(true)
        setError(null)

        const { error } = await supabase
            .from('productos')
            .update(producto)
            .eq('id', id)

        if (error) {
            setError(error.message)
            setGuardando(false)
        } else {
            router.push('/admin')
        }
    }

    if (cargando) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando datos del producto...</div>

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }} className="glass">
            <h1 className="title-gradient" style={{ marginBottom: '2rem' }}>Editar Producto</h1>

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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Stock</label>
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
                        disabled={guardando}
                        className="btn-primary glass"
                        style={{ flex: 1, padding: '1rem', fontWeight: 'bold', height: 'auto' }}
                    >
                        {guardando ? 'Guardando cambios...' : 'Guardar Cambios'}
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
