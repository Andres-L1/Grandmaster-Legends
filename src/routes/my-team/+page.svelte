<script lang="ts">
    import { ownedPlayers, ownedPlayerIds } from "$lib/stores/players";
    import { currentTeam, captain } from "$lib/stores/teams";
    import { user } from "$lib/stores/user";
    import { AVAILABLE_PLAYERS } from "$lib/stores/localStorage";
    import type { Player } from "$lib/stores/localStorage";

    let message: { text: string; type: "success" | "error" } | null = null;

    $: teamPlayers = AVAILABLE_PLAYERS.filter((p) =>
        $currentTeam.includes(p.id),
    );
    $: rosterPlayers = $ownedPlayers.filter(
        (p) => !$currentTeam.includes(p.id),
    );

    function addToTeam(playerId: string) {
        const result = currentTeam.addToTeam(playerId);
        showMessage(result.message, result.success ? "success" : "error");
    }

    function removeFromTeam(playerId: string) {
        currentTeam.removeFromTeam(playerId);
        showMessage("Jugador eliminado del equipo", "success");
    }

    function sellPlayer(player: Player) {
        if (
            confirm(
                `¿Vender a ${player.name}? Recibirás ${formatPrice(player.price * 0.8)}`,
            )
        ) {
            const result = ownedPlayerIds.sellPlayer(player.id);
            showMessage(result.message, result.success ? "success" : "error");
        }
    }

    function setCaptainPlayer(playerId: string) {
        const result = captain.setCaptain(
            $captain === playerId ? null : playerId,
        );
        showMessage(result.message, result.success ? "success" : "error");
    }

    function showMessage(text: string, type: "success" | "error") {
        message = { text, type };
        setTimeout(() => (message = null), 3000);
    }

    function formatPrice(price: number): string {
        return `${(price / 1000000).toFixed(1)}M`;
    }
</script>

<svelte:head>
    <title>Mi Equipo - Grandmaster Fantasy</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white">Mi Equipo</h1>
            <p class="text-gray-400 mt-2">
                Puntos totales: <span class="text-purple-400 font-semibold"
                    >{$user.totalPoints}</span
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

    <!-- Current Team -->
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
    >
        <h2 class="text-2xl font-bold text-white mb-4">
            Equipo Titular ({$currentTeam.length}/5)
        </h2>

        {#if teamPlayers.length === 0}
            <div class="text-center py-12">
                <div class="text-6xl mb-4">👥</div>
                <p class="text-gray-400 mb-4">Tu equipo está vacío</p>
                <p class="text-gray-500 text-sm">
                    Añade jugadores desde tu roster para comenzar
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each teamPlayers as player (player.id)}
                    <div
                        class="bg-white/5 border border-white/10 rounded-lg p-4 relative"
                    >
                        {#if $captain === player.id}
                            <div class="absolute top-2 right-2">
                                <span
                                    class="inline-flex items-center bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-semibold"
                                >
                                    ⭐ Capitán
                                </span>
                            </div>
                        {/if}

                        <div class="flex items-center gap-3 mb-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl"
                            >
                                ♔
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3 class="font-semibold text-white truncate">
                                    {player.name}
                                </h3>
                                <p class="text-gray-400 text-sm">
                                    Rating: {player.rating}
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button
                                on:click={() => setCaptainPlayer(player.id)}
                                class="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-500/30 px-3 py-2 rounded-lg text-sm transition"
                            >
                                {$captain === player.id
                                    ? "Quitar C"
                                    : "Capitán"}
                            </button>
                            <button
                                on:click={() => removeFromTeam(player.id)}
                                class="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg text-sm transition"
                            >
                                Quitar
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Roster (Bench) -->
    <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
    >
        <h2 class="text-2xl font-bold text-white mb-4">
            Mi Roster ({$ownedPlayers.length}/15)
        </h2>

        {#if rosterPlayers.length === 0 && teamPlayers.length === 0}
            <div class="text-center py-12">
                <div class="text-6xl mb-4">💰</div>
                <p class="text-gray-400 mb-4">
                    No has fichado jugadores todavía
                </p>
                <a
                    href="/Grandmaster-Fantasy/market"
                    class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    Ir al Mercado
                </a>
            </div>
        {:else if rosterPlayers.length === 0}
            <div class="text-center py-8">
                <p class="text-gray-400">
                    Todos tus jugadores están en el equipo titular
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each rosterPlayers as player (player.id)}
                    <div
                        class="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                        <div class="flex items-center gap-3 mb-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl"
                            >
                                ♔
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3 class="font-semibold text-white truncate">
                                    {player.name}
                                </h3>
                                <p class="text-gray-400 text-sm">
                                    Valor: {formatPrice(player.price)}
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button
                                on:click={() => addToTeam(player.id)}
                                disabled={$currentTeam.length >= 5}
                                class="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm transition"
                            >
                                {$currentTeam.length >= 5
                                    ? "Equipo lleno"
                                    : "Añadir"}
                            </button>
                            <button
                                on:click={() => sellPlayer(player)}
                                class="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg text-sm transition"
                            >
                                Vender
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
