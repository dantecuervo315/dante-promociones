'use client'

import { useEffect, useState, Suspense } from 'react'
import { useCart } from '@/lib/CartContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PagoExitosoContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const [paymentData, setPaymentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clearCart();

        async function fetchPaymentDetails() {
            if (!paymentId) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/payment-details?payment_id=${paymentId}`);
                const data = await res.json();
                if (!data.error) {
                    setPaymentData(data);
                }
            } catch (err) {
                console.error("Error cargando detalles del pago:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchPaymentDetails();
    }, [paymentId, clearCart]);

    return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✅</div>
            <h1 className="title-gradient" style={{ fontSize: '3rem' }}>¡Gracias por tu compra!</h1>

            <p style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>
                Tu pedido en <strong style={{ color: 'var(--primary)' }}>Dante Promociones</strong> ha sido procesado con éxito.
            </p>

            <div className="glass" style={{ padding: '2rem', maxWidth: '600px', margin: '2rem auto', border: '1px solid var(--primary)', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Detalles de tu Orden</h3>

                {loading ? (
                    <p>Consultando detalles del pedido...</p>
                ) : paymentData ? (
                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        <p><strong>Número de Operación:</strong> {paymentData.id}</p>
                        <p><strong>Estado:</strong> Aprobado</p>
                        <p><strong>Total Cobrado:</strong> $ {Number(paymentData.total_paid).toLocaleString('es-CO')}</p>

                        {paymentData.shipping_address && (
                            <div style={{ marginTop: '1rem', backgroundColor: 'var(--border)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Dirección de Envío:</h4>
                                <p>{paymentData.shipping_address.street_name} {paymentData.shipping_address.street_number}</p>
                                <p>{paymentData.shipping_address.zip_code} - Colombia</p>
                            </div>
                        )}

                        <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--primary)' }}>
                            Recibirás un correo en <strong>{paymentData.payer_email}</strong> con el seguimiento de tu envío.
                        </p>
                    </div>
                ) : (
                    <p>Hemos procesado tu pago. Recibirás los detalles por correo electrónico.</p>
                )}

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/productos">
                        <button style={{
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            padding: '1rem 2.5rem',
                            borderRadius: 'var(--radius)',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            transition: 'transform 0.2s'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Seguir Comprando
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function PagoExitosoPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Cargando confirmación...</div>}>
            <PagoExitosoContent />
        </Suspense>
    )
}
