<script lang="ts">
    import type { Player } from "$lib/data/players";
    import { fade } from "svelte/transition";

    interface Props {
        player: Player;
        isNew?: boolean;
        showPrice?: boolean;
        onClick?: () => void;
    }

    let { player, isNew = false, showPrice = false, onClick } = $props();

    function getRarity(rating: number): {
        type: string;
        color: string;
        border: string;
        bg: string;
    } {
        if (rating >= 2700)
            return {
                type: "GOAT",
                color: "text-yellow-300",
                border: "border-yellow-400",
                bg: "bg-gradient-to-br from-yellow-900 via-amber-600 to-yellow-900",
            };
        // Adjusted thresholds for the current 81-100 pool (Top being ~2661)
        if (rating >= 2660)
            return {
                type: "LEGENDAY",
                color: "text-orange-400",
                border: "border-orange-500",
                bg: "bg-gradient-to-br from-orange-950 via-orange-900 to-red-950",
            };
        if (rating >= 2655)
            return {
                type: "EPIC",
                color: "text-purple-400",
                border: "border-purple-500",
                bg: "bg-gradient-to-br from-purple-950 via-fuchsia-900 to-slate-900",
            };
        if (rating >= 2650)
            return {
                type: "RARE",
                color: "text-blue-400",
                border: "border-blue-500",
                bg: "bg-gradient-to-br from-blue-950 to-slate-900",
            };
        return {
            type: "COMMON",
            color: "text-slate-400",
            border: "border-slate-600",
            bg: "bg-slate-800",
        };
    }

    let rarity = $derived(getRarity(player.rating));
</script>

<button
    class="relative group w-full aspect-[2/3] rounded-xl border-2 {rarity.border} {rarity.bg} p-2 shadow-2xl transition-transform hover:scale-105 hover:z-10 flex flex-col items-center justify-between overflow-hidden"
    onclick={onClick}
>
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
            <span class="text-xs font-bold {rarity.color}">{rarity.type}</span>
            <span class="text-xl font-black text-white leading-none"
                >{player.rating}</span
            >
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

    <!-- Player Image (Line Art Style) -->
    <div
        class="absolute inset-0 flex items-center justify-center top-6 z-0 pointer-events-none overflow-hidden"
    >
        <!-- We use a CSS filter to simulate the 'outline sketch' look -->
        <img
            src={player.photoUrl ||
                `https://ui-avatars.com/api/?name=${player.name}&background=random&size=200`}
            alt={player.name}
            class="w-[90%] h-[90%] object-cover object-top transition-all duration-500 filter grayscale contrast-[1.5] brightness-125 group-hover:scale-110"
            style="mask-image: linear-gradient(to bottom, black 80%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%); mix-blend-mode: luminosity;"
        />
        <!-- Outline effect overlay (optional trick: duplicate image with slight offset or border detection filter in CSS is hard, sticking to high contrast B&W) -->
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

    {#if isNew}
        <div
            class="absolute top-2 right-2 z-20 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse"
            transition:fade
        >
            NEW!
        </div>
    {/if}
</button>

<style>
    /* Custom sheen animation */
    @keyframes sheen {
        0% {
            transform: translateX(-150%) skewX(-15deg);
        }
        100% {
            transform: translateX(150%) skewX(-15deg);
        }
    }
</style>
