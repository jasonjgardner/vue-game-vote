<template>
	<div class="wrapper">
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
	</div>
</template>

<script>
	/**
	 * @module Controls
	 */
	export default {
		name: 'Controls',
		data() {
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
		margin-left: var(--size-base);

		label {
			font-weight: 300;
			margin: calc(2 * var(--size-gap));
		}
	}

	.btn--control {
		background-color: var(--color-fab);
		color: var(--color-background);
		font-weight: bold;
		vertical-align: middle;

		&:hover,
		&:focus,
		&:active {
			background-color: var(--color-accent);
		}
	}

	.controls,
	.wrapper {
		display: flex;
		flex-flow: row nowrap;
	}

	.wrapper {
		align-items: center;
		background-color: var(--color-background);
		border-top: 1px solid var(--color-border);
		height: calc(var(--size-app-icon) + var(--size-base) * 2);
		justify-content: space-around;
		margin: 0 auto;
		padding: var(--size-gap) var(--size-base);
		width: calc(100% - (2 * var(--size-base)));
	}

	.controls {
		flex: 1 0 50%;
		justify-content: flex-end;
	}
</style>
