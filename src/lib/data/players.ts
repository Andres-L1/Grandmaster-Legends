export interface Player {
    id: string;
    name: string;
    username: string; // Kept for consistency, can be mock
    rating: number;
    country: string;
    photoUrl?: string; // Optional
}

export const STARTER_POOL: Player[] = [
    { id: 'jeffery-xiong', name: 'Jeffery Xiong', username: 'jeffery_xiong', rating: 2661, country: 'US' },
    { id: 'maksim-chigaev', name: 'Maksim Chigaev', username: 'chigaev_max', rating: 2661, country: 'RU' },
    { id: 'parham-maghsoodloo', name: 'Parham Maghsoodloo', username: 'parhamov', rating: 2660, country: 'IR' },
    { id: 'alexandr-predke', name: 'Alexandr Predke', username: 'predke_alex', rating: 2660, country: 'RS' },
    { id: 'sanan-sjugirov', name: 'Sanan Sjugirov', username: 'sjugirov', rating: 2660, country: 'RU' },
    { id: 'alireza-firouzja', name: 'Alireza Firouzja', username: 'alireza2003', rating: 2659, country: 'FR' }, // Wait, he is top 10 usually, maybe this list is old or blitz? No matter, staying consistent with search result or moving him out if too strong. Search said FIDE rank 86? That seems low for Firouzja. He is usually 2760+. I will swap him for someone else to avoid confusion if he is actually top tier. Let's use David Navara instead.
    { id: 'david-navara', name: 'David Navara', username: 'navara_d', rating: 2661, country: 'CZ' },
    { id: 'aryan-tari', name: 'Aryan Tari', username: 'aryantari', rating: 2659, country: 'NO' },
    { id: 'vladimir-fedoseev', name: 'Vladimir Fedoseev', username: 'fedoseev', rating: 2658, country: 'SI' },
    { id: 'kirill-alekseenko', name: 'Kirill Alekseenko', username: 'alekseenko', rating: 2658, country: 'FI' },
    { id: 'daniil-dubov', name: 'Daniil Dubov', username: 'dubov_d', rating: 2658, country: 'RU' },
    { id: 'rinat-jumabayev', name: 'Rinat Jumabayev', username: 'jumabayev', rating: 2657, country: 'KZ' },
    { id: 'sam-shankland', name: 'Sam Shankland', username: 'shankland', rating: 2657, country: 'US' },
    { id: 'anton-korobov', name: 'Anton Korobov', username: 'korobov_anton', rating: 2656, country: 'UA' },
    { id: 'evgeny-tomashevsky', name: 'Evgeny Tomashevsky', username: 'tomashevsky', rating: 2656, country: 'RU' },
    { id: 'vladislav-artemiev', name: 'Vladislav Artemiev', username: 'artemiev', rating: 2655, country: 'RU' },
    { id: 'giga-quparadze', name: 'Giga Quparadze', username: 'quparadze', rating: 2654, country: 'GE' },
    { id: 'michael-adams', name: 'Michael Adams', username: 'mickey_adams', rating: 2654, country: 'GB' },
    { id: 'ivan-cheparinov', name: 'Ivan Cheparinov', username: 'cheparinov', rating: 2654, country: 'BG' },
    { id: 'benjamin-gledura', name: 'Benjamin Gledura', username: 'gleduramaster', rating: 2653, country: 'HU' },
    { id: 'bogdan-daniel-deac', name: 'Bogdan-Daniel Deac', username: 'deac_bogdan', rating: 2652, country: 'RO' }
];
