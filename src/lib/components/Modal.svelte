<script lang="ts">
    import { fade, scale } from "svelte/transition";

    export let title: string;
    export let isOpen: boolean = false;
    export let onClose: () => void;
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        role="presentation"
        onclick={onClose}
        onkeydown={(e) => e.key === "Escape" && onClose()}
    >
        <div
            class="bg-[rgb(26,35,50)] border border-[rgba(55,71,79,0.5)] rounded-xl w-full max-w-md p-6 shadow-2xl relative"
            transition:scale={{ duration: 200, start: 0.95 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
        >
            <button
                class="absolute top-4 right-4 text-gray-400 hover:text-white"
                onclick={onClose}
                aria-label="Cerrar modal"
            >
                ✕
            </button>

            <h2 class="text-xl font-bold mb-4 text-[rgb(227,242,253)]">
                {title}
            </h2>

            <div class="space-y-4">
                <slot />
            </div>
        </div>
    </div>
{/if}
