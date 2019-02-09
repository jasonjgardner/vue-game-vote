<template>
	<Transition appear name="alert">
		<div class="alert" role="alert" @click="dismiss">
			<slot name="icon"></slot>
			<div class="alert__message">
				<slot></slot>
			</div>
			<CloseIcon v-show="dismissible" class="ml-auto"/>
		</div>
	</Transition>
</template>

<script>
	import CloseIcon from 'vue-feather-icon/components/x';
	import TimeoutMixin from '@/mixins/TimeoutMixin';

	export default {
		name: 'AlertNotification',
		components: {
			CloseIcon
		},
		mixins: [TimeoutMixin],
		props: {
			dismissible: {
				type: Boolean,
				required: false,
				default: true
			}
		},
		methods: {
			dismiss() {
				if (this.dismissible) {
					this.$emit('dismiss');
				}
			}
		}
	};
</script>

<style lang="scss">
	@import '~@/css/_variables';
	@import '~@/css/_mixins';

	.alert {
		-webkit-tap-highlight-color: #{darken(rgba(theme('assertive'), 10%), .25)};
		align-content: stretch;
		align-items: center;
		background-color: #{rgba(theme('assertive'), .95)};
		border: 1px solid lighten(theme('assertive'), 10%);
		border-radius: 3.333em;
		box-sizing: border-box;
		color: $color-dark;
		cursor: pointer;
		display: flex;
		flex-flow: row nowrap;
		font-size: 1rem;
		font-weight: bold;
		left: 50%;
		max-width: 66vw;
		justify-content: space-between;
		padding: calc(4 * var(--size-gap)) calc(4 * var(--size-base));
		position: fixed;
		text-align: center;
		top: calc(2 * var(--size-base));
		transform: translateX(-50%);
		transition: translate .666s ease-in-out;
		user-select: none;
		white-space: nowrap;
		z-index: $zindex-tooltip + 1;

		&__message {
			cursor: pointer;
			width: 100%;
		}

		&__message #{$--hn} {
			line-height: 1;
			margin: 0;
			padding: 0;
		}

		svg {
			fill: currentColor;
			stroke: currentColor;
		}

		&__message + svg {
			cursor: pointer;
			position: absolute;
			right: var(--size-base);
		}
	}

	.sweet-fx .alert {
		filter: drop-shadow(.05rem .1rem .25rem rgba(0, 0, 0, .333));
	}

	.alert-enter-active,
	.alert-leave-active {
		transition: transform .5s ease-out-back;
	}

	.alert-enter,
	.alert-leave-to {
		transform: translate3d(-50%, -150%, 0);
	}

	.alert-enter-to,
	.alert-leave {
		transform: translate3d(-50%, 0, 0);
	}
</style>
