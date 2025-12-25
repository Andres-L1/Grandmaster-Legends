<script lang="ts">
    import { user } from "$lib/stores/user";
    import { collectionIds, allPlayers } from "$lib/stores/players";
    import {
        PACKS,
        packService,
        type PackType,
    } from "$lib/services/packService";
    import type { Player } from "$lib/data/players";
    import { toast } from "$lib/stores/toast";
    import Card from "$lib/components/Card.svelte";
    import confetti from "canvas-confetti";
    import { onMount } from "svelte";

    // State
    let isOpening = false;
    let openedCards: { card: Player; isNew: boolean }[] = [];
    let showResultModal = false;
    let isStarter = false;

    onMount(() => {
        // Auto-open starter pack if collection is empty
        if ($collectionIds.length === 0) {
            triggerStarterPack();
        }
    });

    function triggerStarterPack() {
        isStarter = true;
        isOpening = true;
        // Small delay to let store load
        setTimeout(() => {
            const cards = packService.openPack("STARTER", $allPlayers);
            processOpenedCards(cards);
            toast.info("¡Bienvenido! Has recibido un Sobre Inicial.");
        }, 500);
    }

    function buyPack(packType: PackType) {
        if (isOpening) return;

        const pack = PACKS[packType];

        if ($user.coins < pack.price) {
            toast.error("No tienes suficientes monedas.");
            return;
        }

        // Transaction
        if (user.spendCoins(pack.price)) {
            isOpening = true;
            isStarter = false;
            toast.success(`¡Compraste un ${pack.name}!`);

            // Artificial delay for "opening" feel
            setTimeout(() => {
                const cards = packService.openPack(packType, $allPlayers);
                processOpenedCards(cards);
            }, 1000); // 1s delay
        }
    }

    function processOpenedCards(cards: Player[]) {
        openedCards = cards.map((card) => {
            const { isNew } = collectionIds.addCard(card.id);
            return { card, isNew };
        });

        // Check for legendary to trigger confetti (New threshold: 2660+)
        const hasLegendary = cards.some((c) => c.rating >= 2660);
        if (hasLegendary) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#FFD700", "#FFA500", "#FFFFFF"], // Gold colors
            });
        }

        isOpening = false;
        showResultModal = true;
    }

    function closeResult() {
        showResultModal = false;
        openedCards = [];
    }
</script>

<svelte:head>
    <title>Tienda - Grandmaster Legends</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-12">
    <!-- Header -->
    <div class="text-center space-y-4">
        <h1
            class="text-5xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm"
        >
            Tienda de Sobres
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
            Usa tus monedas para adquirir nuevos sobres y completar tu colección
            de leyendas.
        </p>
    </div>

    <!-- Packs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each Object.values(PACKS) as pack}
            {#if pack.id !== "STARTER"}
                <button
                    class="group relative flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/30"
                    onclick={() => buyPack(pack.id)}
                    disabled={isOpening}
                >
                    <!-- Pack Icon -->
                    <div
                        class="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-xl"
                    >
                        {pack.image}
                    </div>

                    <!-- Info -->
                    <h3 class="text-2xl font-bold font-serif text-white mb-2">
                        {pack.name}
                    </h3>
                    <p class="text-sm text-slate-400 text-center mb-6 h-12">
                        {pack.description}
                    </p>

                    <!-- Price -->
                    <div
                        class="mt-auto flex items-center gap-2 bg-slate-950/50 px-6 py-3 rounded-xl border border-white/5 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-colors"
                    >
                        <span class="text-2xl">🪙</span>
                        <span
                            class="text-xl font-bold font-mono text-white group-hover:text-amber-300"
                        >
                            {pack.price}
                        </span>
                    </div>

                    <!-- Hover Glow -->
                    <div
                        class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none"
                    ></div>
                </button>
            {/if}
        {/each}
    </div>
</div>

<!-- Results Modal -->
{#if showResultModal}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
    >
        <div
            class="w-full max-w-5xl space-y-8 animate-in fade-in zoom-in duration-300"
        >
            <h2 class="text-3xl font-bold text-white text-center">
                {isStarter ? "¡Tu Primer Sobre!" : "¡Contenido del Sobre!"}
            </h2>

            <div
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center"
            >
                {#each openedCards as { card, isNew }, i}
                    <div
                        class="animate-in slide-in-from-bottom-10 fade-in duration-500"
                        style="animation-delay: {Math.random() * 200}ms"
                    >
                        <Card player={card} {isNew} onClick={() => {}} />
                        {#if isStarter && !isNew}
                            <div
                                class="text-center mt-2 animate-pulse text-amber-400 font-bold text-sm bg-black/50 rounded px-2"
                            >
                                ¡DUPLICADO! (+20 Monedas)
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="flex justify-center pt-8">
                <button
                    class="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-full text-lg shadow-xl shadow-amber-500/20 transition-transform hover:scale-105"
                    onclick={closeResult}
                >
                    Continuar y Guardar
                </button>
            </div>

            {#if isStarter}
                <p
                    class="text-center text-slate-400 text-sm max-w-lg mx-auto bg-slate-900/80 p-4 rounded-lg border border-white/5"
                >
                    <strong>Tutorial:</strong> Has recibido 3 cartas, pero una está
                    repetida. Las cartas repetidas se convierten automáticamente
                    en monedas (o pueden venderse) para que puedas comprar más sobres.
                    ¡Esa es la clave para crecer!
                </p>
            {/if}
        </div>
    </div>
{/if}
