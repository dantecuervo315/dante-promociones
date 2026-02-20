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
        const hostHeader = req.headers.get('host');
        const protocol = hostHeader?.includes('localhost') ? 'http' : 'https';
        let siteUrl = (hostHeader ? `${protocol}://${hostHeader}` : process.env.NEXT_PUBLIC_SITE_URL) || 'http://localhost:3000';

        // Limpiar siteUrl de posibles saltos de línea (\r\n) que vienen de Windows
        siteUrl = siteUrl.replace(/[\n\r]/g, '').trim();

        console.log('Site URL detectado para Mercado Pago:', siteUrl);

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
                success: `${siteUrl}/pago-exitoso`,
                failure: `${siteUrl}/carrito`,
                pending: `${siteUrl}/carrito`,
            },
            auto_return: 'approved' as const,
            metadata: {
                shipping_mode: shipping?.mode || 'tienda',
                customer_email: buyer?.email || '',
                customer_phone: buyer?.telefono || '',
                customer_name: buyer?.nombre || shipping?.data?.nombre || 'Cliente',
                customer_address: shipping?.data?.direccion || 'Retiro en Tienda',
                customer_city: shipping?.data?.ciudad || 'Bogotá',
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
