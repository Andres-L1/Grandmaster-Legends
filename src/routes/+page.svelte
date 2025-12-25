<script lang="ts">
    import { base } from "$app/paths";
    import { user } from "$lib/stores/user";
    import { ownedPlayers } from "$lib/stores/players";
    import { teamPlayers } from "$lib/stores/teams";
</script>

<svelte:head>
    <title>Grandmaster Fantasy - Fantasy Chess</title>
</svelte:head>

<div class="space-y-12">
    <!-- Hero Section -->
    <div class="text-center space-y-4 py-12">
        <h1
            class="text-4xl sm:text-5xl font-bold"
            style="color: rgb(227, 242, 253);"
        >
            Grandmaster Fantasy
        </h1>
        <p
            class="text-lg sm:text-xl max-w-2xl mx-auto"
            style="color: rgb(176, 190, 197);"
        >
            Crea tu equipo con los mejores ajedrecistas del mundo. Datos reales
            de Lichess.
        </p>

        <!-- Stats Preview -->
        <div class="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8">
            <div class="card text-center">
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(255, 160, 0);"
                >
                    {($user.budget / 1000000).toFixed(0)}M
                </div>
                <div class="text-xs mt-1" style="color: rgb(120, 144, 156);">
                    Presupuesto
                </div>
            </div>
            <div class="card text-center">
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(46, 125, 50);"
                >
                    {$ownedPlayers.length}
                </div>
                <div class="text-xs mt-1" style="color: rgb(120, 144, 156);">
                    Jugadores
                </div>
            </div>
            <div class="card text-center">
                <div
                    class="text-2xl font-bold"
                    style="color: rgb(21, 101, 192);"
                >
                    {$teamPlayers.length}/5
                </div>
                <div class="text-xs mt-1" style="color: rgb(120, 144, 156);">
                    En Equipo
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a href="{base}/market" class="btn-primary px-6 py-3">
                Ver Mercado
            </a>
            <a href="{base}/my-team" class="btn-secondary px-6 py-3">
                Mi Equipo
            </a>
        </div>
    </div>

    <!-- How It Works -->
    <div class="max-w-3xl mx-auto">
        <h2
            class="text-2xl font-bold text-center mb-8"
            style="color: rgb(227, 242, 253);"
        >
            ¿Cómo Funciona?
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="text-center">
                <div class="text-4xl mb-3">💰</div>
                <h3
                    class="font-semibold mb-2"
                    style="color: rgb(227, 242, 253);"
                >
                    1. Ficha Jugadores
                </h3>
                <p class="text-sm" style="color: rgb(120, 144, 156);">
                    Con 100M de presupuesto inicial, ficha a los mejores GMs del
                    mundo
                </p>
            </div>
            <div class="text-center">
                <div class="text-4xl mb-3">♔</div>
                <h3
                    class="font-semibold mb-2"
                    style="color: rgb(227, 242, 253);"
                >
                    2. Crea tu Equipo
                </h3>
                <p class="text-sm" style="color: rgb(120, 144, 156);">
                    Selecciona 5 jugadores para tu alineación y elige un capitán
                </p>
            </div>
            <div class="text-center">
                <div class="text-4xl mb-3">🏆</div>
                <h3
                    class="font-semibold mb-2"
                    style="color: rgb(227, 242, 253);"
                >
                    3. Gana Puntos
                </h3>
                <p class="text-sm" style="color: rgb(120, 144, 156);">
                    Tus jugadores puntúan según sus partidas reales de ajedrez
                </p>
            </div>
        </div>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div class="card">
            <h3
                class="text-lg font-semibold mb-2"
                style="color: rgb(227, 242, 253);"
            >
                Datos Reales de Lichess
            </h3>
            <p class="text-sm" style="color: rgb(120, 144, 156);">
                Jugadores del top 50 de ajedrez clásico con ratings actualizados
            </p>
        </div>
        <div class="card">
            <h3
                class="text-lg font-semibold mb-2"
                style="color: rgb(227, 242, 253);"
            >
                Sistema de Puntuación
            </h3>
            <p class="text-sm" style="color: rgb(120, 144, 156);">
                Victoria +10, Tablas +3, Derrota -2. El capitán gana puntos
                dobles
            </p>
        </div>
    </div>
</div>
