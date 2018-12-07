<template>
	<transition appear name="alert">
		<div class="modal">
			<div class="dialog">
				<div class="dialog__header">
					<slot name="header"></slot>
				</div>

				<div class="dialog__body">
					<slot name="message"></slot>
				</div>

				<div class="dialog__footer">
					<slot name="footer">
						<button class="btn" type="button" v-on:click="$emit('dismissed')">OK</button>
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import ModalMixin from './Modal/Mixin';

	export default {
		name: 'Dialog',
		mixins: [ModalMixin]
	};
</script>

<style lang="scss">
	@import '../css/variables';

	.dialog {
		background-color: rgba(mix($color-btn-background, $color-background-alt, 90%), .95);
		border: 1px solid $color-secondary;
		border-radius: $size-border-radius;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .66), 0 2px 12px rgba(0, 0, 0, .33);
		color: $color-lightest;
		display: flex;
		flex-flow: column nowrap;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 90%;

		&__header {
			color: mix($color-muted, $color-light);
			font-size: .925rem;
			padding: ceil($size-base * .5) $size-base 0;

			&:empty {
				display: none;
			}

			#{$--hn} {
				font-weight: normal;
				margin-bottom: 0;
				margin-top: 0;
			}
		}

		&__body {
			padding: ceil($size-base * .5) $size-base;

			p:first-child {
				margin-top: 0;
			}

			p:only-child {
				margin-bottom: 0;
			}
		}

		&__footer {
			border-top: 1px solid $color-light;
			display: flex;
			justify-content: stretch;
			width: 100%;

			.btn {
				background-color: $color-btn-background;
				flex: 2 1 50%;

				&:hover,
				&:focus,
				&:active {
					animation: focus 1s infinite;
					z-index: 2;
				}
			}
		}
	}

	@media screen and (min-width: $media-screen-md) {
		.dialog {
			max-width: 55vw;
		}

		.dialog__header,
		.dialog__body {
			padding: $size-base ceil($size-base * 2);
		}

		.dialog__header {
			padding-bottom: 0;
		}
	}

	.alert-enter-active {
		transition: opacity .325s ease;

		.dialog {
			transition: opacity .425s ease, transform .333s cubic-bezier(.175, .885, .32, 1.275);
		}
	}

	.alert-leave-active,
	.alert-leave,
	.alert-enter {
		opacity: 0;

		.dialog {
			opacity: 0;
			transform: translate(-50%, 100%);
		}
	}
</style>
