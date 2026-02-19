import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

export async function GET(req: NextRequest) {
    const paymentId = req.nextUrl.searchParams.get('payment_id');

    if (!paymentId) {
        return NextResponse.json({ error: 'Falta el ID de pago' }, { status: 400 });
    }

    try {
        const payment = new Payment(client);
        const result = await payment.get({ id: paymentId });

        // Extraemos solo lo necesario para el frontend
        const data = {
            id: result.id,
            status: result.status,
            total_paid: result.transaction_amount,
            shipping_address: result.additional_info?.shipments?.receiver_address || null,
            payer_email: result.payer?.email
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error al obtener pago:', error);
        return NextResponse.json({ error: 'No se pudo recuperar la información del pago' }, { status: 500 });
    }
}
