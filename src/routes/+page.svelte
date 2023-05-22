<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let endpoint = '';

	let loaded = false;

	onMount(async () => {
		if (browser) {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);

			const code = urlParams.get('code') ?? '';
			if (!code) {
				loaded = true;
				return;
			}

			await fetch(`https://api.github.com/app-manifests/${code}/conversions`, {
				method: 'POST'
			});

			window.location.replace('https://github.com/settings/apps');
		}
	});

	const d = new Date();
	const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

	$: manifest = {
		name: `Appwrite (Generated on ${date})`,
		url: 'https://appwrite.io/',
		hook_attributes: {
			url: endpoint + '/vcs/github/incomingwebhook',
			active: true
		},
		setup_url: endpoint + '/vcs/github/incominginstallation',
		redirect_url: browser ? window.location.href : '',
		setup_on_update: true,
		request_oauth_on_install: false,
		public: true,
		default_permissions: {
			administration: 'write',
			checks: 'write',
			contents: 'write',
			metadata: 'read',
			pull_requests: 'read'
		},
		default_events: ['pull_request', 'push']
	};
</script>

{#if loaded}
	<div class="grid">
		<main class="main-content">
			<div class="container hero-top-container">
				<div class="card u-text-center" style="padding-top: 4rem; padding-bottom: 4rem;">
					<form
						action="https://github.com/settings/apps/new?state=abc123"
						method="post"
						class="u-margin-inline-auto"
						style="max-width: 500px;"
					>
						<input
							type="text"
							value={JSON.stringify(manifest)}
							name="manifest"
							id="manifest"
							style="display: none;"
						/>

						<h1 class="eyebrow-heading-3 u-color-text-pink">Appwrite</h1>
						<h2 class="heading-level-1 u-margin-block-start-16">GitHub App Maker</h2>
						<p class="body-text-1 u-normal u-small u-margin-block-start-16">
							1-click GitHub app generator with all optimal configuration for Appwrite.
						</p>

						<ul class="form-list hero-buttons u-margin-block-start-32">
							<li class="form-item">
								<div class="input-text-wrapper u-flex u-flex-vertical u-cross-start u-gap-4">
									<label for="endpoint" style="text-align: left;">Appwrite Endpoint</label>
									<input
										bind:value={endpoint}
										type="text"
										id="endpoint"
										required={true}
										class="input-text"
										style="text-align: left;"
										placeholder="https://.../v1"
									/>
								</div>
							</li>
							<li>
								<button
									type="submit"
									class="button u-flex u-main-center"
									style="width: 100%; text-align: center;"
								>
									<span class="text">Create GitHub Application</span>
								</button>
							</li>
						</ul>
					</form>
				</div>
			</div>
		</main>
	</div>
{/if}
