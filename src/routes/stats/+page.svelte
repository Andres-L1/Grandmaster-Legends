<script lang="ts">
    import { user } from "$lib/stores/user";
    import { ownedPlayers } from "$lib/stores/players";
    import { teamPlayers } from "$lib/stores/teams";

    $: totalValue = $ownedPlayers.reduce((sum, p) => sum + p.price, 0);
    $: teamValue = $teamPlayers.reduce((sum, p) => sum + p.price, 0);
</script>

<svelte:head>
    <title>Mis Estadísticas - Grandmaster Fantasy</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-3xl font-bold" style="color: rgb(227, 242, 253);">
            Mis Estadísticas
        </h1>
        <p class="text-sm mt-2" style="color: rgb(120, 144, 156);">
            Tu rendimiento personal en Grandmaster Fantasy
        </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Budget -->
        <div class="card">
            <div class="text-sm mb-1" style="color: rgb(120, 144, 156);">
                Presupuesto Actual
            </div>
            <div class="text-2xl font-bold" style="color: rgb(255, 160, 0);">
                {($user.budget / 1000000).toFixed(0)}M
            </div>
        </div>

        <!-- Total Points -->
        <div class="card">
            <div class="text-sm mb-1" style="color: rgb(120, 144, 156);">
                Puntos Totales
            </div>
            <div class="text-2xl font-bold" style="color: rgb(102, 187, 106);">
                {$user.totalPoints}
            </div>
        </div>

        <!-- Roster Value -->
        <div class="card">
            <div class="text-sm mb-1" style="color: rgb(120, 144, 156);">
                Valor del Roster
            </div>
            <div class="text-2xl font-bold" style="color: rgb(21, 101, 192);">
                {(totalValue / 1000000).toFixed(0)}M
            </div>
        </div>

        <!-- Team Value -->
        <div class="card">
            <div class="text-sm mb-1" style="color: rgb(120, 144, 156);">
                Valor del Equipo
            </div>
            <div class="text-2xl font-bold" style="color: rgb(46, 125, 50);">
                {(teamValue / 1000000).toFixed(0)}M
            </div>
        </div>
    </div>

    <!-- User Profile -->
    <div class="card">
        <h2 class="text-xl font-bold mb-4" style="color: rgb(227, 242, 253);">
            Perfil
        </h2>
        <div class="space-y-3">
            <div class="flex justify-between">
                <span style="color: rgb(120, 144, 156);">Usuario:</span>
                <span style="color: rgb(227, 242, 253);" class="font-medium"
                    >{$user.username}</span
                >
            </div>
            <div class="flex justify-between">
                <span style="color: rgb(120, 144, 156);"
                    >Jugadores Fichados:</span
                >
                <span style="color: rgb(227, 242, 253);" class="font-medium"
                    >{$ownedPlayers.length}/15</span
                >
            </div>
            <div class="flex justify-between">
                <span style="color: rgb(120, 144, 156);">En Alineación:</span>
                <span style="color: rgb(227, 242, 253);" class="font-medium"
                    >{$teamPlayers.length}/5</span
                >
            </div>
        </div>
    </div>

    <!-- Top Players in Portfolio -->
    {#if $ownedPlayers.length > 0}
        <div class="card">
            <h2
                class="text-xl font-bold mb-4"
                style="color: rgb(227, 242, 253);"
            >
                Tus Mejores Jugadores
            </h2>
            <div class="space-y-2">
                {#each $ownedPlayers
                    .slice(0, 5)
                    .sort((a, b) => b.rating - a.rating) as player}
                    <div
                        class="flex justify-between items-center p-3 rounded-lg"
                        style="background: rgba(33, 45, 63, 0.5);"
                    >
                        <div>
                            <div
                                class="font-medium"
                                style="color: rgb(227, 242, 253);"
                            >
                                {player.name}
                            </div>
                            <div
                                class="text-sm"
                                style="color: rgb(120, 144, 156);"
                            >
                                Rating: {player.rating}
                            </div>
                        </div>
                        <div
                            class="font-semibold"
                            style="color: rgb(255, 160, 0);"
                        >
                            {(player.price / 1000000).toFixed(0)}M
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- How Points Work -->
    <div class="card">
        <h2 class="text-xl font-bold mb-4" style="color: rgb(227, 242, 253);">
            Sistema de Puntuación
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
                class="text-center p-3 rounded-lg"
                style="background: rgba(102, 187, 106, 0.1);"
            >
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(102, 187, 106);"
                >
                    +10
                </div>
                <div class="text-xs mt-1" style="color: rgb(176, 190, 197);">
                    Victoria
                </div>
            </div>
            <div
                class="text-center p-3 rounded-lg"
                style="background: rgba(255, 183, 77, 0.1);"
            >
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(255, 183, 77);"
                >
                    +3
                </div>
                <div class="text-xs mt-1" style="color: rgb(176, 190, 197);">
                    Tablas
                </div>
            </div>
            <div
                class="text-center p-3 rounded-lg"
                style="background: rgba(239, 83, 80, 0.1);"
            >
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(239, 83, 80);"
                >
                    -2
                </div>
                <div class="text-xs mt-1" style="color: rgb(176, 190, 197);">
                    Derrota
                </div>
            </div>
            <div
                class="text-center p-3 rounded-lg"
                style="background: rgba(21, 101, 192, 0.1);"
            >
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(21, 101, 192);"
                >
                    +2
                </div>
                <div class="text-xs mt-1" style="color: rgb(176, 190, 197);">
                    Bonus Negras
                </div>
            </div>
            <div
                class="text-center p-3 rounded-lg"
                style="background: rgba(255, 160, 0, 0.1);"
            >
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(255, 160, 0);"
                >
                    +5
                </div>
                <div class="text-xs mt-1" style="color: rgb(176, 190, 197);">
                    Racha 3+ wins
                </div>
            </div>
            <div
                class="text-center p-3 rounded-lg"
                style="background: rgba(255, 160, 0, 0.1);"
            >
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(255, 160, 0);"
                >
                    ×2
                </div>
                <div class="text-xs mt-1" style="color: rgb(176, 190, 197);">
                    Capitán
                </div>
            </div>
        </div>
        <p class="text-xs mt-4 text-center" style="color: rgb(120, 144, 156);">
            El capitán (★) multiplica sus puntos por 2
        </p>
    </div>
</div>
