import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Mock data for static build - database not available
    const teams: any[] = [];
    const user = {
        id: 'demo-user',
        username: 'Demo User',
        email: 'demo@example.com',
        totalPoints: 0,
        budget: 100000000
    };

    return {
        teams,
        user
    };
};
