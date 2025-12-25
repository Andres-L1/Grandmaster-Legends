<script lang="ts">
    import { base } from "$app/paths";
    import { user } from "$lib/stores/user";
    import { ownedPlayers } from "$lib/stores/players";
    import { currentTeam } from "$lib/stores/teams";

    function formatBudget(budget: number): string {
        return `${(budget / 1000000).toFixed(1)}M`;
    }
</script>

<svelte:head>
    <title>Grandmaster Fantasy - Fantasy Chess</title>
</svelte:head>

<div class="space-y-8 pb-4">
    <!-- Hero Section -->
    <div class="text-center space-y-4">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Bienvenido, <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                >{$user.username}</span
            >
        </h1>
        <p class="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            El primer Fantasy Sports exclusivo para Ajedrez. Ficha a los mejores
            Grandes Maestros del mundo y compite en torneos reales.
        </p>

        <!-- User Stats -->
        <div class="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mt-8">
            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            >
                <div class="text-2xl sm:text-3xl font-bold text-yellow-400">
                    {formatBudget($user.budget)}
                </div>
                <div class="text-xs sm:text-sm text-gray-400 mt-1">
                    Presupuesto
                </div>
            </div>
            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            >
                <div class="text-2xl sm:text-3xl font-bold text-purple-400">
                    {$user.totalPoints}
                </div>
                <div class="text-xs sm:text-sm text-gray-400 mt-1">Puntos</div>
            </div>
            <div
                class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
            >
                <div class="text-2xl sm:text-3xl font-bold text-pink-400">
                    {$currentTeam.length}/5
                </div>
                <div class="text-xs sm:text-sm text-gray-400 mt-1">Equipo</div>
            </div>
        </div>

        <!-- CTA Buttons -->
        <div
            class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 px-4"
        >
            <a
                href="{base}/market"
                class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition transform hover:scale-105 active:scale-95"
            >
                💰 Explorar Mercado
            </a>
            <a
                href="{base}/my-team"
                class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition border border-white/20"
            >
                👥 Ver Mi Equipo
            </a>
        </div>
    </div>

    <!-- Features Grid -->
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16"
    >
        <div
            class="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition"
        >
            <div class="text-3xl sm:text-4xl mb-3 sm:mb-4">💰</div>
            <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">
                Presupuesto Virtual
            </h3>
            <p class="text-sm sm:text-base text-gray-400">
                Empieza con 100M y gestiona tu presupuesto estratégicamente para
                fichar a los mejores GMs.
            </p>
        </div>

        <div
            class="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition"
        >
            <div class="text-3xl sm:text-4xl mb-3 sm:mb-4">🏆</div>
            <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">
                Torneos Reales
            </h3>
            <p class="text-sm sm:text-base text-gray-400">
                Tus jugadores compiten en torneos reales de ajedrez. Gana puntos
                según sus resultados.
            </p>
        </div>

        <div
            class="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition sm:col-span-2 lg:col-span-1"
        >
            <div class="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
            <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">
                Ligas Globales
            </h3>
            <p class="text-sm sm:text-base text-gray-400">
                Compite en la liga global o crea ligas privadas con tus amigos.
            </p>
        </div>
    </div>

    <!-- Scoring System -->
    <div
        class="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10"
    >
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
            Sistema de Puntuación
        </h2>
        <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        >
            <div class="text-center bg-white/5 rounded-lg p-3 sm:p-4">
                <div class="text-2xl sm:text-3xl font-bold text-green-400">
                    +10
                </div>
                <div class="text-xs sm:text-sm text-gray-300 mt-1">
                    Victoria
                </div>
            </div>
            <div class="text-center bg-white/5 rounded-lg p-3 sm:p-4">
                <div class="text-2xl sm:text-3xl font-bold text-yellow-400">
                    +3
                </div>
                <div class="text-xs sm:text-sm text-gray-300 mt-1">Tablas</div>
            </div>
            <div class="text-center bg-white/5 rounded-lg p-3 sm:p-4">
                <div class="text-2xl sm:text-3xl font-bold text-red-400">
                    -2
                </div>
                <div class="text-xs sm:text-sm text-gray-300 mt-1">Derrota</div>
            </div>
            <div class="text-center bg-white/5 rounded-lg p-3 sm:p-4">
                <div class="text-2xl sm:text-3xl font-bold text-purple-400">
                    +2
                </div>
                <div class="text-xs sm:text-sm text-gray-300 mt-1">
                    Bonus Negras
                </div>
            </div>
            <div
                class="text-center bg-white/5 rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1"
            >
                <div class="text-2xl sm:text-3xl font-bold text-pink-400">
                    +5
                </div>
                <div class="text-xs sm:text-sm text-gray-300 mt-1">
                    Racha (3+ wins)
                </div>
            </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-400 mt-4 text-center">
            ⭐ El capitán gana puntos dobles
        </p>
    </div>
</div>
