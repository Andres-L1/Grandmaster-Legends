<script lang="ts">
    import {
        allPlayers,
        availablePlayers,
        ownedPlayerIds,
        playersLoading,
    } from "$lib/stores/players";
    import { user } from "$lib/stores/user";
    import type { Player } from "$lib/services/lichessApi";

    let searchQuery = "";
    let sortBy: "position" | "price" | "name" = "position";
    let buyingPlayerId: string | null = null;
    let message: { text: string; type: "success" | "error" } | null = null;

    $: filteredPlayers = $availablePlayers
        .filter(
            (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.username.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
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
        return `${(price / 1000000).toFixed(0)}M`;
    }

    function getPriceColor(price: number, budget: number): string {
        if (price > budget) return "rgb(239, 83, 80)"; // error
        if (price > budget * 0.7) return "rgb(255, 183, 77)"; // warning
        return "rgb(102, 187, 106)"; // success
    }
</script>

<svelte:head>
    <title>Mercado - Grandmaster Fantasy</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-bold" style="color: rgb(227, 242, 253);">
            Mercado de Jugadores
        </h1>
        <p class="text-sm mt-2" style="color: rgb(120, 144, 156);">
            Ficha a jugadores del top 50 de ajedrez clásico de Lichess
        </p>
    </div>

    <!-- Message -->
    {#if message}
        <div
            class="p-4 rounded-lg border {message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'}"
            role="alert"
        >
            <span
                style="color: {message.type === 'success'
                    ? 'rgb(102, 187, 106)'
                    : 'rgb(239, 83, 80)'};"
            >
                {message.text}
            </span>
        </div>
    {/if}

    <!-- Search -->
    <div class="flex gap-4">
        <input
            type="text"
            placeholder="Buscar jugador..."
            bind:value={searchQuery}
            class="input flex-1"
        />
        <select bind:value={sortBy} class="input">
            <option value="position">Por Ranking</option>
            <option value="price">Por Precio</option>
            <option value="name">Por Nombre</option>
        </select>
    </div>

    <!-- Loading State -->
    {#if $playersLoading}
        <div class="text-center py-12">
            <div class="text-4xl mb-4">♔</div>
            <p style="color: rgb(176, 190, 197);">
                Cargando jugadores desde Lichess...
            </p>
        </div>
    {:else}
        <!-- Table -->
        <div
            class="rounded-lg border overflow-hidden"
            style="background: rgb(26, 35, 50); border-color: rgba(55, 71, 79, 0.3);"
        >
            <table class="w-full">
                <thead style="background: rgba(33, 45, 63, 0.5);">
                    <tr>
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold"
                            style="color: rgb(176, 190, 197);">#</th
                        >
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold"
                            style="color: rgb(176, 190, 197);">Jugador</th
                        >
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold"
                            style="color: rgb(176, 190, 197);">Rating</th
                        >
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold"
                            style="color: rgb(176, 190, 197);">Precio</th
                        >
                        <th
                            class="px-4 py-3 text-right text-xs font-semibold"
                            style="color: rgb(176, 190, 197);">Acción</th
                        >
                    </tr>
                </thead>
                <tbody
                    class="divide-y"
                    style="divide-color: rgba(55, 71, 79, 0.2);"
                >
                    {#each filteredPlayers as player (player.id)}
                        <tr class="hover:bg-white/5 transition">
                            <td
                                class="px-4 py-3 text-sm"
                                style="color: rgb(120, 144, 156);"
                                >{player.position}</td
                            >
                            <td class="px-4 py-3">
                                <div>
                                    <div
                                        class="font-medium"
                                        style="color: rgb(227, 242, 253);"
                                    >
                                        {player.name}
                                    </div>
                                    <div
                                        class="text-xs"
                                        style="color: rgb(120, 144, 156);"
                                    >
                                        @{player.username}
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="font-mono font-semibold"
                                    style="color: rgb(227, 242, 253);"
                                    >{player.rating}</span
                                >
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="font-semibold"
                                    style="color: {getPriceColor(
                                        player.price,
                                        $user.budget,
                                    )}"
                                >
                                    {formatPrice(player.price)}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                {#if isOwned(player.id)}
                                    <span
                                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                        style="background: rgba(102, 187, 106, 0.1); color: rgb(102, 187, 106);"
                                    >
                                        ✓ Fichado
                                    </span>
                                {:else}
                                    <button
                                        on:click={() => buyPlayer(player)}
                                        disabled={buyingPlayerId ===
                                            player.id ||
                                            $user.budget < player.price}
                                        class="btn-primary text-sm px-4 py-1.5"
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
                <p style="color: rgb(120, 144, 156);">
                    No se encontraron jugadores
                </p>
            </div>
        {/if}
    {/if}
</div>
