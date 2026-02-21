'use client'

import { useEffect } from 'react'
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

export default function PagoExitosoSimple() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
            <div className="mb-8 p-6 rounded-full bg-green-500/10 border-2 border-green-500/20 animate-pulse">
                <span style={{ fontSize: '4rem' }}>✅</span>
            </div>

            <h1 className="title-gradient text-4xl md:text-5xl font-bold mb-4">
                ¡Pago Confirmado!
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mb-12">
                Gracias por tu compra. Tu pedido está siendo procesado y pronto
                recibirás un correo electrónico con los detalles.
            </p>

            <div className="glass p-8 md:p-12 max-w-xl w-full border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <h3 className="text-2xl font-semibold mb-6">Detalles del Redireccionamiento</h3>
                <p className="text-gray-300 mb-8">
                    Mercado Pago te ha redirigido correctamente a nuestro portal seguro.
                    El carrito de compras ha sido vaciado.
                </p>

                <Link href="/productos" className="block">
                    <button className="btn-primary w-full py-4 text-lg font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform">
                        Seguir Comprando
                    </button>
                </Link>
            </div>

            <p className="mt-8 text-sm text-gray-500 italic">
                Dante Promociones - Cali, Colombia
            </p>
        </div>
    )
}
