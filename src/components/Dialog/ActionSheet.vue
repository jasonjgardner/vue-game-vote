<template>
	<Transition name="show">
		<div class="action-sheet">
			<div class="sheet">
				<slot></slot>
			</div>

			<div class="backdrop" @click="$emit('dismissed')"></div>
		</div>
	</Transition>
</template>

<script>
	import ModalMixin from './Mixin';

	export default {
		name: 'ActionSheet',
		mixins: [ModalMixin]
	};
</script>

<style lang="scss">
	@import '~@/css/_variables';
	@import '~@/css/_mixins';

	.action-sheet {
		--color-border: #{theme('border', 'light')};
		height: 100vh;
		left: 0;
		overflow: hidden;
		position: absolute;
		top: 0;
		width: 100vw;
	}

	.sheet {
		background-color: #{theme('background', 'light')};
		color: #{theme('background', 'dark')};
		filter: drop-shadow(0 -.25rem .666rem rgba(0, 0, 0, .5));
		bottom: 0;
		height: var(--height, 50vh);
		max-height: 60vh;
		min-height: 45vh;
		padding: 0;
		position: absolute;
		transition: bottom .5s ease-out-circ, opacity .5s ease-in-out;
		width: 100%;
		z-index: $zindex-modal + 1;

		.header:first-child > #{$--hn} {
			margin-bottom: 0;
			margin-top: 0;
			padding-bottom: 0;
			padding-top: 0;
		}
	}

	.backdrop {
		background-color: $color-backdrop;
		height: 100vh;
		left: 0;
		position: fixed;
		top: 0;
		transition: opacity .5s ease-out;
		user-select: none;
		width: 100vw;
		z-index: $zindex-modal - 1;
	}

	.show-enter-active .sheet {
	}

	.show-enter .sheet {
		bottom: -100%;
	}

	.show-leave-active,
	.show-enter .backdrop {
		opacity: 0;
	}

	.show-enter-to .sheet {
		bottom: 0;
	}

	.show-enter-to .backdrop {
		opacity: 1;
	}
</style>
