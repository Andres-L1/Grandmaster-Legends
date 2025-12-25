<script lang="ts">
    import { base } from "$app/paths";
    import { user } from "$lib/stores/user";
    import { collectionIds } from "$lib/stores/players";
</script>

<svelte:head>
    <title>Grandmaster Legends - Chess TCG</title>
</svelte:head>

<div class="space-y-16 py-12">
    <!-- Hero Section -->
    <div class="text-center space-y-8 relative">
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"
        ></div>

        <h1
            class="text-6xl md:text-8xl font-black font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-4"
        >
            Grandmaster<br />
            <span
                class="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                >Legends</span
            >
        </h1>
        <p
            class="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
            Colecciona a los mejores ajedrecistas de la historia. Abre sobres,
            encuentra leyendas y completa tu álbum.
        </p>

        <!-- Stats Preview -->
        <div class="flex justify-center gap-8 py-8">
            <div
                class="text-center p-4 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm min-w-[120px]"
            >
                <div class="text-4xl font-mono font-bold text-amber-400">
                    {$user.coins}
                </div>
                <div
                    class="text-xs uppercase tracking-widest text-slate-500 mt-2"
                >
                    Monedas
                </div>
            </div>
            <div
                class="text-center p-4 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-sm min-w-[120px]"
            >
                <div class="text-4xl font-mono font-bold text-white">
                    {$collectionIds.length}
                </div>
                <div
                    class="text-xs uppercase tracking-widest text-slate-500 mt-2"
                >
                    Cartas
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div
            class="flex flex-col sm:flex-row gap-6 justify-center pt-4 relative z-10"
        >
            <a
                href="{base}/store"
                class="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
                Abrir Sobres
            </a>
            <a
                href="{base}/collection"
                class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl text-lg border border-white/10 transition-all hover:scale-105"
            >
                Ver Colección
            </a>
        </div>
    </div>

    <!-- How It Works -->
    <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-3xl font-serif font-bold text-center text-white mb-12">
            El Camino a la Gloria
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
                class="bg-slate-900/40 p-8 rounded-2xl border border-white/5 text-center group hover:border-amber-500/20 transition-colors"
            >
                <div
                    class="text-5xl mb-6 group-hover:scale-110 transition-transform"
                >
                    🪙
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    1. Consigue Monedas
                </h3>
                <p class="text-slate-400">
                    Gana monedas diarias y vende cartas repetidas para financiar
                    tu búsqueda.
                </p>
            </div>
            <div
                class="bg-slate-900/40 p-8 rounded-2xl border border-white/5 text-center group hover:border-amber-500/20 transition-colors"
            >
                <div
                    class="text-5xl mb-6 group-hover:scale-110 transition-transform"
                >
                    📦
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    2. Abre Sobres
                </h3>
                <p class="text-slate-400">
                    Prueba suerte con sobres de diferente rareza. ¿Encontrarás
                    una carta <span class="text-orange-400 font-bold"
                        >Legendaria</span
                    >?
                </p>
            </div>
            <div
                class="bg-slate-900/40 p-8 rounded-2xl border border-white/5 text-center group hover:border-amber-500/20 transition-colors"
            >
                <div
                    class="text-5xl mb-6 group-hover:scale-110 transition-transform"
                >
                    📖
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    3. Completa el Álbum
                </h3>
                <p class="text-slate-400">
                    500 cartas por coleccionar. Desde Maestros hasta los
                    Campeones del Mundo.
                </p>
            </div>
        </div>
    </div>
</div>
