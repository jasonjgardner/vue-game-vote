<template>
	<transition name="modal">
		<div class="modal__mask">
			<div class="modal__wrapper" role="dialog" aria-modal="true">
				<aside class="modal__container">
					<header class="modal__header">
						<slot name="header">&hellip;</slot>
					</header>

					<div class="modal__body">
						<slot name="body">&hellip;</slot>
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
	export default {
		name: 'Modal',
		mounted: () => document.body.style.overflow = 'hidden',
		destroyed: () => document.body.style.overflow = 'auto'
	};
</script>

<style lang="scss">
	@import '../css/variables.scss';

	.modal {
		&__mask {
			background-color: $color-modal-background;
			display: table;
			height: 100%;
			left: 0;
			position: fixed;
			top: 0;
			transition: opacity .333s ease;
			width: 100%;
			z-index: $zindex-modal;
		}

		&__wrapper {
			align-items: center;
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
		}

		&__container {
			background-color: $color-background-alt;
			border-radius: $size-border-radius;
			box-shadow: 0 3px 1rem rgba(0, 0, 0, .5);
			margin: 0 $size-base;
			padding: $size-base;
			transition: all .3s ease;
			max-height: 98vh;
			max-width: $size-base * 30;
			min-width: $media-screen-xs - ($size-base * 2);
		}

		&__body {
			padding: $size-base;
			max-height: 50vh;
			overflow: auto;
		}

		&__header {
			border-bottom: 1px solid $color-secondary;
			padding-bottom: $size-base;
		}

		&__header :--hn {
			color: $color-lightest;
			font-weight: 300;
			line-height: 1.25;
			margin: 0;
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
