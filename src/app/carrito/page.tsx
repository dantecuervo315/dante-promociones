'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { calculateShipping, ShippingRate } from '@/lib/shippingService';

export default function CarritoPage() {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [shippingMode, setShippingMode] = useState<'envio' | 'retiro'>('envio');
    const [contactData, setContactData] = useState({
        nombre: '',
        email: '',
        telefono: '',
    });
    const [shippingData, setShippingData] = useState({
        direccion: '',
        ciudad: '',
    });
    const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
    const [calculatingShipping, setCalculatingShipping] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        if (shippingMode === 'envio' && shippingData.ciudad.trim()) {
            const delayDebounceFn = setTimeout(async () => {
                setCalculatingShipping(true);
                const rate = await calculateShipping(shippingData.ciudad);
                setShippingRate(rate);
                setCalculatingShipping(false);
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setShippingRate(null);
        }
    }, [shippingData.ciudad, shippingMode]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!contactData.nombre) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!contactData.email) {
            newErrors.email = 'El correo es obligatorio';
        } else if (!validateEmail(contactData.email)) {
            newErrors.email = 'Ingresa un correo válido';
        }

        if (!contactData.telefono) {
            newErrors.telefono = 'El teléfono es obligatorio';
        } else if (contactData.telefono.replace(/\D/g, '').length < 7) {
            newErrors.telefono = 'Ingresa un teléfono válido';
        }

        if (shippingMode === 'envio') {
            if (!shippingData.direccion) newErrors.direccion = 'La dirección es obligatoria';
            if (!shippingData.ciudad) newErrors.ciudad = 'La ciudad es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const resp = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    buyer: {
                        nombre: contactData.nombre,
                        email: contactData.email,
                        telefono: contactData.telefono,
                    },
                    shipping: {
                        mode: shippingMode,
                        cost: shippingMode === 'envio' ? (shippingRate?.cost || 15000) : 0,
                        provider: shippingRate?.provider || (shippingMode === 'envio' ? 'Estandar' : 'Retiro'),
                        data: {
                            ...shippingData,
                            nombre: contactData.nombre,
                            telefono: contactData.telefono,
                        }
                    }
                })
            });
            const data = await resp.json();
            if (data.init_point) {
                window.location.href = data.init_point;
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

            <div className="cart-layout">
                {/* Lista de productos */}
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            -
                                        </button>
                                        <span style={{ fontWeight: 'bold', minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            +
                                        </button>
                                    </div>
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

                {/* Panel de datos de entrega */}
                <div className="glass cart-summary" style={{ padding: '1.5rem' }}>

                    {/* Selector de modo */}
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

                    {/* Datos de contacto — siempre visibles */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                            👤 Datos de Contacto <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>* Obligatorios</span>
                        </h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div>
                                <input
                                    type="text"
                                    id="contacto-nombre"
                                    placeholder="Nombre Completo *"
                                    className="glass"
                                    style={{
                                        padding: '1rem',
                                        width: '100%',
                                        outline: 'none',
                                        border: errors.nombre ? '1.5px solid #e53e3e' : '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: 'var(--radius)',
                                    }}
                                    value={contactData.nombre}
                                    onChange={(e) => {
                                        setContactData({ ...contactData, nombre: e.target.value });
                                        if (errors.nombre) setErrors({ ...errors, nombre: '' });
                                    }}
                                />
                                {errors.nombre && (
                                    <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.3rem', paddingLeft: '0.5rem' }}>
                                        ⚠ {errors.nombre}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    id="contacto-email"
                                    placeholder="Correo electrónico *"
                                    className="glass"
                                    style={{
                                        padding: '1rem',
                                        width: '100%',
                                        outline: 'none',
                                        border: errors.email ? '1.5px solid #e53e3e' : '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: 'var(--radius)',
                                    }}
                                    value={contactData.email}
                                    onChange={(e) => {
                                        setContactData({ ...contactData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                />
                                {errors.email && (
                                    <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.3rem', paddingLeft: '0.5rem' }}>
                                        ⚠ {errors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    id="contacto-telefono"
                                    placeholder="Teléfono / WhatsApp *"
                                    className="glass"
                                    style={{
                                        padding: '1rem',
                                        width: '100%',
                                        outline: 'none',
                                        border: errors.telefono ? '1.5px solid #e53e3e' : '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: 'var(--radius)',
                                    }}
                                    value={contactData.telefono}
                                    onChange={(e) => {
                                        setContactData({ ...contactData, telefono: e.target.value });
                                        if (errors.telefono) setErrors({ ...errors, telefono: '' });
                                    }}
                                />
                                {errors.telefono && (
                                    <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.3rem', paddingLeft: '0.5rem' }}>
                                        ⚠ {errors.telefono}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Datos de envío (solo en modo envío) o info de retiro */}
                    {shippingMode === 'retiro' ? (
                        <div style={{ backgroundColor: 'var(--border)', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                            <p style={{ margin: 0 }}>📍 <strong>Punto de Retiro:</strong> CC Gran Estación, Bogotá.</p>
                            <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>Horario: Lunes a Sábado 10am - 8pm.</p>
                            <p style={{ margin: '0.5rem 0 0', opacity: 0.7, fontSize: '0.8rem' }}>Te contactaremos al correo y teléfono indicados para coordinar.</p>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📦 Datos de Envío</h3>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            placeholder="Ciudad *"
                                            className="glass"
                                            style={{
                                                padding: '1rem',
                                                width: '100%',
                                                outline: 'none',
                                                border: errors.ciudad ? '1.5px solid #e53e3e' : '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: 'var(--radius)',
                                            }}
                                            value={shippingData.ciudad}
                                            onChange={(e) => {
                                                setShippingData({ ...shippingData, ciudad: e.target.value });
                                                if (errors.ciudad) setErrors({ ...errors, ciudad: '' });
                                            }}
                                        />
                                        {errors.ciudad && (
                                            <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.3rem', paddingLeft: '0.5rem' }}>⚠ {errors.ciudad}</p>
                                        )}
                                        {calculatingShipping && (
                                            <p style={{ fontSize: '0.7rem', marginTop: '0.3rem', opacity: 0.6 }}>Calculando envío...</p>
                                        )}
                                        {shippingRate && !calculatingShipping && (
                                            <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: 'var(--primary)', fontWeight: '500' }}>
                                                🚀 {shippingRate.provider} ({shippingRate.estimatedDays})
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Dirección Exacta *"
                                        className="glass"
                                        style={{
                                            padding: '1rem',
                                            width: '100%',
                                            outline: 'none',
                                            border: errors.direccion ? '1.5px solid #e53e3e' : '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: 'var(--radius)',
                                        }}
                                        value={shippingData.direccion}
                                        onChange={(e) => {
                                            setShippingData({ ...shippingData, direccion: e.target.value });
                                            if (errors.direccion) setErrors({ ...errors, direccion: '' });
                                        }}
                                    />
                                    {errors.direccion && (
                                        <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.3rem', paddingLeft: '0.5rem' }}>⚠ {errors.direccion}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resumen y botón de pago */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3>Resumen</h3>
                    <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal</span>
                            <span>$ {total.toLocaleString('es-CO')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Envío</span>
                            <span>{shippingMode === 'envio' ? (calculatingShipping ? '...' : `$ ${(shippingRate?.cost || 15000).toLocaleString('es-CO')}`) : 'GRATIS'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem' }}>
                            <span>Total</span>
                            <span>$ {(total + (shippingMode === 'envio' ? (shippingRate?.cost || 15000) : 0)).toLocaleString('es-CO')}</span>
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
