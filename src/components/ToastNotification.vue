<template>
	<Transition appear name="toaster">
		<div class="toast" role="alert" @click="$emit('dismissed', true)">
			<slot name="image"></slot>
			<div class="toast__message">
				<slot></slot>
			</div>
		</div>
	</Transition>
</template>

<script>
	import TimeoutMixin from '@/lib/TimeoutMixin';

	export default {
		name: 'ToastNotification',
		mixins: [TimeoutMixin]
	};
</script>

<style lang="scss">
	@import '~@/css/_variables';

	@keyframes blink {
		0%,
		50%,
		100% {
			opacity: 1;
		}

		33%,
		66% {
			opacity: .9;
		}
	}

	.toast {
		align-items: center;
		background-color: rgba(0, 0, 0, .9);
		border-left-width: 0;
		border-top-width: 0;
		color: $color-lightest;
		cursor: pointer;
		display: flex;
		flex-flow: row nowrap;
		font-size: .95rem;
		height: 5rem;
		max-width: 50vw;
		min-width: $size-toast;
		padding: var(--size-gap) var(--size-base);
		position: fixed;
		z-index: $zindex-tooltip + 1;

		svg {
			display: block;
			fill: $color-lightest;
			height: 2rem;
			width: 2rem;
			stroke: $color-lightest;
		}

		&__message {
			flex-grow: 1;
			text-align: center;
		}

		&:hover,
		&:focus,
		&:focus-within {
			background-color: black;
		}
	}

	.backdrop-visible .toast {
		pointer-events: all !important;
	}

	.sweet-fx .toast {
		backdrop-filter: blur(2px);
	}

	.toaster-enter-active,
	.toaster-leave-active {
		transition: transform .5s ease-out-circ;
	}

	.toaster-enter-active,
	.toaster-leave-to {
		animation: blink 3s forwards;
		animation-iteration-count: 5;
	}

	.toaster-enter,
	.toaster-leave-to {
		transform: translate3d(-100%, 0, 0);
	}

	.toaster-enter-to,
	.toaster-leave {
		transform: translate3d(0, 0, 0);
	}
</style>
