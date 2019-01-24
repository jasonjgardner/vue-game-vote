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

<style lang="scss" scoped>
	@import '../../css/_variables.scss';
	@import '../../css/_mixins.scss';

	.action-sheet {
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
		max-height: 60vh;
		min-height: 45vh;
		padding: var(--size-base);
		position: absolute;
		transition: bottom .5s ease-out-circ;
		width: 100%;
		z-index: $zindex-modal + 1;
	}

	.backdrop {
		background-color: $color-backdrop;
		height: 100vh;
		left: 0;
		position: fixed;
		top: 0;
		transition: opacity .425s ease-out;
		user-select: none;
		width: 100vw;
		z-index: $zindex-modal - 1;
	}

	.show-enter-active .sheet {
	}

	.show-enter .sheet {
		bottom: -100%;
	}

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
