<script lang="ts">
    import { user } from "$lib/stores/user";

    // Mock leaderboard data - can be expanded with localStorage later
    const leaderboard = [
        { rank: 1, username: "ChessMaster Pro", points: 2500, badge: "👑" },
        { rank: 2, username: "TacticGuru", points: 2200, badge: "🥈" },
        { rank: 3, username: "EndgameKing", points: 2100, badge: "🥉" },
        { rank: 4, username: "Opening_Expert", points: 1900 },
        { rank: 5, username: "Blitz_Wizard", points: 1850 },
        { rank: 6, username: "Positional_Player", points: 1700 },
        { rank: 7, username: "AttackSpecialist", points: 1650 },
        { rank: 8, username: "DefenseMaestro", points: 1600 },
        { rank: 9, username: "TimeManager", points: 1550 },
        { rank: 10, username: "Combo_Hunter", points: 1500 },
    ];

    $: currentUserRank =
        leaderboard.findIndex((p) => p.points < $user.totalPoints) + 1 ||
        leaderboard.length + 1;

    function getRankColor(rank: number): string {
        if (rank === 1) return "text-yellow-400";
        if (rank === 2) return "text-gray-300";
        if (rank === 3) return "text-orange-400";
        return "text-white";
    }

    function getRankBg(rank: number): string {
        if (rank === 1) return "bg-yellow-500/20 border-yellow-500/50";
        if (rank === 2) return "bg-gray-500/20 border-gray-500/50";
        if (rank === 3) return "bg-orange-500/20 border-orange-500/50";
        return "bg-white/5 border-white/10";
    }
</script>

<svelte:head>
    <title>Ligas - Grandmaster Fantasy</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">
                Ligas Globales
            </h1>
            <p class="text-gray-400 mt-2">
                Compite con jugadores de todo el mundo
            </p>
        </div>
    </div>

    <!-- Current User Stats -->
    <div
        class="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6"
    >
        <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                    {$user.username}
                </h2>
                <div class="flex flex-wrap gap-4 text-sm">
                    <div>
                        <span class="text-gray-400">Puesto:</span>
                        <span class="ml-2 text-purple-400 font-semibold"
                            >#{currentUserRank}</span
                        >
                    </div>
                    <div>
                        <span class="text-gray-400">Puntos:</span>
                        <span class="ml-2 text-white font-semibold"
                            >{$user.totalPoints}</span
                        >
                    </div>
                    <div>
                        <span class="text-gray-400">Presupuesto:</span>
                        <span class="ml-2 text-yellow-400 font-semibold"
                            >{($user.budget / 1000000).toFixed(1)}M</span
                        >
                    </div>
                </div>
            </div>
            {#if currentUserRank <= 3}
                <div class="text-4xl">
                    {currentUserRank === 1
                        ? "👑"
                        : currentUserRank === 2
                          ? "🥈"
                          : "🥉"}
                </div>
            {/if}
        </div>
    </div>

    <!-- Leaderboard -->
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"
    >
        <div class="p-6 border-b border-white/10">
            <h2 class="text-2xl font-bold text-white">Top 10 Global</h2>
        </div>

        <!-- Mobile View -->
        <div class="md:hidden divide-y divide-white/5">
            {#each leaderboard as player (player.rank)}
                <div
                    class="p-4 flex items-center gap-4 {getRankBg(player.rank)}"
                >
                    <div
                        class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    >
                        {#if player.badge}
                            <span class="text-2xl">{player.badge}</span>
                        {:else}
                            <span class="text-white font-bold"
                                >#{player.rank}</span
                            >
                        {/if}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3
                            class="font-semibold {getRankColor(
                                player.rank,
                            )} truncate"
                        >
                            {player.username}
                        </h3>
                        <p class="text-gray-400 text-sm">
                            {player.points} puntos
                        </p>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Desktop View -->
        <div class="hidden md:block">
            <table class="w-full">
                <thead class="bg-white/5">
                    <tr>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                            >Puesto</th
                        >
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                            >Jugador</th
                        >
                        <th
                            class="px-6 py-4 text-right text-sm font-semibold text-gray-300"
                            >Puntos</th
                        >
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    {#each leaderboard as player (player.rank)}
                        <tr
                            class="hover:bg-white/5 transition {getRankBg(
                                player.rank,
                            )}"
                        >
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    {#if player.badge}
                                        <span class="text-2xl"
                                            >{player.badge}</span
                                        >
                                    {:else}
                                        <span class="text-gray-400 font-medium"
                                            >#{player.rank}</span
                                        >
                                    {/if}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl"
                                    >
                                        👤
                                    </div>
                                    <span
                                        class="font-medium {getRankColor(
                                            player.rank,
                                        )}">{player.username}</span
                                    >
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <span class="font-semibold text-white"
                                    >{player.points.toLocaleString()}</span
                                >
                                <span class="text-gray-400 text-sm ml-1"
                                    >pts</span
                                >
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Info Card -->
    <div
        class="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6"
    >
        <h3 class="text-lg font-semibold text-white mb-2">
            💡 ¿Cómo ganar puntos?
        </h3>
        <ul class="space-y-2 text-gray-300 text-sm">
            <li>• Tus jugadores ganan puntos basados en sus partidas reales</li>
            <li>• El capitán (⭐) gana puntos dobles</li>
            <li>• Victoria: +10 pts | Tablas: +3 pts | Derrota: -2 pts</li>
            <li>• Bonus por ganar con negras: +2 pts</li>
            <li>• Racha de 3+ victorias: +5 pts</li>
        </ul>
    </div>
</div>
