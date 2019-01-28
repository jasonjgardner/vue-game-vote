<template>
	<ActionSheet style="--height:100%">
		<div class="header">
			<h3>Settings</h3>
		</div>

		<div class="container mt-1">
			<form>
				<fieldset>
					<legend>Theme</legend>

					<label class="option" :class="{'option--checked': theme === 'light'}">
						<span class="swatch" style="background-color:white;"></span>

						<input v-model="theme"
							   type="radio"
							   value="light">
						<span class="option__label">Light theme</span>

						<CheckCircle/>
					</label>

					<label class="option" :class="{'option--checked': theme === 'dark'}">
						<span class="swatch" style="background-color:black;"></span>

						<input v-model="theme"
							   type="radio"
							   value="dark">
						<span class="option__label">Dark theme</span>

						<CheckCircle/>
					</label>
				</fieldset>

				<fieldset class="mr-1">
					<legend>FX</legend>

					<label class="option">
						<input v-model="audioFx" type="checkbox">
						<span class="option__label">Sound effects</span>
						<span :class="{'text--muted': !audioFx, 'text--accent': audioFx}">{{ audioFx ? 'On' : 'Off'}}</span>
					</label>

					<label class="option">
						<input v-model="visualFx" type="checkbox">
						<span class="option__label">Visual effects</span>
						<span :class="{'text--muted': !visualFx, 'text--accent': visualFx}">{{ visualFx ? 'On' : 'Off'}}</span>
					</label>
				</fieldset>
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
						visual: true
					};
				}
			}
		},
		data() {
			return {
				theme: this.settings.theme || +(
					new Date()
				).getHours() <= 18,
				audioFx: this.settings.audio || false,
				visualFx: this.settings.visual || false
			};
		},
		watch: {
			theme() {
				window.localStorage.setItem('colorScheme', this.theme);
			},
			audioFx() {
				window.localStorage.setItem('enableAudio', JSON.stringify(this.audioFx));
				this.$root.$data.enableAudio = this.audioFx;
			},
			visualFx() {
				window.localStorage.setItem('enableSweetFx', JSON.stringify(this.visualFx));
				/// TODO: Create flash notification prompting reload
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '~@/css/_variables';
	@import '~@/css/_mixins';

	.swatch {
		border: 1px solid var(--color-border);
		border-radius: $size-border-radius;
		display: block;
		height: 100%;
		margin: 0 1rem 0 0;
		min-height: 2rem;
		width: 2.5rem;
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
				fill: #{theme('accent', 'light')};
				visibility: visible;
			}
		}

		&:hover,
		&:focus,
		&:active {
			animation: focus 1s infinite;
			background-color: white;
			border-radius: $size-border-radius;
		}
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
		padding: var(--size-gap) 0 var(--size-gap) var(--size-gap);
	}

	fieldset:hover legend,
	fieldset:focus-within legend {
		border-left-color: var(--color-accent);
		color: var(--color-accent);
	}
</style>
