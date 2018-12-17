<template>
	<transition name="fade">
		<div class="tooltip" role="tooltip" v-show="show" v-bind:aria-hidden="JSON.stringify(!show)">
			<div class="tooltip__wrapper">
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'Tooltip',
		props: {
			show: {
				type: Boolean,
				required: true
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables.scss';

	.tooltip {
		background-color: rgba(map-get($theme-dark, 'background-alt'), .95);
		box-shadow: 0 1px 5px rgba(0, 0, 0, .66), 0 2px 10px rgba(0, 0, 0, .33);
		display: block;
		padding: ceil($size-base * .5) $size-base;
		position: absolute;
		top: calc(50% + #{ceil($size-base * 2)});

		&__wrapper {
			position: relative;
			text-align: center;

			&::after {
				content: '';
				border-width: ceil($size-base * .666);
				border-style: solid;
				border-color: transparent transparent rgba(map-get($theme-dark, 'background-alt'), .95);
				top: calc(-100% - #{floor($size-base * .333)});
				height: 0;
				right: -6px;
				position: absolute;
				width: 0;
				z-index: $zindex-tooltip;
			}
		}
	}

	.fade-enter-active {
		transition: opacity .3s;
	}

	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>
