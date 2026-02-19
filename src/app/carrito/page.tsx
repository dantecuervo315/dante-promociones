'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { useState } from 'react';

export default function CarritoPage() {
    const { items, removeFromCart, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [shippingMode, setShippingMode] = useState<'envio' | 'retiro'>('envio');
    const [shippingData, setShippingData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        ciudad: ''
    });

    const handleCheckout = async () => {
        if (shippingMode === 'envio' && (!shippingData.nombre || !shippingData.direccion || !shippingData.telefono)) {
            alert('Por favor completa todos los datos de envío.');
            return;
        }

        setLoading(true);
        try {
            const resp = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shipping: {
                        mode: shippingMode,
                        cost: shippingMode === 'envio' ? 15000 : 0,
                        data: shippingData
                    }
                })
            });
            const data = await resp.json();
            if (data.init_point) {
                window.open(data.init_point, '_blank');
            } else {
                alert(`Hubo un problema al generar el pago: ${data.details || 'Error desconocido'}`);
                console.error('Detalles del error:', data);
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión al procesar el pago.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 className="title-gradient">Tu carrito está vacío</h2>
                <p style={{ margin: '1rem 0' }}>¡Parece que aún no has añadido nada!</p>
                <Link href="/productos">
                    <button style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        Ir a la tienda
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Tu Carrito</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                <div className="glass" style={{ padding: '1.5rem' }}>
                    {items.map(item => (
                        <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 0',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img src={item.imagen} alt={item.nombre} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>{item.nombre}</h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Cant: {item.quantity}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 'bold' }}>$ {(item.precio * item.quantity).toLocaleString('es-CO')}</p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={clearCart}
                        style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', opacity: 0.6 }}
                    >
                        Vaciar Carrito
                    </button>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Datos de Entrega</h3>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setShippingMode('envio')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                border: '2px solid' + (shippingMode === 'envio' ? ' var(--primary)' : ' var(--border)'),
                                backgroundColor: shippingMode === 'envio' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🚚 Envío Nacional
                        </button>
                        <button
                            onClick={() => setShippingMode('retiro')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                border: '2px solid' + (shippingMode === 'retiro' ? ' var(--primary)' : ' var(--border)'),
                                backgroundColor: shippingMode === 'retiro' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🏪 Retiro en Tienda
                        </button>
                    </div>

                    {shippingMode === 'retiro' ? (
                        <div style={{ backgroundColor: 'var(--border)', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            <p style={{ margin: 0 }}>📍 <strong>Punto de Retiro:</strong> CC Gran Estación, Bogotá.</p>
                            <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>Horario: Lunes a Sábado 10am - 8pm.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Nombre Completo"
                                className="glass"
                                style={{ padding: '1rem', width: '100%', outline: 'none' }}
                                value={shippingData.nombre}
                                onChange={(e) => setShippingData({ ...shippingData, nombre: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Teléfono"
                                    className="glass"
                                    style={{ padding: '1rem', width: '50%', outline: 'none' }}
                                    value={shippingData.telefono}
                                    onChange={(e) => setShippingData({ ...shippingData, telefono: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Ciudad"
                                    className="glass"
                                    style={{ padding: '1rem', width: '50%', outline: 'none' }}
                                    value={shippingData.ciudad}
                                    onChange={(e) => setShippingData({ ...shippingData, ciudad: e.target.value })}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Dirección Exacta"
                                className="glass"
                                style={{ padding: '1rem', width: '100%', outline: 'none' }}
                                value={shippingData.direccion}
                                onChange={(e) => setShippingData({ ...shippingData, direccion: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3>Resumen</h3>
                    <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal</span>
                            <span>$ {total.toLocaleString('es-CO')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Envío</span>
                            <span>{shippingMode === 'envio' ? '$ 15.000' : 'GRATIS'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem' }}>
                            <span>Total</span>
                            <span>$ {(total + (shippingMode === 'envio' ? 15000 : 0)).toLocaleString('es-CO')}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? 'var(--border)' : 'var(--primary)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                    <p style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '1rem', opacity: 0.6 }}>
                        Al continuar, serás redirigido a Mercado Pago para el pago seguro.
                    </p>
                </div>
            </div>
        </div>
    );
}
