/**
 * Estimativa de custos de pedágio baseada em distância e estado.
 * Valores aproximados para MVP. Futuramente conectar com API de pedágios.
 */

interface TollRate {
    pricePerKm: number;
}

const TOLL_RATES: Record<string, TollRate> = {
    'SP': { pricePerKm: 0.16 }, // R$ 16,00 a cada 100km (Média Rod. Bandeirantes/Anhanguera)
    'RJ': { pricePerKm: 0.14 },
    'MG': { pricePerKm: 0.10 },
    'PR': { pricePerKm: 0.12 },
    'SC': { pricePerKm: 0.10 },
    'RS': { pricePerKm: 0.11 },
    'default': { pricePerKm: 0.12 }
};

export const estimateTolls = (distanceMeters: number, stateCode: string = 'SP'): number => {
    const distanceKm = distanceMeters / 1000;
    const rate = TOLL_RATES[stateCode] || TOLL_RATES['default'];

    // Pedágios geralmente aparecem a cada 50-100km.
    // Vamos assumir um custo linear para simplificação do MVP.
    const estimatedCost = distanceKm * rate.pricePerKm;

    // Arredondar para casa decimal de moeda
    return Math.ceil(estimatedCost * 10) / 10;
};
