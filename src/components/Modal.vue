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
		name: 'Modal'
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
			display: table-cell;
			vertical-align: middle;
		}

		&__container {
			background-color: $color-background-alt;
			border-radius: $size-border-radius;
			box-shadow: 0 3px 1rem rgba(0, 0, 0, .5);
			margin: 0 auto;
			padding: $size-base;
			transition: all .3s ease;
			width: min(300px, $size-base * 20);
		}

		&__body {
			background-color: $color-background;
			padding: $size-base;
		}

		&__header {
			border-bottom: 1px solid $color-lightest;
			padding-bottom: $size-base;
		}

		&__header h1,
		&__header h2,
		&__header h3 {
			color: $color-lightest;
			font-weight: 300;
			line-height: 1.25;
			margin: 0;
		}

		&__footer {
			align-items: center;
			border-top: 1px solid $color-lightest;
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

	.modal-enter {
		opacity: 0;
	}

	.modal-leave-active {
		opacity: 0;
	}
</style>
