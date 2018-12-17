<template>
	<footer>
		<div class="controls">
			<div v-for="(key, label) in controls" :key="key" class="control">
				<button :id="`control-${label}`"
						class="btn btn--fab btn--control"
						type="button"
						:accesskey="label"
				>
					{{ label }}
				</button>
				<label :for="`control-${label}`">
					{{ controls[label] }}
				</label>
			</div>
		</div>
	</footer>
</template>

<script>
	export default {
		name: 'Controls',
		data: () => {
			return {
				controls: {
					A: 'OK',
					B: 'Back'
				}
			};
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables';

	.control {
		align-items: center;
		display: flex;
		margin-left: $size-base;

		label {
			font-weight: 300;
			margin: 2 * $size-gap;
		}
	}

	.btn--control {
		background-color: $color-lightest;
		color: var(--color-background);
		font-weight: bold;
		vertical-align: middle;

		&:hover,
		&:focus,
		&:active {
			background-color: rgba(255, 255, 255, .66);
			transform: translate(0, 0);

			+ label {
				text-decoration: underline;
			}
		}
	}

	.controls,
	footer {
		display: flex;
		flex-flow: row nowrap;
	}

	footer {
		align-items: center;
		background-color: var(--color-background);
		border-top: 1px solid $color-lightest;
		bottom: 0;
		height: ($size-app-icon + ($size-base) * 2);
		justify-content: space-around;
		position: fixed;
		width: 100%;
	}

	.controls {
		flex: 1 0 50%;
		justify-content: flex-end;
		padding: 0 $size-base;
	}
</style>
