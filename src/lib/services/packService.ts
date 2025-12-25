import type { Player } from './lichessApi';

export type PackType = 'PAWN' | 'KNIGHT' | 'KING';

export interface PackConfig {
    id: PackType;
    name: string;
    price: number;
    cardCount: number;
    description: string;
    probabilities: {
        legendary: number; // 2750+
        epic: number;      // 2650-2749
        rare: number;      // 2550-2649
        common: number;    // <2550
    };
    image: string;
}

export const PACKS: Record<PackType, PackConfig> = {
    PAWN: {
        id: 'PAWN',
        name: 'Sobre Peón',
        price: 100,
        cardCount: 3,
        description: 'Ideal para principiantes. Contiene 3 cartas comunes con pequeña probabilidad de sorpresa.',
        probabilities: { legendary: 0.01, epic: 0.05, rare: 0.20, common: 0.74 },
        image: '♟️'
    },
    KNIGHT: {
        id: 'KNIGHT',
        name: 'Sobre Caballo',
        price: 500,
        cardCount: 5,
        description: 'La elección del club. 5 cartas con mayores chances de rareza.',
        probabilities: { legendary: 0.05, epic: 0.15, rare: 0.40, common: 0.40 },
        image: '♞'
    },
    KING: {
        id: 'KING',
        name: 'Sobre Rey',
        price: 2000,
        cardCount: 10,
        description: 'Solo para la élite. 10 cartas, garantiza al menos una Rara o superior. Alta chance de Leyenda.',
        probabilities: { legendary: 0.15, epic: 0.25, rare: 0.40, common: 0.20 },
        image: '♚'
    }
};

export class PackService {
    openPack(packType: PackType, allPlayers: Player[]): Player[] {
        const config = PACKS[packType];
        const cards: Player[] = [];

        // Categorize players first for efficiency
        const pools = {
            legendary: allPlayers.filter(p => p.rating >= 2750),
            epic: allPlayers.filter(p => p.rating >= 2650 && p.rating < 2750),
            rare: allPlayers.filter(p => p.rating >= 2550 && p.rating < 2650),
            common: allPlayers.filter(p => p.rating < 2550)
        };

        // Fallback checks to prevent empty pool errors
        if (pools.legendary.length === 0) pools.legendary = pools.epic;
        if (pools.epic.length === 0) pools.epic = pools.rare;

        for (let i = 0; i < config.cardCount; i++) {
            const rand = Math.random();
            let selectedPool: Player[] = [];

            if (rand < config.probabilities.legendary) {
                selectedPool = pools.legendary;
            } else if (rand < config.probabilities.legendary + config.probabilities.epic) {
                selectedPool = pools.epic;
            } else if (rand < config.probabilities.legendary + config.probabilities.epic + config.probabilities.rare) {
                selectedPool = pools.rare;
            } else {
                selectedPool = pools.common;
            }

            // Pick random card from pool
            if (selectedPool.length > 0) {
                const randomCard = selectedPool[Math.floor(Math.random() * selectedPool.length)];
                cards.push(randomCard);
            } else {
                // Absolute fallback
                cards.push(allPlayers[Math.floor(Math.random() * allPlayers.length)]);
            }
        }

        return cards;
    }
}

export const packService = new PackService();
