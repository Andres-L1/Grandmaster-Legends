<script lang="ts">
    import { user } from "$lib/stores/user";
    import { collectionIds } from "$lib/stores/players";
    import {
        PACKS,
        packService,
        type PackType,
        type PackConfig,
    } from "$lib/services/packService";
    import { lichessApi, type Player } from "$lib/services/lichessApi";
    import { toast } from "$lib/stores/toast";
    import Card from "$lib/components/Card.svelte";
    import confetti from "canvas-confetti";
    import { onMount } from "svelte";

    // State
    let allPlayers: Player[] = [];
    let isOpening = false;
    let openedCards: { card: Player; isNew: boolean }[] = [];
    let showResultModal = false;

    onMount(async () => {
        // Load players for the pack pool
        try {
            allPlayers = await lichessApi.getTopPlayers(500);
        } catch (e) {
            console.error("Failed to load pool", e);
        }
    });

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
            toast.success(`¡Compraste un ${pack.name}!`);

            // Artificial delay for "opening" feel
            setTimeout(() => {
                const cards = packService.openPack(packType, allPlayers);
                processOpenedCards(cards);
            }, 1000); // 1s delay
        }
    }

    function processOpenedCards(cards: Player[]) {
        openedCards = cards.map((card) => {
            const { isNew } = collectionIds.addCard(card.id);
            return { card, isNew };
        });

        // Check for legendary to trigger confetti
        const hasLegendary = cards.some((c) => c.rating >= 2750);
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
        {/each}
    </div>
</div>

<!-- Results Modal (Simplified inline for now) -->
{#if showResultModal}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
    >
        <div
            class="w-full max-w-5xl space-y-8 animate-in fade-in zoom-in duration-300"
        >
            <h2 class="text-3xl font-bold text-white text-center">
                ¡Contenido del Sobre!
            </h2>

            <div
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center"
            >
                {#each openedCards as { card, isNew }}
                    <div
                        class="animate-in slide-in-from-bottom-10 fade-in duration-500"
                        style="animation-delay: {Math.random() * 200}ms"
                    >
                        <Card player={card} {isNew} />
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
        </div>
    </div>
{/if}
