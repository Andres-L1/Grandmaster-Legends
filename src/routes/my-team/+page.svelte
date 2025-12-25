<script lang="ts">
    import { teamPlayers, currentTeam, captain } from "$lib/stores/teams";
    import {
        ownedPlayers,
        ownedPlayerIds,
        allPlayers,
    } from "$lib/stores/players";
    import { user } from "$lib/stores/user";
    import type { Player } from "$lib/services/lichessApi";
    import { get } from "svelte/store";

    let message: { text: string; type: "success" | "error" } | null = null;

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
                `¿Vender a ${player.name}? Recibirás ${((player.price * 0.8) / 1000000).toFixed(0)}M`,
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
</script>

<svelte:head>
    <title>Mi Equipo - Grandmaster Fantasy</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-bold" style="color: rgb(227, 242, 253);">
            Mi Equipo
        </h1>
        <p class="text-sm mt-2" style="color: rgb(120, 144, 156);">
            Selecciona hasta 5 jugadores para tu lineup activo
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

    <!-- Active Lineup -->
    <div class="card">
        <h2 class="text-xl font-bold mb-4" style="color: rgb(227, 242, 253);">
            Alineación Activa ({$currentTeam.length}/5)
        </h2>

        {#if $teamPlayers.length === 0}
            <div class="text-center py-12">
                <div class="text-5xl mb-4">♔</div>
                <p class="mb-2" style="color: rgb(176, 190, 197);">
                    Sin jugadores en la alineación
                </p>
                <p class="text-sm" style="color: rgb(120, 144, 156);">
                    Añade jugadores desde tu roster
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each $teamPlayers as player (player.id)}
                    <div class="card relative">
                        {#if $captain === player.id}
                            <div
                                class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold"
                                style="background: rgba(255, 160, 0, 0.2); color: rgb(255, 160, 0);"
                            >
                                ★ Capitán
                            </div>
                        {/if}

                        <div class="mb-4">
                            <h3
                                class="font-semibold"
                                style="color: rgb(227, 242, 253);"
                            >
                                {player.name}
                            </h3>
                            <p
                                class="text-sm"
                                style="color: rgb(120, 144, 156);"
                            >
                                Rating: {player.rating}
                            </p>
                        </div>

                        <div class="flex gap-2">
                            <button
                                on:click={() => setCaptainPlayer(player.id)}
                                class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition"
                                style="background: rgba(255, 160, 0, 0.1); border: 1px solid rgba(255, 160, 0, 0.3); color: rgb(255, 160, 0);"
                            >
                                {$captain === player.id
                                    ? "Quitar C"
                                    : "Capitán"}
                            </button>
                            <button
                                on:click={() => removeFromTeam(player.id)}
                                class="flex-1 btn-danger text-sm"
                            >
                                Quitar
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Roster -->
    <div class="card">
        <h2 class="text-xl font-bold mb-4" style="color: rgb(227, 242, 253);">
            Roster ({$ownedPlayers.length}/15)
        </h2>

        {#if rosterPlayers.length === 0 && $teamPlayers.length === 0}
            <div class="text-center py-12">
                <div class="text-5xl mb-4">💰</div>
                <p class="mb-4" style="color: rgb(176, 190, 197);">
                    No has fichado jugadores
                </p>
                <a
                    href="/Grandmaster-Fantasy/market"
                    class="btn-primary inline-block"
                >
                    Ir al Mercado
                </a>
            </div>
        {:else if rosterPlayers.length === 0}
            <div class="text-center py-8">
                <p style="color: rgb(120, 144, 156);">
                    Todos tus jugadores están en la alineación
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each rosterPlayers as player (player.id)}
                    <div class="card">
                        <div class="mb-4">
                            <h3
                                class="font-semibold"
                                style="color: rgb(227, 242, 253);"
                            >
                                {player.name}
                            </h3>
                            <p
                                class="text-sm"
                                style="color: rgb(120, 144, 156);"
                            >
                                Valor: {(player.price / 1000000).toFixed(0)}M
                            </p>
                        </div>

                        <div class="flex gap-2">
                            <button
                                on:click={() => addToTeam(player.id)}
                                disabled={$currentTeam.length >= 5}
                                class="flex-1 btn-primary text-sm"
                            >
                                {$currentTeam.length >= 5
                                    ? "Equipo lleno"
                                    : "Añadir"}
                            </button>
                            <button
                                on:click={() => sellPlayer(player)}
                                class="flex-1 btn-danger text-sm"
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
