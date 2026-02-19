const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: 'TEST-7876315132286322-021916-3b1a9305f89ce66e2eb062d700a79fd0-3215192780'
});

async function test() {
    try {
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'test-1',
                        title: 'Producto de Prueba',
                        unit_price: 1000,
                        quantity: 1,
                        currency_id: 'COP'
                    }
                ],
                back_urls: {
                    success: 'http://localhost:3000/pago-exitoso',
                    failure: 'http://localhost:3000/carrito',
                    pending: 'http://localhost:3000/carrito'
                }
            }
        });
        console.log('SUCCESS:', response.id);
    } catch (error) {
        console.error('ERROR:', JSON.stringify(error, null, 2));
    }
}

test();
