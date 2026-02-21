import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: NextRequest) {
    try {
        const { items, buyer, shipping } = await req.json();
        console.log('Items recibidos para checkout:', items);
        console.log('Datos del comprador:', { nombre: buyer?.nombre, email: buyer?.email, telefono: buyer?.telefono });
        console.log('Datos de envío:', shipping);

        // Validaciones básicas
        if (!items || !items.length) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
        }
        if (!buyer?.email) {
            return NextResponse.json({ error: 'El correo del comprador es obligatorio' }, { status: 400 });
        }

        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
        });

        const preference = new Preference(client);

        // Detectar URL del sitio de forma robusta
        const hostHeader = req.headers.get('host') || '';
        let siteUrl = 'http://localhost:3000';

        // Si no estamos en local, usamos la variable de entorno
        if (!hostHeader.includes('localhost') && !hostHeader.includes('127.0.0.1') && process.env.NEXT_PUBLIC_SITE_URL) {
            siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/[\n\r]/g, '').trim();
        } else {
            // En local forzamos localhost:3000 para evitar desajustes
            siteUrl = 'http://localhost:3000';
        }

        console.log('Site URL FINAL para Mercado Pago:', siteUrl);

        const body: any = {
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
                    title: shipping.provider || 'Envío por Mensajería',
                    unit_price: Math.round(Number(shipping.cost || 15000)),
                    quantity: 1,
                    currency_id: 'COP',
                }] : [])
            ],
            payer: {
                name: buyer.nombre || 'Cliente',
                email: buyer.email,
                phone: buyer.telefono ? {
                    number: String(buyer.telefono).replace(/\D/g, ''),
                } : undefined,
            },
            back_urls: {
                success: `${siteUrl}/pago_exitoso`.trim(),
                failure: `${siteUrl}/carrito`.trim(),
                pending: `${siteUrl}/carrito`.trim(),
            },
            // NOTA: auto_return falla en localhost/http. Solo habilitar en producción con https.
            // auto_return: 'approved',
            metadata: {
                shipping_mode: shipping?.mode || 'tienda',
                customer_email: buyer?.email || '',
                customer_phone: buyer?.telefono || '',
                customer_name: buyer?.nombre || shipping?.data?.nombre || 'Cliente',
                customer_address: shipping?.data?.direccion || 'Retiro en Tienda',
                customer_city: shipping?.data?.ciudad || 'Bogotá',
            }
        };

        console.log('PREFERENCIA MP:', JSON.stringify(body, null, 2));

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
