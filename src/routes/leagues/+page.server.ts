import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    // Mock data for static build - database not available
    const users = [
        { id: '1', username: 'ChessMaster', totalPoints: 1500 },
        { id: '2', username: 'TacticKing', totalPoints: 1200 },
        { id: '3', username: 'EndgameExpert', totalPoints: 1100 },
        { id: '4', username: 'Opening_Guru', totalPoints: 950 },
        { id: '5', username: 'Blitz_Champion', totalPoints: 800 },
    ];

    return {
        users,
        currentPage: 1,
        totalPages: 1,
        totalUsers: 5
    };
};
