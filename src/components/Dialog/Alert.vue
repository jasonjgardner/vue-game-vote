<template>
	<Transition name="alert">
		<div class="modal" role="dialog" aria-modal="true">
			<div class="dialog" :role="role">
				<div class="dialog__header">
					<slot name="header" />
				</div>

				<div class="dialog__body">
					<slot name="message" />
				</div>

				<div class="dialog__footer">
					<slot name="footer">
						<button class="btn" type="button" @click="$emit('dismissed')">
							OK
						</button>
					</slot>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
	import ModalMixin from './Mixin';

	/**
	 * @namespace Modal
	 * @module Modal
	 * @description Dialog box component
	 * @requires ModalMixin
	 * @emits Dialog#dismiss
	 */
	export default {
		name: 'Dialog',
		mixins: [ModalMixin],
		props: {
			role: {
				type: String,
				default: 'dialog'
			}
		}
	};
</script>

<style lang="scss">
	@import '../../css/variables';
	@import '../../css/mixins';

	.dialog {
		background-color: var(--color-dialog-background);
		border: 1px solid var(--color-secondary);
		border-radius: $size-border-radius;
		filter: drop-shadow(0 .25rem .333rem rgba(0, 0, 0, .75));
		color: $color-lightest;
		display: flex;
		flex-flow: column nowrap;
		left: 50%;
		position: fixed;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		z-index: $zindex-modal + 1;

		&__header {
			color: var(--color-muted);
			font-size: .925rem;
			padding: calc(.5 * var(--size-base)) var(--size-base) 0;

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
			padding: calc(.5 * var(--size-base)) var(--size-base);

			p:first-child {
				margin-top: 0;
			}

			p:only-child {
				margin-bottom: 0;
			}
		}

		&__footer {
			border-top: 1px solid var(--color-border);
			display: flex;
			flex-flow: row nowrap;
			justify-content: stretch;
			width: 100%;

			.btn {
				background-color: #{theme('btn-background')};
				color: #{theme('lightest')};
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
			max-width: 50vw;
		}

		.dialog__header,
		.dialog__body {
			padding: var(--size-base) calc(2 * var(--size-base));
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
