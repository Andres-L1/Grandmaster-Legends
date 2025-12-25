<script lang="ts">
    import { AVAILABLE_PLAYERS } from "$lib/stores/localStorage";
    import { user } from "$lib/stores/user";
    import { ownedPlayerIds } from "$lib/stores/players";
    import type { Player } from "$lib/stores/localStorage";

    let searchQuery = "";
    let sortBy: "position" | "price" | "name" = "position";
    let buyingPlayerId: string | null = null;
    let message: { text: string; type: "success" | "error" } | null = null;

    $: filteredPlayers = AVAILABLE_PLAYERS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ).sort((a, b) => {
        if (sortBy === "position") return a.position - b.position;
        if (sortBy === "price") return b.price - a.price;
        return a.name.localeCompare(b.name);
    });

    function isOwned(playerId: string): boolean {
        return $ownedPlayerIds.includes(playerId);
    }

    function buyPlayer(player: Player) {
        buyingPlayerId = player.id;

        const result = ownedPlayerIds.buyPlayer(player.id, player.price);

        message = {
            text: result.message,
            type: result.success ? "success" : "error",
        };

        buyingPlayerId = null;
        setTimeout(() => (message = null), 3000);
    }

    function formatPrice(price: number): string {
        return `${(price / 1000000).toFixed(1)}M`;
    }
</script>

<svelte:head>
    <title>Mercado - Grandmaster Fantasy</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">
                Mercado de Jugadores
            </h1>
            <p class="text-gray-400 mt-2">
                Presupuesto disponible: <span
                    class="text-yellow-400 font-semibold"
                    >{formatPrice($user.budget)}</span
                >
            </p>
        </div>
    </div>

    <!-- Message -->
    {#if message}
        <div
            class="p-4 rounded-lg {message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                : 'bg-red-500/20 border border-red-500/50 text-red-200'}"
            role="alert"
        >
            {message.text}
        </div>
    {/if}

    <!-- Search & Sort -->
    <div class="flex flex-col sm:flex-row gap-4">
        <input
            type="text"
            placeholder="Buscar jugador..."
            bind:value={searchQuery}
            class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
            bind:value={sortBy}
            class="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
            <option value="position">Ordenar por Ranking</option>
            <option value="price">Ordenar por Precio</option>
            <option value="name">Ordenar por Nombre</option>
        </select>
    </div>

    <!-- Mobile Card View -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
        {#each filteredPlayers as player (player.id)}
            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition"
            >
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h3 class="font-semibold text-white text-lg">
                            {player.name}
                        </h3>
                        <p class="text-gray-400 text-sm">
                            Ranking #{player.position}
                        </p>
                    </div>
                    <div class="text-2xl">♔</div>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Rating:</span>
                        <span class="text-white font-medium"
                            >{player.rating}</span
                        >
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Precio:</span>
                        <span class="text-yellow-400 font-semibold"
                            >{formatPrice(player.price)}</span
                        >
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Promedio:</span>
                        <span class="text-green-400 font-medium"
                            >{player.averagePoints.toFixed(1)} pts</span
                        >
                    </div>
                </div>

                {#if isOwned(player.id)}
                    <button
                        disabled
                        class="w-full bg-green-600/50 text-green-200 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                    >
                        ✓ En tu roster
                    </button>
                {:else}
                    <button
                        on:click={() => buyPlayer(player)}
                        disabled={buyingPlayerId === player.id ||
                            $user.budget < player.price}
                        class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition transform active:scale-95"
                    >
                        {#if buyingPlayerId === player.id}
                            Fichando...
                        {:else if $user.budget < player.price}
                            Sin presupuesto
                        {:else}
                            Fichar
                        {/if}
                    </button>
                {/if}
            </div>
        {/each}
    </div>

    <!-- Desktop Table View -->
    <div
        class="hidden md:block overflow-x-auto rounded-xl border border-white/10"
    >
        <table class="w-full">
            <thead class="bg-white/5">
                <tr>
                    <th
                        class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                        >#</th
                    >
                    <th
                        class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                        >Jugador</th
                    >
                    <th
                        class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                        >Rating</th
                    >
                    <th
                        class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                        >Precio</th
                    >
                    <th
                        class="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                        >Promedio</th
                    >
                    <th
                        class="px-6 py-4 text-right text-sm font-semibold text-gray-300"
                        >Acción</th
                    >
                </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
                {#each filteredPlayers as player (player.id)}
                    <tr class="hover:bg-white/5 transition">
                        <td class="px-6 py-4 text-gray-400"
                            >{player.position}</td
                        >
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl"
                                >
                                    ♔
                                </div>
                                <span class="font-medium text-white"
                                    >{player.name}</span
                                >
                            </div>
                        </td>
                        <td class="px-6 py-4 text-white">{player.rating}</td>
                        <td class="px-6 py-4 text-yellow-400 font-semibold"
                            >{formatPrice(player.price)}</td
                        >
                        <td class="px-6 py-4 text-green-400"
                            >{player.averagePoints.toFixed(1)} pts</td
                        >
                        <td class="px-6 py-4 text-right">
                            {#if isOwned(player.id)}
                                <span
                                    class="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm"
                                >
                                    ✓ Fichado
                                </span>
                            {:else}
                                <button
                                    on:click={() => buyPlayer(player)}
                                    disabled={buyingPlayerId === player.id ||
                                        $user.budget < player.price}
                                    class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105 disabled:transform-none"
                                >
                                    {#if buyingPlayerId === player.id}
                                        ...
                                    {:else if $user.budget < player.price}
                                        Sin presupuesto
                                    {:else}
                                        Fichar
                                    {/if}
                                </button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    {#if filteredPlayers.length === 0}
        <div class="text-center py-12">
            <p class="text-gray-400 text-lg">No se encontraron jugadores</p>
        </div>
    {/if}
</div>
