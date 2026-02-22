'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Producto } from '@/lib/productosService'
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

export default function ProductoDetallePage() {
    const { id } = useParams()
    const router = useRouter()
    const [producto, setProducto] = useState<Producto | null>(null)
    const [cargando, setCargando] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        const cargarProducto = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error al cargar producto:', error)
                setCargando(false)
            } else {
                setProducto(data)
                setCargando(false)
            }
        }

        if (id) cargarProducto()
    }, [id])

    if (cargando) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando detalles del producto...</div>
    if (!producto) return <div style={{ textAlign: 'center', padding: '4rem' }}>Producto no encontrado.</div>

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <button
                onClick={() => router.back()}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                }}
            >
                ← Volver
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="product-layout">
                <div className="glass" style={{ padding: '1rem', borderRadius: '1rem' }}>
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', objectFit: 'cover' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <span style={{
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            letterSpacing: '1px',
                            color: 'var(--primary)',
                            fontWeight: 'bold'
                        }}>
                            {producto.categoria === 'ropa' ? 'Moda' : producto.categoria}
                        </span>
                        <h1 className="title-gradient" style={{ fontSize: '3rem', marginTop: '0.5rem' }}>{producto.nombre}</h1>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        $ {producto.precio.toLocaleString('es-CO')}
                    </div>

                    <div style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
                        {producto.descripcion}
                    </div>

                    <button
                        onClick={() => addToCart(producto)}
                        className="btn-primary glass"
                        style={{
                            padding: '1.2rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <span>🛒</span> Agregar al Carrito
                    </button>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px dashed var(--border)', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🚚</span>
                            <div>
                                <h4 style={{ margin: 0 }}>Envío rápido</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Recíbelo en 24-48 horas en las principales ciudades.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                            <div>
                                <h4 style={{ margin: 0 }}>Garantía Dante</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>Calidad 100% asegurada en todos nuestros productos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .product-layout {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    div[style*="font-size: 3rem"] {
                        font-size: 2rem !important;
                    }
                }
            `}</style>
        </div>
    )
}
