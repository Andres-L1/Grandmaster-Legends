export interface Player {
    id: string;
    name: string;
    username: string;
    rating: number;
    country: string;
    photoUrl?: string;
}

export const STARTER_POOL: Player[] = [
    { id: 'shanglei-lu', name: 'Shanglei Lu', username: 'shanglei_lu', rating: 2643, country: 'CN' },
    { id: 'v-pranav', name: 'V Pranav', username: 'pranav_v', rating: 2641, country: 'IN' },
    { id: 'vladislav-artemiev', name: 'Vladislav Artemiev', username: 'artemiev', rating: 2641, country: 'RU' },
    { id: 'kirill-alekseenko', name: 'Kirill Alekseenko', username: 'alekseenko', rating: 2639, country: 'AT' },
    { id: 'raunak-sadhwani', name: 'Raunak Sadhwani', username: 'raunak_s', rating: 2638, country: 'IN' },
    { id: 'velimir-ivic', name: 'Velimir Ivic', username: 'ivic_vel', rating: 2637, country: 'RS' },
    { id: 'aryan-tari', name: 'Aryan Tari', username: 'aryantari', rating: 2637, country: 'NO' },
    { id: 'david-navara', name: 'David Navara', username: 'navara_d', rating: 2635, country: 'CZ' },
    { id: 'a-r-saleh-salem', name: 'A.R. Saleh Salem', username: 'salem_ar', rating: 2635, country: 'AE' },
    { id: 'aleksandar-indjic', name: 'Aleksandar Indjic', username: 'indjic_a', rating: 2635, country: 'RS' },
    { id: 'michael-adams', name: 'Michael Adams', username: 'mickey_adams', rating: 2634, country: 'GB' },
    { id: 'erwin-lami', name: 'Erwin L\'Ami', username: 'lami_erwin', rating: 2634, country: 'NL' },
    { id: 'vladimir-malakhov', name: 'Vladimir Malakhov', username: 'malakhov_v', rating: 2634, country: 'RU' },
    { id: 'ruslan-ponomariov', name: 'Ruslan Ponomariov', username: 'ponomariov', rating: 2633, country: 'UA' },
    { id: 'bassem-amin', name: 'Bassem Amin', username: 'amin_bassem', rating: 2633, country: 'EG' },
    { id: 'etienne-bacrot', name: 'Etienne Bacrot', username: 'bacrot', rating: 2630, country: 'FR' },
    { id: 'dmitrij-kollars', name: 'Dmitrij Kollars', username: 'kollars_d', rating: 2630, country: 'DE' },
    { id: 'boris-gelfand', name: 'Boris Gelfand', username: 'gelfand_b', rating: 2630, country: 'IL' },
    { id: 'abhimanyu-mishra', name: 'Abhimanyu Mishra', username: 'mishra_abhi', rating: 2629, country: 'US' },
    { id: 'jonas-buhl-bjerre', name: 'Jonas Buhl Bjerre', username: 'bjerre_jonas', rating: 2628, country: 'DK' }
];

// Helper to calculate initial rankings if needed, though mostly static now.
export const allPlayers = STARTER_POOL.sort((a, b) => b.rating - a.rating);
