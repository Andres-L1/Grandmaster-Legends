<script lang="ts">
    import { fade, scale, fly } from "svelte/transition";
    import { quintOut, backOut, elasticOut } from "svelte/easing";
    import type { Player } from "$lib/data/players";
    import Card from "./Card.svelte";
    import confetti from "canvas-confetti";

    interface Props {
        cards: { card: Player; isNew: boolean }[];
        packType: string;
        onComplete: () => void;
        isStarter?: boolean;
        onSellDuplicate?: (card: Player) => void;
        duplicateSold?: boolean;
    }

    let {
        cards,
        packType,
        onComplete,
        isStarter = false,
        onSellDuplicate,
        duplicateSold = false,
    } = $props();

    // Animation states
    let phase = $state<"shake" | "burst" | "revealing" | "complete">("shake");
    let currentCardIndex = $state(0);
    let showPackAnimation = $state(true);
    let revealedCards = $state<typeof cards>([]);
    let packShaking = $state(false);

    // Pack icons
    const packIcons: Record<string, string> = {
        STARTER: "🎁",
        PAWN: "♟️",
        KNIGHT: "♞",
        KING: "♚",
    };

    const packNames: Record<string, string> = {
        STARTER: "Sobre Inicial",
        PAWN: "Sobre Peón",
        KNIGHT: "Sobre Caballo",
        KING: "Sobre Rey",
    };

    function getRarityColor(rating: number): string {
        if (rating >= 2700) return "#fbbf24";
        if (rating >= 2660) return "#fb923c";
        if (rating >= 2655) return "#a855f7";
        if (rating >= 2650) return "#3b82f6";
        return "#94a3b8";
    }

    function triggerRarityEffects(rating: number) {
        const color = getRarityColor(rating);

        if (rating >= 2655) {
            confetti({
                particleCount:
                    rating >= 2700 ? 300 : rating >= 2660 ? 200 : 120,
                spread: 120,
                origin: { y: 0.5 },
                colors: [color, "#ffffff", "#ffd700"],
                ticks: 400,
                gravity: 0.8,
                scalar: 1.2,
            });
        }

        // Screen flash for GOAT
        if (rating >= 2700) {
            const flash = document.createElement("div");
            flash.className =
                "fixed inset-0 bg-yellow-400 pointer-events-none z-[250]";
            flash.style.opacity = "0.4";
            document.body.appendChild(flash);

            // Pulse effect
            setTimeout(() => {
                flash.style.transition = "opacity 0.3s";
                flash.style.opacity = "0.6";
                setTimeout(() => {
                    flash.style.opacity = "0";
                    setTimeout(() => flash.remove(), 300);
                }, 100);
            }, 50);

            // Extra confetti burst
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 360,
                    origin: { y: 0.6 },
                    colors: ["#fbbf24", "#ffffff"],
                    shapes: ["star"],
                    ticks: 300,
                });
            }, 300);
        }
    }

    // Animation sequence
    $effect(() => {
        if (phase === "shake") {
            // Shake the pack
            packShaking = true;
            setTimeout(() => {
                packShaking = false;
                phase = "burst";
            }, 1500);
        } else if (phase === "burst") {
            // Pack bursts open
            setTimeout(() => {
                showPackAnimation = false;
                // Explosion effect
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#f59e0b", "#fbbf24", "#ffffff"],
                });

                setTimeout(() => {
                    phase = "revealing";
                }, 400);
            }, 800);
        }
    });

    function revealNextCard() {
        if (currentCardIndex < cards.length) {
            const card = cards[currentCardIndex];
            revealedCards = [...revealedCards, card];

            // Trigger effects after flip animation
            setTimeout(() => {
                triggerRarityEffects(card.card.rating);
            }, 700);

            currentCardIndex++;

            if (currentCardIndex >= cards.length) {
                setTimeout(() => {
                    phase = "complete";
                }, 1200);
            }
        }
    }

    // Auto-reveal first card
    $effect(() => {
        if (phase === "revealing" && currentCardIndex === 0) {
            setTimeout(revealNextCard, 400);
        }
    });
</script>

<!-- Full screen overlay -->
<div
    class="fixed inset-0 z-[150] bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden"
    transition:fade={{ duration: 300 }}
>
    <!-- Animated background particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        {#each Array(20) as _, i}
            <div
                class="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float-slow"
                style="
                    left: {Math.random() * 100}%;
                    top: {Math.random() * 100}%;
                    animation-delay: {i * 0.2}s;
                    animation-duration: {4 + Math.random() * 3}s;
                "
            ></div>
        {/each}
    </div>

    <!-- Pack Opening Animation -->
    {#if (phase === "shake" || phase === "burst") && showPackAnimation}
        <div
            class="flex flex-col items-center gap-8 relative z-10"
            in:scale={{ duration: 600, easing: backOut }}
        >
            <!-- Pack icon with shake/burst -->
            <div
                class="relative"
                class:animate-shake={packShaking}
                class:animate-burst={phase === "burst"}
            >
                <div class="text-[12rem] drop-shadow-2xl filter">
                    {packIcons[packType] || "📦"}
                </div>

                <!-- Glow effect -->
                <div
                    class="absolute inset-0 blur-3xl bg-amber-500/30 animate-pulse"
                ></div>
            </div>

            <!-- Pack name -->
            <div
                class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 animate-pulse"
            >
                {packNames[packType]}
            </div>

            <!-- Status text -->
            <div class="text-xl text-slate-400 font-bold">
                {phase === "shake" ? "Preparando..." : "¡Abriendo!"}
            </div>

            <!-- Energy rings -->
            <div
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                {#each Array(3) as _, i}
                    <div
                        class="absolute w-64 h-64 border-4 border-amber-500/30 rounded-full animate-ping"
                        style="animation-delay: {i *
                            0.3}s; animation-duration: 2s;"
                    ></div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Revealing Phase -->
    {#if phase === "revealing" || phase === "complete"}
        <div class="w-full max-w-7xl px-4 space-y-8 relative z-10">
            <!-- Header -->
            <div
                class="text-center space-y-3"
                in:fly={{ y: -50, duration: 600, easing: elasticOut }}
            >
                <h2
                    class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-lg"
                >
                    {isStarter ? "¡Tu Primer Sobre!" : "¡Cartas Obtenidas!"}
                </h2>
                <div class="flex items-center justify-center gap-3">
                    {#if phase === "revealing"}
                        <div
                            class="text-2xl text-slate-300 font-bold animate-pulse"
                        >
                            Revelando {currentCardIndex} de {cards.length}
                        </div>
                    {:else}
                        <div
                            class="text-2xl text-green-400 font-bold flex items-center gap-2"
                        >
                            <span class="text-3xl">✨</span>
                            ¡Todas reveladas!
                            <span class="text-3xl">✨</span>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Cards Grid -->
            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center max-w-5xl mx-auto"
            >
                {#each revealedCards as { card, isNew }, i (card.id + i)}
                    <div
                        class="relative max-w-xs w-full"
                        in:scale={{
                            duration: 600,
                            delay: 100,
                            easing: backOut,
                        }}
                    >
                        <!-- Radial glow based on rarity -->
                        <div
                            class="absolute inset-0 blur-3xl opacity-60 rounded-xl animate-pulse"
                            style="background: radial-gradient(circle, {getRarityColor(
                                card.rating,
                            )}, transparent 70%);"
                        ></div>

                        <!-- Card with flip -->
                        <div
                            class="relative transform hover:scale-105 transition-transform duration-300"
                        >
                            <Card
                                player={card}
                                {isNew}
                                flipOnReveal={true}
                                onClick={() => {}}
                            />
                        </div>

                        <!-- Starter duplicate overlay -->
                        {#if isStarter && !isNew && onSellDuplicate}
                            {#if !duplicateSold}
                                <div
                                    class="absolute inset-0 bg-black/85 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm z-30 border-2 border-amber-500"
                                    in:fade={{ delay: 800 }}
                                >
                                    <div class="text-6xl mb-3 animate-bounce">
                                        💰
                                    </div>
                                    <span
                                        class="text-amber-400 font-black mb-4 text-xl drop-shadow-md"
                                    >
                                        ¡REPETIDA!
                                    </span>
                                    <button
                                        class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-base px-6 py-4 rounded-full shadow-2xl shadow-green-500/40 transition-all hover:scale-110 active:scale-95"
                                        onclick={() => onSellDuplicate?.(card)}
                                    >
                                        VENDER (+100 🪙)
                                    </button>
                                </div>
                            {:else}
                                <div
                                    class="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl z-30"
                                >
                                    <div class="text-center">
                                        <div class="text-5xl mb-2">✅</div>
                                        <span
                                            class="text-green-400 font-bold text-xl"
                                            >VENDIDA</span
                                        >
                                    </div>
                                </div>
                            {/if}
                        {/if}
                    </div>
                {/each}
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col items-center gap-4 pt-8">
                {#if phase === "revealing" && currentCardIndex < cards.length}
                    <button
                        class="group relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 font-black px-16 py-6 rounded-full text-2xl shadow-2xl shadow-amber-500/50 transition-all hover:scale-110 active:scale-95"
                        onclick={revealNextCard}
                        in:scale={{
                            delay: 800,
                            duration: 400,
                            easing: elasticOut,
                        }}
                    >
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                        ></div>
                        <span class="relative flex items-center gap-3">
                            <span class="text-3xl">✨</span>
                            Revelar Siguiente
                            <span class="text-3xl">✨</span>
                        </span>
                    </button>
                {:else if phase === "complete"}
                    <button
                        class="group relative bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-400 hover:via-green-400 hover:to-emerald-400 text-white font-black px-16 py-6 rounded-full text-2xl shadow-2xl shadow-emerald-500/50 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale disabled:hover:scale-100"
                        onclick={onComplete}
                        disabled={isStarter && !duplicateSold}
                        in:scale={{
                            delay: 400,
                            duration: 500,
                            easing: elasticOut,
                        }}
                    >
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                        ></div>
                        <span class="relative flex items-center gap-3">
                            {#if isStarter && !duplicateSold}
                                <span class="text-2xl">⚠️</span>
                                Vende la repetida primero
                            {:else}
                                <span class="text-3xl">🎉</span>
                                ¡Continuar!
                                <span class="text-3xl">🎉</span>
                            {/if}
                        </span>
                    </button>
                {/if}

                {#if isStarter && phase === "complete"}
                    <div
                        class="text-center text-slate-300 text-base max-w-lg bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-6 rounded-xl border-2 border-amber-500/30 shadow-xl"
                        in:fade={{ delay: 600 }}
                    >
                        <div class="text-3xl mb-3">💡</div>
                        <p class="font-bold text-amber-400 mb-2">Tutorial</p>
                        <p class="text-sm leading-relaxed">
                            Has recibido cartas, pero una está repetida.
                            ¡Véndela para conseguir tus primeras monedas y poder
                            comprar más sobres!
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    @keyframes shake {
        0%,
        100% {
            transform: translateX(0) rotate(0deg);
        }
        25% {
            transform: translateX(-10px) rotate(-5deg);
        }
        75% {
            transform: translateX(10px) rotate(5deg);
        }
    }

    @keyframes burst {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }

    @keyframes float-slow {
        0%,
        100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
        }
        50% {
            transform: translateY(-30px) translateX(10px);
            opacity: 0.5;
        }
    }

    .animate-shake {
        animation: shake 0.5s ease-in-out infinite;
    }

    .animate-burst {
        animation: burst 0.8s ease-out forwards;
    }

    .animate-float-slow {
        animation: float-slow 5s ease-in-out infinite;
    }
</style>
