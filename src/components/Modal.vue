<template>
	<transition name="modal">
		<div class="modal">
			<div class="modal__wrapper" role="dialog" aria-modal="true">
				<aside class="modal__container">
					<header class="modal__header" v-if="!!$slots.header">
						<slot name="header"></slot>
					</header>

					<div class="modal__body">
						<slot name="body"></slot>
					</div>

					<footer class="modal__footer">
						<slot name="footer">
							<button class="btn" type="button" v-on:click="$emit('close')">Cancel</button>
						</slot>
					</footer>
				</aside>
			</div>
		</div>
	</transition>
</template>

<script>
	import ModalMixin from './Modal/Mixin';

	export default {
		name: 'Modal',
		mixins: [ModalMixin]
	};
</script>

<style lang="scss">
	@import '../css/variables.scss';

	.modal {
		align-items: center;
		background-color: $color-modal-background;
		display: flex;
		flex-flow: column nowrap;
		height: 100%;
		justify-content: center;
		left: 0;
		position: fixed;
		top: 0;
		transition: opacity .333s ease;
		width: 100%;
		z-index: $zindex-modal;

		&__container {
			background-color: $color-background-alt;
			border-radius: $size-border-radius;
			box-shadow: 0 3px 1rem rgba(0, 0, 0, .5);
			margin: 0 $size-base;
			padding: $size-base;
			transition: all .3s ease;
			max-height: 98vh;
			max-width: 90%;
			min-width: $media-screen-xs - ($size-base * 2);
		}

		&__body {
			font-size: .925rem;
			max-height: 66vh;
			overflow: auto;
			padding: $size-gap;
		}

		&__header {
			border-bottom: 1px solid $color-secondary;
			padding-bottom: $size-base;

			&:empty {
				display: none;
			}

			#{$--hn} {
				color: $color-lightest;
				font-weight: 300;
				line-height: 1.25;
				margin: 0;
			}
		}

		&__footer {
			align-items: center;
			border-top: 1px solid $color-secondary;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-end;
			padding-top: $size-base;

			.btn {
				box-shadow: 0 1px 3px rgba(0, 0, 0, .33), 0 2px 5px rgba(0, 0, 0, .25);
				padding-left: $size-base * 2;
				padding-right: $size-base * 2;
			}
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
</style>
