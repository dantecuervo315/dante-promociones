import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: NextRequest) {
    try {
        const { items, shipping } = await req.json();
        console.log('Items recibidos para checkout:', items);

        // Validaciones básicas
        if (!items || !items.length) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }

        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
        });

        const preference = new Preference(client);

        const body = {
            items: [
                ...items.map((item: any) => ({
                    id: String(item.id || 'sin-id'),
                    title: String(item.nombre || 'Producto').substring(0, 250),
                    unit_price: Math.round(Number(item.precio || 0)),
                    quantity: Math.max(1, Number(item.quantity || 1)),
                    currency_id: 'COP',
                })),
                ...(shipping?.mode === 'envio' ? [{
                    id: 'envio-mensajeria',
                    title: 'Envío por Mensajería (Nacional)',
                    unit_price: 15000,
                    quantity: 1,
                    currency_id: 'COP',
                }] : [])
            ],
            back_urls: {
                success: `${req.nextUrl.origin}/pago-exitoso`,
                failure: `${req.nextUrl.origin}/carrito`,
                pending: `${req.nextUrl.origin}/carrito`,
            },
            auto_return: 'approved' as const, // Forzar retorno al sitio si se aprueba
            metadata: {
                shipping_mode: shipping?.mode || 'tienda',
                customer_name: shipping?.data?.nombre || 'Cliente Anonimo',
                customer_phone: shipping?.data?.telefono || '',
                customer_address: shipping?.data?.direccion || 'Retiro en Tienda',
                customer_city: shipping?.data?.ciudad || 'Bogotá'
            }
        };

        console.log('Enviando preferencia a MP:', JSON.stringify(body, null, 2));

        const response = await preference.create({ body });

        return NextResponse.json({ id: response.id, init_point: response.init_point });
    } catch (error: any) {
        console.error('Error detallado de Mercado Pago:', error);
        const errorMessage = error.response?.message || error.message || 'Error desconocido';
        const errorDetail = error.response?.cause || error.response || null;

        return NextResponse.json({
            error: 'Error al procesar el pago',
            details: errorMessage,
            cause: errorDetail
        }, { status: 500 });
    }
}
