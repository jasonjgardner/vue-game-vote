<template>
	<ActionSheet class="light-scheme" style="--height:100%" @dismissed="$emit('dismissed')">
		<div class="header ml-1 mr-1">
			<h3>Settings</h3>
		</div>

		<div class="container mt-1 flex-1">
			<form id="settings-form" class="h-100">
				<fieldset @change="$emit('update', changes)">
					<legend>Theme</legend>

					<label class="option" :class="{'option--checked': changes.theme === 'light'}">
						<span class="swatch swatch--light"></span>

						<input v-model="changes.theme"
							   type="radio"
							   value="light">
						<span class="option__label">Light theme</span>

						<CheckCircle/>
					</label>

					<label class="option" :class="{'option--checked': changes.theme === 'dark'}">
						<span class="swatch swatch--dark"></span>

						<input v-model="changes.theme"
							   type="radio"
							   value="dark">
						<span class="option__label">Dark theme</span>

						<CheckCircle/>
					</label>
				</fieldset>

				<fieldset class="mr-1">
					<legend>FX</legend>

					<label class="option">
						<input v-model="changes.audio" type="checkbox"
							   @change="$emit('update', changes)">
						<span class="option__label">Sound effects</span>
						<span :class="{'text--muted': !changes.audio, 'text--accent': changes.audio}">{{ changes.audio ? 'On' : 'Off'}}</span>
					</label>

					<label class="option">
						<input v-model="changes.fx" type="checkbox"
							   @change="$emit('update', changes)">
						<span class="option__label">Visual effects</span>
						<span :class="{'text--muted': !changes.fx, 'text--accent': changes.fx}">{{ changes.fx ? 'On' : 'Off'}}</span>
					</label>
				</fieldset>

				<button class="btn btn--wide btn--primary w-90 mt-auto mr-auto ml-auto" type="submit" @click.prevent="$emit('dismissed')">Apply Settings</button>
			</form>
		</div>
		<!-- /.container -->
	</ActionSheet>
</template>

<script>
	export default {
		name: 'SettingsControls',
		components: {
			CheckCircle: () => import(/* webpackMode: "lazy" */'@/assets/check-circle-inverse.svg'),
			ActionSheet: () => import(
				/* webpackChunkName: "actionSheet" */
				/* webpackMode: "lazy" */
				'@/components/Dialog/ActionSheet'
				)
		},
		props: {
			settings: {
				type: Object,
				required: true,
				default() {
					return {
						theme: 'light',
						audio: false,
						fx: false
					};
				}
			}
		},
		data() {
			return {
				changes: this.settings
			};
		}
	};
</script>

<style lang="scss" scoped>
	@import '~@/css/_variables';

	.swatch {
		border-radius: $size-border-radius;
		box-shadow: 0 0 1px 0 var(--color-border) inset, 0 0 1px 0 var(--color-border);
		display: block;
		height: 1.5rem;
		margin: 0 1rem 0 0;
		width: 2.5rem;

		&--light {
			background-color: white;
			border-color: var(--color-border);
		}

		&--dark {
			--color-border: darken($color-dark, 15%);
			background-color: $color-dark;
		}
	}

	.option {
		align-items: center;
		align-content: stretch;
		border-bottom: 1px solid var(--color-border);
		cursor: pointer;
		display: flex;
		flex-flow: row nowrap;
		padding: var(--size-base);
		transition: background-color .25s ease-out;
		width: 100%;

		input {
			display: none;
		}

		.option__label {
			width: 100%;
		}

		svg {
			display: block;
			fill: currentColor;
			height: 2rem;
			width: 2rem;
			visibility: hidden;
		}

		&--checked {
			svg {
				fill: var(--color-accent);
				visibility: visible;
			}
		}

		&:hover,
		&:focus,
		&:active {
			animation: focus 1s infinite;
			background-color: white;
			border-radius: $size-border-radius;

			.swatch {
				border-color: var(--color-accent);
			}

			.swatch--light {
				box-shadow: 0 0 0 2px var(--color-background);
			}
		}
	}

	#settings-form {
		display: flex;
		flex-flow: column nowrap;
	}

	fieldset {
		border: 0;
		margin: var(--size-base) 0 0 0;
		padding: 0;
	}

	legend {
		border-left: .125rem solid var(--color-muted);
		font-size: .825rem;
		font-weight: bold;
		padding: var(--size-gap) 0 var(--size-gap) calc(2 * var(--size-gap));
	}

	fieldset:hover legend,
	fieldset:focus-within legend {
		border-left-color: var(--color-accent);
		color: var(--color-accent);
	}
</style>
