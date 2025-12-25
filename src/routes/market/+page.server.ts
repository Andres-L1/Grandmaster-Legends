import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Mock data for static build - database not available
    const players = [
        { id: '1', name: 'Magnus Carlsen', fideId: '1503014', currentPrice: 50000000, averagePoints: 8.5, positionRank: 1, photoUrl: null },
        { id: '2', name: 'Fabiano Caruana', fideId: '2020009', currentPrice: 45000000, averagePoints: 7.8, positionRank: 2, photoUrl: null },
        { id: '3', name: 'Ding Liren', fideId: '8603677', currentPrice: 43000000, averagePoints: 7.5, positionRank: 3, photoUrl: null },
        { id: '4', name: 'Ian Nepomniachtchi', fideId: '4168119', currentPrice: 42000000, averagePoints: 7.2, positionRank: 4, photoUrl: null },
        { id: '5', name: 'Hikaru Nakamura', fideId: '2016192', currentPrice: 40000000, averagePoints: 7.0, positionRank: 5, photoUrl: null },
    ];

    return { players };
};
