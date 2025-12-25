// Lichess API Service
const LICHESS_API_BASE = 'https://lichess.org/api';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export interface LichessPlayer {
    id: string;
    username: string;
    perfs: {
        classical?: { rating: number };
        rapid?: { rating: number };
        blitz?: { rating: number };
    };
    profile?: {
        firstName?: string;
        lastName?: string;
        country?: string;
    };
}

export interface Player {
    id: string;
    name: string;
    username: string;
    rating: number;
    price: number;
    position: number;
    photoUrl: string;
    country?: string;
}

interface CachedData {
    players: Player[];
    timestamp: number;
}

class LichessApiService {
    private cache: CachedData | null = null;

    /**
     * Get top classical chess players from Lichess
     */
    async getTopPlayers(count: number = 50): Promise<Player[]> {
        // Check cache first
        if (this.cache && Date.now() - this.cache.timestamp < CACHE_DURATION) {
            return this.cache.players.slice(0, count);
        }

        try {
            const response = await fetch(`${LICHESS_API_BASE}/player/top/${count}/classical`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Lichess API error: ${response.status}`);
            }

            const data = await response.json();
            const players = this.transformPlayers(data.users || []);

            // Cache the result
            this.cache = {
                players,
                timestamp: Date.now()
            };

            return players;
        } catch (error) {
            console.error('Failed to fetch Lichess players:', error);

            // Return fallback data if API fails
            return this.getFallbackPlayers();
        }
    }

    /**
     * Transform Lichess API response to our Player format
     */
    private transformPlayers(lichessPlayers: LichessPlayer[]): Player[] {
        return lichessPlayers.map((player, index) => {
            const rating = player.perfs?.classical?.rating || 2500;
            const fullName = player.profile?.firstName && player.profile?.lastName
                ? `${player.profile.firstName} ${player.profile.lastName}`
                : player.username;

            return {
                id: player.id,
                username: player.username,
                name: fullName,
                rating,
                price: this.calculatePrice(rating),
                position: index + 1,
                photoUrl: `https://lichess1.org/assets/logo/lichess-pad-${player.username}.png`,
                country: player.profile?.country
            };
        });
    }

    /**
     * Calculate player price based on rating
     * Formula: (rating - 2000) * 100,000
     * Example: 2830 rating = 83M
     */
    private calculatePrice(rating: number): number {
        const basePrice = Math.max(0, rating - 2000) * 100000;
        return Math.round(basePrice / 1000000) * 1000000; // Round to nearest million
    }

    /**
     * Fallback players if Lichess API fails
     */
    private getFallbackPlayers(): Player[] {
        return [
            { id: 'magnuscarlsen', username: 'DrNykterstein', name: 'Magnus Carlsen', rating: 2830, price: 83000000, position: 1, photoUrl: '', country: 'NO' },
            { id: 'fabianocaruana', username: 'FabianoCaruana', name: 'Fabiano Caruana', rating: 2805, price: 80000000, position: 2, photoUrl: '', country: 'US' },
            { id: 'dingliren', username: 'DingLiren', name: 'Ding Liren', rating: 2780, price: 78000000, position: 3, photoUrl: '', country: 'CN' },
            { id: 'iannepo', username: 'lachesisQ', name: 'Ian Nepomniachtchi', rating: 2770, price: 77000000, position: 4, photoUrl: '', country: 'RU' },
            { id: 'hikarunakamura', username: 'Hikaru', name: 'Hikaru Nakamura', rating: 2765, price: 76000000, position: 5, photoUrl: '', country: 'US' },
            { id: 'alirezafirouzja', username: 'Firouzja2003', name: 'Alireza Firouzja', rating: 2760, price: 76000000, position: 6, photoUrl: '', country: 'FR' },
            { id: 'wesleyso', username: 'WesleySo', name: 'Wesley So', rating: 2755, price: 75000000, position: 7, photoUrl: '', country: 'US' },
            { id: 'levonaronian', username: 'Levon', name: 'Levon Aronian', rating: 2750, price: 75000000, position: 8, photoUrl: '', country: 'US' },
            { id: 'mvl', username: 'MVL', name: 'Maxime Vachier-Lagrave', rating: 2745, price: 74000000, position: 9, photoUrl: '', country: 'FR' },
            { id: 'anishgiri', username: 'AnishGiri', name: 'Anish Giri', rating: 2740, price: 74000000, position: 10, photoUrl: '', country: 'NL' },
            { id: 'vishy', username: 'Vishy', name: 'Viswanathan Anand', rating: 2735, price: 73000000, position: 11, photoUrl: '', country: 'IN' },
            { id: 'shakhriyar', username: 'Shakhriyar', name: 'Shakhriyar Mamedyarov', rating: 2730, price: 73000000, position: 12, photoUrl: '', country: 'AZ' },
            { id: 'teimour', username: 'Teimour', name: 'Teimour Radjabov', rating: 2725, price: 72000000, position: 13, photoUrl: '', country: 'AZ' },
            { id: 'grischuk', username: 'Grischuk', name: 'Alexander Grischuk', rating: 2720, price: 72000000, position: 14, photoUrl: '', country: 'RU' },
            { id: 'rapport', username: 'RichardRapport', name: 'Richard Rapport', rating: 2715, price: 71000000, position: 15, photoUrl: '', country: 'RO' }
        ];
    }

    /**
     * Clear cache (useful for manual refresh)
     */
    clearCache(): void {
        this.cache = null;
    }
}

export const lichessApi = new LichessApiService();
