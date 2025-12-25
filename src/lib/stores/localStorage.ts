// LocalStorage Service - Centralized storage management
const STORAGE_KEYS = {
    USER: 'gf_user',
    OWNED_PLAYERS: 'gf_owned_players',
    CURRENT_TEAM: 'gf_current_team',
    CAPTAIN: 'gf_captain'
} as const;

export interface User {
    username: string;
    budget: number;
    totalPoints: number;
}

export interface Player {
    id: string;
    name: string;
    rating: number;
    price: number;
    position: number;
    averagePoints: number;
}

// Default user data
const DEFAULT_USER: User = {
    username: 'Guest Player',
    budget: 100000000, // 100M initial budget
    totalPoints: 0
};

// Available players (hardcoded for now)
export const AVAILABLE_PLAYERS: Player[] = [
    { id: '1', name: 'Magnus Carlsen', rating: 2830, price: 50000000, position: 1, averagePoints: 8.5 },
    { id: '2', name: 'Fabiano Caruana', rating: 2805, price: 45000000, position: 2, averagePoints: 7.8 },
    { id: '3', name: 'Ding Liren', rating: 2780, price: 43000000, position: 3, averagePoints: 7.5 },
    { id: '4', name: 'Ian Nepomniachtchi', rating: 2770, price: 42000000, position: 4, averagePoints: 7.2 },
    { id: '5', name: 'Hikaru Nakamura', rating: 2765, price: 40000000, position: 5, averagePoints: 7.0 },
    { id: '6', name: 'Alireza Firouzja', rating: 2760, price: 38000000, position: 6, averagePoints: 6.8 },
    { id: '7', name: 'Wesley So', rating: 2755, price: 35000000, position: 7, averagePoints: 6.5 },
    { id: '8', name: 'Levon Aronian', rating: 2750, price: 33000000, position: 8, averagePoints: 6.3 },
    { id: '9', name: 'Maxime Vachier-Lagrave', rating: 2745, price: 30000000, position: 9, averagePoints: 6.0 },
    { id: '10', name: 'Anish Giri', rating: 2740, price: 28000000, position: 10, averagePoints: 5.8 },
    { id: '11', name: 'Viswanathan Anand', rating: 2735, price: 25000000, position: 11, averagePoints: 5.5 },
    { id: '12', name: 'Shakhriyar Mamedyarov', rating: 2730, price: 23000000, position: 12, averagePoints: 5.3 },
    { id: '13', name: 'Teimour Radjabov', rating: 2725, price: 20000000, position: 13, averagePoints: 5.0 },
    { id: '14', name: 'Alexander Grischuk', rating: 2720, price: 18000000, position: 14, averagePoints: 4.8 },
    { id: '15', name: 'Richard Rapport', rating: 2715, price: 15000000, position: 15, averagePoints: 4.5 }
];

class LocalStorageService {
    // Get user data
    getUser(): User {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        return data ? JSON.parse(data) : DEFAULT_USER;
    }

    // Save user data
    saveUser(user: User): void {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    // Get owned player IDs
    getOwnedPlayerIds(): string[] {
        const data = localStorage.getItem(STORAGE_KEYS.OWNED_PLAYERS);
        return data ? JSON.parse(data) : [];
    }

    // Save owned player IDs
    saveOwnedPlayerIds(ids: string[]): void {
        localStorage.setItem(STORAGE_KEYS.OWNED_PLAYERS, JSON.stringify(ids));
    }

    // Get current team lineup (max 5 players)
    getCurrentTeam(): string[] {
        const data = localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM);
        return data ? JSON.parse(data) : [];
    }

    // Save current team lineup
    saveCurrentTeam(playerIds: string[]): void {
        localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM, JSON.stringify(playerIds.slice(0, 5)));
    }

    // Get captain ID
    getCaptain(): string | null {
        return localStorage.getItem(STORAGE_KEYS.CAPTAIN);
    }

    // Save captain ID
    saveCaptain(playerId: string | null): void {
        if (playerId) {
            localStorage.setItem(STORAGE_KEYS.CAPTAIN, playerId);
        } else {
            localStorage.removeItem(STORAGE_KEYS.CAPTAIN);
        }
    }

    // Reset all data
    resetAll(): void {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.OWNED_PLAYERS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM);
        localStorage.removeItem(STORAGE_KEYS.CAPTAIN);
    }

    // Initialize with defaults if needed
    initialize(): void {
        if (!localStorage.getItem(STORAGE_KEYS.USER)) {
            this.saveUser(DEFAULT_USER);
        }
        if (!localStorage.getItem(STORAGE_KEYS.OWNED_PLAYERS)) {
            this.saveOwnedPlayerIds([]);
        }
        if (!localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM)) {
            this.saveCurrentTeam([]);
        }
    }
}

export const storageService = new LocalStorageService();
