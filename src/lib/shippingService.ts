/**
 * Shipping Service - Dante Promociones
 * Origin: Cali, Colombia
 */

export interface ShippingRate {
    cost: number;
    provider: string;
    estimatedDays: string;
}

const LOCAL_CITY = 'cali';
const LOCAL_RATE = 8000; // Local delivery cost (e.g. Rappi/Mensajería local)
const INTERMUNICIPAL_RATE = 15000; // Standard intermunicipal cost (e.g. Servientrega)

export async function calculateShipping(city: string): Promise<ShippingRate> {
    const normalizedCity = city.toLowerCase().trim();

    // Simplification for now: If city is Cali, use local rate.
    // In a real scenario, this would call a Rappi or Servientrega API.

    if (normalizedCity === LOCAL_CITY) {
        return {
            cost: LOCAL_RATE,
            provider: 'Mensajería local (Rappi/Veloz)',
            estimatedDays: 'Mismo día / 24h'
        };
    }

    return {
        cost: INTERMUNICIPAL_RATE,
        provider: 'Servientrega / Envia',
        estimatedDays: '2-4 días hábiles'
    };
}
