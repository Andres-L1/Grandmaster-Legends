<script lang="ts">
    import type { Player } from "$lib/data/players";
    import { fade, scale } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    interface Props {
        player: Player;
        isNew?: boolean;
        showPrice?: boolean;
        count?: number;
        onClick?: () => void;
        flipOnReveal?: boolean;
    }

    let {
        player,
        isNew = false,
        showPrice = false,
        count = 1,
        onClick,
        flipOnReveal = false,
    } = $props();

    let isFlipped = $state(false);
    let showGlow = $state(false);

    // Initialize flip state
    $effect(() => {
        if (flipOnReveal) {
            isFlipped = true;
        }
    });

    function getRarity(rating: number): {
        type: string;
        color: string;
        border: string;
        bg: string;
        glow: string;
    } {
        if (rating >= 2700)
            return {
                type: "GOAT",
                color: "text-yellow-200",
                border: "border-yellow-400 border-4",
                bg: "bg-gradient-to-b from-yellow-700 via-amber-500 to-yellow-900 shadow-[0_0_20px_rgba(234,179,8,0.3)]",
                glow: "shadow-[0_0_60px_rgba(234,179,8,0.8)]",
            };
        if (rating >= 2660)
            return {
                type: "LEGENDARY",
                color: "text-orange-400",
                border: "border-orange-500",
                bg: "bg-gradient-to-br from-orange-950 via-red-900 to-black",
                glow: "shadow-[0_0_40px_rgba(251,146,60,0.6)]",
            };
        if (rating >= 2655)
            return {
                type: "EPIC",
                color: "text-purple-400",
                border: "border-purple-500",
                bg: "bg-gradient-to-br from-purple-950 via-slate-900 to-black",
                glow: "shadow-[0_0_40px_rgba(168,85,247,0.6)]",
            };
        if (rating >= 2650)
            return {
                type: "RARE",
                color: "text-blue-400",
                border: "border-blue-500",
                bg: "bg-gradient-to-br from-blue-950 to-slate-900",
                glow: "shadow-[0_0_30px_rgba(59,130,246,0.5)]",
            };
        return {
            type: "COMMON",
            color: "text-slate-400",
            border: "border-slate-600",
            bg: "bg-slate-800",
            glow: "",
        };
    }

    let rarity = $derived(getRarity(player.rating));

    function handleClick() {
        if (flipOnReveal && !isFlipped) {
            isFlipped = true;
            setTimeout(() => onClick?.(), 600);
        } else {
            onClick?.();
        }
    }

    function handleMouseEnter() {
        showGlow = true;
    }

    function handleMouseLeave() {
        showGlow = false;
    }
</script>

<button
    class="card-container relative w-full aspect-[2/3] perspective-1000"
    onclick={handleClick}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
>
    <div
        class="card-inner relative w-full h-full transition-transform duration-700 preserve-3d {isFlipped
            ? 'rotate-y-180'
            : ''}"
        style="transform-style: preserve-3d;"
    >
        <!-- Card Back -->
        <div
            class="card-face absolute inset-0 backface-hidden rounded-xl border-4 border-amber-500 bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-950 flex items-center justify-center overflow-hidden"
            style="backface-visibility: hidden;"
        >
            <!-- Decorative pattern -->
            <div class="absolute inset-0 opacity-20">
                <div
                    class="absolute inset-0"
                    style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px);"
                ></div>
            </div>

            <!-- Logo/Icon -->
            <div class="relative z-10 text-center">
                <div class="text-8xl mb-4 drop-shadow-2xl animate-pulse">♚</div>
                <div class="text-2xl font-black text-amber-200 tracking-wider">
                    GRANDMASTER
                </div>
                <div class="text-sm text-amber-400/70 font-bold mt-2">
                    LEGENDS
                </div>
            </div>

            <!-- Shine effect -->
            <div
                class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-shine"
            ></div>
        </div>

        <!-- Card Front -->
        <div
            class="card-face absolute inset-0 backface-hidden rounded-xl border-2 {rarity.border} {rarity.bg} p-2 shadow-2xl transition-all duration-300 flex flex-col items-center justify-between overflow-hidden {showGlow &&
            player.rating >= 2650
                ? rarity.glow
                : ''}"
            style="backface-visibility: hidden; transform: rotateY(180deg);"
        >
            <!-- Particle effects for high rarity -->
            {#if player.rating >= 2660}
                <div class="absolute inset-0 pointer-events-none">
                    {#each Array(8) as _, i}
                        <div
                            class="absolute w-1 h-1 bg-{player.rating >= 2700
                                ? 'yellow'
                                : 'orange'}-400 rounded-full animate-float"
                            style="
                                left: {Math.random() * 100}%;
                                top: {Math.random() * 100}%;
                                animation-delay: {i * 0.3}s;
                                animation-duration: {3 + Math.random() * 2}s;
                            "
                        ></div>
                    {/each}
                </div>
            {/if}

            <!-- Card Texture/Effect -->
            {#if player.rating >= 2660}
                <div
                    class="absolute inset-0 opacity-20 bg-[url('/foil-texture.png')] bg-cover mix-blend-overlay pointer-events-none"
                ></div>
                <div
                    class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none"
                ></div>
            {/if}

            <!-- Header: Rating & Flag -->
            <div class="w-full flex justify-between items-start z-10 relative">
                <div
                    class="flex flex-col items-center bg-black/40 px-2 py-1 rounded border border-white/10 backdrop-blur-sm"
                >
                    <span class="text-xs font-bold {rarity.color}"
                        >{rarity.type}</span
                    >
                    <span class="text-xl font-black text-white leading-none">
                        {player.rating}
                    </span>
                </div>
                {#if player.country}
                    <div
                        class="text-xl shadow-black drop-shadow-md grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    >
                        <img
                            src={`https://flagsapi.com/${player.country}/flat/32.png`}
                            alt={player.country}
                            class="w-8 h-8"
                        />
                    </div>
                {/if}
            </div>

            <!-- Player Image -->
            <div
                class="absolute inset-0 flex items-center justify-center top-4 z-0 pointer-events-none overflow-hidden group-hover:scale-105 transition-transform duration-500"
            >
                {#if player.photoUrl}
                    <img
                        src={player.photoUrl}
                        alt={player.name}
                        class="w-[90%] h-[90%] object-cover object-top transition-all duration-500 filter grayscale contrast-[1.5] brightness-125"
                        style="mask-image: linear-gradient(to bottom, black 80%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);"
                    />
                {:else}
                    <svg
                        viewBox="0 0 24 24"
                        class="w-[70%] h-[70%] stroke-white/80 fill-transparent stroke-[0.8] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-80"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                    </svg>
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"
                    ></div>
                {/if}
            </div>

            <!-- Footer: Name & Username -->
            <div
                class="z-10 w-full text-center relative mt-auto bg-black/80 backdrop-blur-md rounded-lg p-2 border-t border-white/5 shadow-black/50 shadow-lg"
            >
                <h3
                    class="font-serif font-bold text-white leading-tight truncate px-1 text-sm md:text-base tracking-wide"
                >
                    {player.name}
                </h3>
                <p
                    class="text-[10px] text-slate-400 truncate uppercase tracking-wider mt-0.5"
                >
                    @{player.username}
                </p>
            </div>

            <!-- Badges -->
            {#if isNew}
                <div
                    class="absolute top-2 right-2 z-20 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse"
                    transition:fade
                >
                    NEW!
                </div>
            {/if}

            {#if count > 1}
                <div
                    class="absolute bottom-2 right-2 z-20 bg-gradient-to-br from-amber-400 to-amber-600 text-black text-xs font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-amber-200"
                    transition:fade
                >
                    x{count}
                </div>
            {/if}
        </div>
    </div>
</button>

<style>
    .perspective-1000 {
        perspective: 1000px;
    }

    .preserve-3d {
        transform-style: preserve-3d;
    }

    .backface-hidden {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }

    .rotate-y-180 {
        transform: rotateY(180deg);
    }

    @keyframes shine {
        to {
            transform: translateX(200%) skewX(-12deg);
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0) scale(1);
            opacity: 0;
        }
        50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
        }
    }

    .animate-shine {
        animation: shine 3s infinite;
    }

    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
</style>
