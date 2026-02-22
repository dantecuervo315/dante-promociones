'use client'

import { Producto, getProductos } from '@/lib/productosService'
import { useState, useEffect, Suspense } from 'react'
import { useCart } from '@/lib/CartContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ProductosContent() {
    const [productos, setProductos] = useState<Producto[]>([])
    const searchParams = useSearchParams()
    const categoriaInicial = searchParams.get('categoria') || 'todos'
    const [categoria, setCategoria] = useState<string>(categoriaInicial)
    const [cargando, setCargando] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        async function cargar() {
            const data = await getProductos()
            setProductos(data)
            setCargando(false)
        }
        cargar()
    }, [])

    useEffect(() => {
        if (searchParams.get('categoria')) {
            setCategoria(searchParams.get('categoria') || 'todos')
        }
    }, [searchParams])

    const productosFiltrados = categoria === 'todos'
        ? productos
        : productos.filter(p => p.categoria === categoria)

    if (cargando) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando productos premium...</div>

    return (
        <div>
            <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Nuestro Catálogo</h1>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['todos', 'belleza', 'ropa', 'tecnologia', 'promociones'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoria(cat)}
                        className="glass"
                        style={{
                            padding: '0.5rem 1.5rem',
                            cursor: 'pointer',
                            backgroundColor: categoria === cat ? 'var(--primary)' : 'transparent',
                            color: categoria === cat ? 'white' : 'var(--foreground)',
                            border: categoria === cat ? 'none' : '1px solid var(--border)',
                            textTransform: 'capitalize'
                        }}
                    >
                        {cat === 'ropa' ? 'Moda' : cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {productosFiltrados.map(producto => (
                    <div key={producto.id} className="glass" style={{ padding: '1rem', overflow: 'hidden' }}>
                        <Link href={`/productos/${producto.id}`}>
                            <div style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    className="hover-zoom"
                                />
                            </div>
                        </Link>
                        <div style={{ padding: '1rem 0' }}>
                            <h3 style={{ margin: '0.5rem 0' }}>{producto.nombre}</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, height: '3rem', overflow: 'hidden' }}>{producto.descripcion}</p>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>
                                    $ {producto.precio.toLocaleString('es-CO')}
                                </span>
                                <button
                                    onClick={() => addToCart(producto)}
                                    style={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {productosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <h3>No hay productos disponibles en esta categoría.</h3>
                </div>
            )}
        </div>
    )
}

export default function ProductosPage() {
    return (
        <Suspense fallback={<div>Cargando catálogo...</div>}>
            <ProductosContent />
        </Suspense>
    )
}
