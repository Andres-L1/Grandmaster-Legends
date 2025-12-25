<script lang="ts">
	import { base } from "$app/paths";
	import "../app.css";
	import { user } from "$lib/stores/user";

	let { children } = $props();

	function formatBudget(budget: number): string {
		return `${(budget / 1000000).toFixed(0)}M`;
	}
</script>

<div class="min-h-screen" style="background: rgb(10, 25, 41);">
	<!-- Simple Clean Header -->
	<nav
		class="border-b"
		style="background: rgba(26, 35, 50, 0.95); backdrop-filter: blur(8px); border-color: rgba(55, 71, 79, 0.3);"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo/Brand -->
				<a
					href="{base}/"
					class="text-xl font-semibold"
					style="color: rgb(227, 242, 253);"
				>
					<span class="text-2xl mr-2">♔</span>
					<span class="hidden sm:inline">Grandmaster Fantasy</span>
					<span class="sm:hidden">GF</span>
				</a>

				<!-- Navigation Links -->
				<div class="flex items-center gap-6">
					<a
						href="{base}/market"
						class="text-sm font-medium hover:underline transition"
						style="color: rgb(176, 190, 197);"
					>
						Mercado
					</a>
					<a
						href="{base}/my-team"
						class="text-sm font-medium hover:underline transition"
						style="color: rgb(176, 190, 197);"
					>
						Mi Equipo
					</a>
					<a
						href="{base}/stats"
						class="text-sm font-medium hover:underline transition"
						style="color: rgb(176, 190, 197);"
					>
						Estadísticas
					</a>

					<!-- Budget Badge -->
					<div
						class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
						style="background: rgba(255, 160, 0, 0.1); border: 1px solid rgba(255, 160, 0, 0.3);"
					>
						<span class="text-lg">💰</span>
						<span
							class="font-semibold text-sm"
							style="color: rgb(255, 160, 0);"
							>{formatBudget($user.budget)}</span
						>
					</div>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{@render children()}
	</main>
</div>
