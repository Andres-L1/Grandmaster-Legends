<script lang="ts">
	import { base } from "$app/paths";
	import "../app.css";
	import { user } from "$lib/stores/user";
	import { onMount } from "svelte";

	let { children } = $props();
	let mobileMenuOpen = $state(false);

	// Toggle mobile menu
	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Close menu when clicking outside
	onMount(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (
				mobileMenuOpen &&
				!target.closest(".mobile-menu") &&
				!target.closest(".menu-button")
			) {
				mobileMenuOpen = false;
			}
		};
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	});

	function formatBudget(budget: number): string {
		return `${(budget / 1000000).toFixed(1)}M`;
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
>
	<!-- Navigation -->
	<nav
		class="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16 items-center">
				<!-- Logo -->
				<a
					href="{base}/"
					class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"
				>
					<span class="text-2xl">♔</span>
					<span class="hidden sm:inline">Grandmaster Fantasy</span>
					<span class="sm:hidden">GF</span>
				</a>

				<!-- Desktop Menu -->
				<div class="hidden md:flex items-center space-x-4">
					<a
						href="{base}/market"
						class="text-gray-300 hover:text-white px-3 py-2 rounded-md transition"
					>
						Mercado
					</a>
					<a
						href="{base}/my-team"
						class="text-gray-300 hover:text-white px-3 py-2 rounded-md transition"
					>
						Mi Equipo
					</a>
					<a
						href="{base}/leagues"
						class="text-gray-300 hover:text-white px-3 py-2 rounded-md transition"
					>
						Ligas
					</a>
				</div>

				<!-- User Info & Mobile Menu Button -->
				<div class="flex items-center gap-3">
					<div
						class="text-yellow-400 font-semibold text-sm sm:text-base"
					>
						💰 {formatBudget($user.budget)}
					</div>
					<button
						class="md:hidden menu-button p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
						onclick={toggleMenu}
						aria-label="Toggle menu"
					>
						<svg
							class="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							{#if mobileMenuOpen}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							{/if}
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div
				class="md:hidden mobile-menu bg-black/50 backdrop-blur-md border-t border-white/10"
			>
				<div class="px-4 py-3 space-y-2">
					<a
						href="{base}/market"
						class="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
						onclick={() => (mobileMenuOpen = false)}
					>
						💰 Mercado
					</a>
					<a
						href="{base}/my-team"
						class="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
						onclick={() => (mobileMenuOpen = false)}
					>
						👥 Mi Equipo
					</a>
					<a
						href="{base}/leagues"
						class="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
						onclick={() => (mobileMenuOpen = false)}
					>
						👑 Ligas
					</a>
					<div class="pt-3 border-t border-white/10">
						<div class="text-gray-400 text-sm px-3 py-2">
							<div>{$user.username}</div>
							<div class="text-purple-400">
								⭐ {$user.totalPoints} puntos
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
		{@render children()}
	</main>

	<!-- Mobile Bottom Navigation -->
	<nav
		class="md:hidden fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md border-t border-white/10 z-40"
	>
		<div class="flex justify-around items-center h-16">
			<a
				href="{base}/"
				class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-white transition"
			>
				<span class="text-xl mb-1">🏠</span>
				<span class="text-xs">Inicio</span>
			</a>
			<a
				href="{base}/market"
				class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-white transition"
			>
				<span class="text-xl mb-1">💰</span>
				<span class="text-xs">Mercado</span>
			</a>
			<a
				href="{base}/my-team"
				class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-white transition"
			>
				<span class="text-xl mb-1">👥</span>
				<span class="text-xs">Equipo</span>
			</a>
			<a
				href="{base}/leagues"
				class="flex flex-col items-center justify-center flex-1 text-gray-400 hover:text-white transition"
			>
				<span class="text-xl mb-1">👑</span>
				<span class="text-xs">Ligas</span>
			</a>
		</div>
	</nav>

	<!-- Bottom padding for mobile nav -->
	<div class="h-16 md:hidden"></div>
</div>
