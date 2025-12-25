import type { Player } from '$lib/data/players';

export type PackType = 'STARTER' | 'PAWN' | 'KNIGHT' | 'KING';

export interface PackConfig {
    id: PackType;
    name: string;
    price: number;
    cardCount: number;
    description: string;
    probabilities: {
        legendary: number; // 2660+
        epic: number;      // 2655-2659
        rare: number;      // 2650-2654
        common: number;    // <2650
    };
    image: string;
}

export const PACKS: Record<PackType, PackConfig> = {
    STARTER: {
        id: 'STARTER',
        name: 'Sobre Inicial',
        price: 0,
        cardCount: 3,
        description: 'Tu primer paso hacia la gloria. Incluye una lección sobre duplicados.',
        probabilities: { legendary: 0, epic: 0, rare: 0, common: 1 }, // Fixed logic override
        image: '🎁'
    },
    PAWN: {
        id: 'PAWN',
        name: 'Sobre Peón',
        price: 100,
        cardCount: 3,
        description: '3 Cartas. Ideal para empezar.',
        probabilities: { legendary: 0.05, epic: 0.15, rare: 0.30, common: 0.50 },
        image: '♟️'
    },
    KNIGHT: {
        id: 'KNIGHT',
        name: 'Sobre Caballo',
        price: 500,
        cardCount: 5,
        description: '5 Cartas. Mejores opciones.',
        probabilities: { legendary: 0.10, epic: 0.25, rare: 0.40, common: 0.25 },
        image: '♞'
    },
    KING: {
        id: 'KING',
        name: 'Sobre Rey',
        price: 2000,
        cardCount: 10,
        description: '10 Cartas para la élite.',
        probabilities: { legendary: 0.25, epic: 0.35, rare: 0.30, common: 0.10 },
        image: '♚'
    }
};

export class PackService {
    openPack(packType: PackType, allPlayers: Player[]): Player[] {
        if (packType === 'STARTER') {
            return this.openStarterPack(allPlayers);
        }

        const config = PACKS[packType];
        const cards: Player[] = [];

        // Categorize players (Adjusted for 81-100 Rankings)
        const pools = {
            legendary: allPlayers.filter(p => p.rating >= 2660),
            epic: allPlayers.filter(p => p.rating >= 2655 && p.rating < 2660),
            rare: allPlayers.filter(p => p.rating >= 2650 && p.rating < 2655),
            common: allPlayers.filter(p => p.rating < 2650)
        };

        // Fallback checks
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

            if (selectedPool.length > 0) {
                const randomCard = selectedPool[Math.floor(Math.random() * selectedPool.length)];
                cards.push(randomCard);
            } else {
                cards.push(allPlayers[Math.floor(Math.random() * allPlayers.length)]);
            }
        }

        return cards;
    }

    // Special logic: 2 Unique, 1 Duplicate
    private openStarterPack(allPlayers: Player[]): Player[] {
        const cards: Player[] = [];

        // Pick 2 different random players
        const p1 = allPlayers[Math.floor(Math.random() * allPlayers.length)];
        let p2 = allPlayers[Math.floor(Math.random() * allPlayers.length)];
        while (p2.id === p1.id) {
            p2 = allPlayers[Math.floor(Math.random() * allPlayers.length)];
        }

        // Add p1, p2, and p1 again (Duplicate!)
        cards.push(p1);
        cards.push(p2);
        cards.push(p1); // Intentionally adding p1 again to force duplicate logic

        return cards;
    }
}

export const packService = new PackService();
