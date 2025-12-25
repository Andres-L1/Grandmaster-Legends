import { writable, derived, get } from 'svelte/store';
// import { lichessApi, type Player } from '$lib/services/lichessApi'; // Removed
import { STARTER_POOL, type Player } from '$lib/data/players';
import { storageService } from './localStorage';
import { browser } from '$app/environment';
import { user } from './user';

// Extended Player interface with custom rarity if needed, though mostly derived from rating
export interface OwnedPlayer extends Player {
    count: number; // For duplicates in future
}

// Store for all available players
const availablePlayersStore = writable<Player[]>(STARTER_POOL);

// Loading state (Instant now)
export const playersLoading = writable<boolean>(false);

/* Lichess API Removed for limited pool pivot
if (browser) {
    lichessApi.getTopPlayers(500).then(players => {
        availablePlayersStore.set(players);
        playersLoading.set(false);
    }).catch(err => {
        console.error('Failed to load players:', err);
        playersLoading.set(false);
    });
}
*/

// Create writable store for collected card IDs
function createCollectionStore() {
    const initialIds = browser ? storageService.getCollection() : [];
    const { subscribe, set, update } = writable<string[]>(initialIds);

    return {
        subscribe,
        addCard: (playerId: string): { isNew: boolean } => {
            let isNew = false;
            update(ids => {
                if (!ids.includes(playerId)) {
                    isNew = true;
                    const newIds = [...ids, playerId];
                    if (browser) storageService.saveCollection(newIds);
                    return newIds;
                }
                return ids;
            });
            return { isNew };
        },
        removeCard: (playerId: string) => { // Quicksell
            update(ids => {
                const newIds = ids.filter(id => id !== playerId);
                if (browser) storageService.saveCollection(newIds);
                return newIds;
            });
        },
        reset: () => {
            set([]);
            if (browser) storageService.saveCollection([]);
        }
    };
}

export const collectionIds = createCollectionStore();

// Derived store for collected player objects
export const collectedDetails = derived(
    [collectionIds, availablePlayersStore],
    ([$ids, $allPlayers]) => {
        return $allPlayers.filter(p => $ids.includes(p.id));
    }
);

// All players
export const allPlayers = availablePlayersStore;
