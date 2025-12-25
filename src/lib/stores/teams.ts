import { writable, derived } from 'svelte/store';
import { storageService } from './localStorage';
import { browser } from '$app/environment';
import { ownedPlayerIds } from './players';

// Create writable store for current team lineup (max 5 players)
function createCurrentTeamStore() {
    const initialTeam = browser ? storageService.getCurrentTeam() : [];
    const { subscribe, set, update } = writable<string[]>(initialTeam);

    return {
        subscribe,
        addToTeam: (playerId: string): { success: boolean; message: string } => {
            let result = { success: false, message: '' };

            update(team => {
                // Check if already in team
                if (team.includes(playerId)) {
                    result = { success: false, message: 'Jugador ya está en el equipo' };
                    return team;
                }

                // Check team size
                if (team.length >= 5) {
                    result = { success: false, message: 'Equipo completo (máximo 5 jugadores)' };
                    return team;
                }

                // Check if player is owned
                let isOwned = false;
                ownedPlayerIds.subscribe(ids => {
                    isOwned = ids.includes(playerId);
                })();

                if (!isOwned) {
                    result = { success: false, message: 'Primero debes fichar a este jugador' };
                    return team;
                }

                // Add to team
                const newTeam = [...team, playerId];
                if (browser) storageService.saveCurrentTeam(newTeam);

                result = { success: true, message: 'Jugador añadido al equipo' };
                return newTeam;
            });

            return result;
        },
        removeFromTeam: (playerId: string) => {
            update(team => {
                const newTeam = team.filter(id => id !== playerId);
                if (browser) storageService.saveCurrentTeam(newTeam);

                // If removed player was captain, clear captain
                const captainId = browser ? storageService.getCaptain() : null;
                if (captainId === playerId) {
                    storageService.saveCaptain(null);
                }

                return newTeam;
            });
        },
        setTeam: (playerIds: string[]) => {
            const newTeam = playerIds.slice(0, 5);
            set(newTeam);
            if (browser) storageService.saveCurrentTeam(newTeam);
        },
        reset: () => {
            set([]);
            if (browser) storageService.saveCurrentTeam([]);
        }
    };
}

// Create writable store for captain
function createCaptainStore() {
    const initialCaptain = browser ? storageService.getCaptain() : null;
    const { subscribe, set } = writable<string | null>(initialCaptain);

    return {
        subscribe,
        setCaptain: (playerId: string | null) => {
            // Validate captain is in current team
            if (playerId) {
                const team = browser ? storageService.getCurrentTeam() : [];
                if (!team.includes(playerId)) {
                    return { success: false, message: 'El capitán debe estar en el equipo' };
                }
            }

            set(playerId);
            if (browser) storageService.saveCaptain(playerId);
            return { success: true, message: playerId ? 'Capitán asignado' : 'Capitán eliminado' };
        },
        reset: () => {
            set(null);
            if (browser) storageService.saveCaptain(null);
        }
    };
}

export const currentTeam = createCurrentTeamStore();
export const captain = createCaptainStore();

// Derived store for team size
export const teamSize = derived(currentTeam, ($team) => $team.length);

// Derived store to check if team is full
export const isTeamFull = derived(teamSize, ($size) => $size >= 5);
