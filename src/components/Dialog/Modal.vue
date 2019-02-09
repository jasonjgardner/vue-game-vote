<template>
	<Transition name="modal">
		<div class="modal">
			<div class="modal__wrapper" role="dialog" aria-modal="true">
				<div class="modal__container">
					<header v-if="!!$slots.header" class="modal__header">
						<slot name="header" />
					</header>

					<div class="modal__body">
						<slot name="body" />
					</div>

					<footer class="modal__footer">
						<slot name="footer">
							<button class="btn h-focus" type="button" @click="$emit('close')">
								Cancel
							</button>
						</slot>
					</footer>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
	import ModalMixin from '@/mixins/DialogMixin';

	/**
	 * Dialog component
	 * @module Modal
	 * @requires ModalMixin
	 * @emits Dialog#close
	 */
	export default {
		name: 'Modal',
		mixins: [ModalMixin]
	};
</script>

<style lang="scss">
	@import '~@/css/variables';
	@import '~@/css/mixins';

	.modal {
		align-items: center;
		background-color: var(--color-modal-background);
		color: var(--color-text);
		display: flex;
		flex-flow: column nowrap;
		height: 100%;
		justify-content: center;
		left: 0;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: $zindex-modal;

		&__container {
			background-color: var(--color-surface);
			border-radius: $size-border-radius;
			margin: 0 var(--size-base);
			padding: var(--size-base);
			max-height: 98vh;
			max-width: 98vw;
			min-width: calc(#{$media-screen-xs} - (var(--size-base) * 2));
		}

		&__body {
			font-size: .925rem;
			max-height: 66vh;
			overflow: auto;
			padding: var(--size-gap);
		}

		&__header {
			align-items: center;
			border-bottom: 1px solid var(--color-secondary);
			display: flex;
			padding-bottom: var(--size-base);

			&:empty {
				display: none;
			}

			h1,
			h2,
			h3 {
				color: var(--color-text);
				font-weight: 300;
				line-height: 1.25;
				margin: 0;
			}
		}

		&__footer {
			border-top: 1px solid var(--color-secondary);
			align-items: center;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-end;
			padding-top: var(--size-base);
		}
	}

	.sweet-fx .modal {
		transition: opacity .333s ease;

		&__container {
			filter: drop-shadow(0 .125rem 1rem rgba(0, 0, 0, .5));
			transition: all .3s ease;
		}
	}

	@media screen and (min-width: $media-screen-sm) {
		.modal__container {
			margin-left: auto;
			margin-right: auto;
		}
	}

	.modal-enter {
		opacity: 0;
	}

	.modal-leave-active {
		opacity: 0;
	}

	a {
		color: var(--color-primary);
	}

	#{$--hn} {
		color: var(--color-info, var(--color-primary));
		font-weight: bolder;
	}

	hr {
		border: 0;
		border-top: 1px solid var(--color-border);
		margin-bottom: var(--size-base);
		margin-top: var(--size-base);
	}
</style>
