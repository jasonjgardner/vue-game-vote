<template>
	<transition name="reveal">
		<div class="game">
			<figure itemscope itemtype="http://schema.org/VideoGame" v-bind:title="title" v-on:click="vote(game)" v-if="game.id">
				<img class="game__cover" itemprop="image" v-bind:src="require(`../${game.img}`)" v-bind:alt="game.name">
				<figcaption class="game__description">
					<h3 class="game__title" itemprop="name">{{ game.name }}</h3>

					<p class="game__tally" v-if="tally > 5">
						{{ tally }}
					</p>
					<p class="game__votes" v-else-if="tally > 0" v-bind:title="`Vote count for ${game.name}`">
						<span v-for="idx in tally" :key="idx" aria-hidden="true">&#9679;</span>
						<span class="sr-only">{{ `${tally} votes` }}</span>
					</p>
				</figcaption>
			</figure>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'Game',
		props: {
			game: {
				id: {
					type: String,
					required: true
				},
				name: {
					type: String,
					required: true
				},
				img: {
					type: String,
					required: true
				}
			}
		},
		methods: {
			vote(game) {
				let ok = this.$parent.voters > 0;

				if (ok) {
					this.$parent.votes.push(game);
				}

				--this.$parent.voters;

				if (this.$parent.voters < 0) {
					this.$parent.voters = 0;
					ok = false;
				}

				this.$emit('vote', ok);
			}
		},
		computed: {
			title() {
				if (this.$parent.voters > 0) {
					return `✔ Vote for ${this.game.name}`;
				}

				const votes = this.$parent.votes.filter(vote => vote.id === this.game.id).length;

				return `${this.game.name} (${votes} vote${votes !== 1 ? 's' : ''})`;
			},
			tally() {
				return this.$parent.votes.filter(vote => vote.id === this.game.id).length;
			}
		}
	};
</script>

<style lang="scss">
	@import '../css/variables.scss';

	@keyframes wiggle {
		20% {
			transform: translateX(5px);
		}

		40% {
			transform: translateX(-5px);
		}

		60% {
			transform: translateX(3px);
		}

		80% {
			transform: translateX(-2px);
		}

		90% {
			transform: translateX(1px);
		}

		100% {
			transform: translateX(0);
		}
	}

	.reveal-enter,
	.reveal-leave {
		opacity: 0;
		transform: translateY(50%);
	}

	.reveal-enter-active {
		transition: transform .333s ease, opacity .25s;
	}

	.reveal-leave-active {
		transform: translateY(0);
	}

	.no-voters .game figure {
		cursor: not-allowed;

		.game__description::before {
			content: '';
			display: none;
		}
	}

	.game {
		display: flex;
		flex: 1 1 var(--size-game-cover, #{$size-game-cover});
		justify-content: center;

		figure {
			cursor: pointer;
			display: flex;
			flex-flow: column nowrap;
			margin: 0 0 $size-base;
			max-width: var(--size-game-cover, #{$size-game-cover});
			padding: 0;
			position: relative;
		}

		&__title {
			display: inline-block;
			font-size: 1rem;
			font-weight: 300;
		}

		&__description {
			align-items: center;
			border-radius: $size-border-radius;
			display: flex;
			height: ($size-base * 4) - 5;
			flex-flow: row nowrap;
			justify-content: space-between;
			padding: 0 .666rem;
			position: relative;
			top: 0;
			transition: background-color .25s ease-out, box-shadow .25s ease-in-out, top .25s;

			&::before {
				background-color: rgba(0, 0, 0, .75);
				border: 2px solid $color-lightest;
				border-radius: calc(#{$size-base} + .125em);
				bottom: $size-base * 5;
				color: $color-lightest;
				content: 'Vote';
				font-size: 1.125rem;
				font-weight: 300;
				line-height: $size-base * 2;
				height: $size-base * 2;
				left: $size-base * 2.5;
				opacity: 0;
				padding: .125em 0;
				position: absolute;
				text-align: center;
				transition: opacity .333s ease-out;
				transition-delay: 0s;
				width: $size-game-cover - ($size-base * 5);
				z-index: $zindex-cover + 1;
			}
		}

		&__cover {
			box-shadow: 0 0 5px rgba(0, 0, 0, .75), 0 2px 10px rgba(0, 0, 0, .5);
			height: var(--size-game-cover, #{$size-game-cover});
			transition: filter .25s ease-out;
			width: var(--size-game-cover, #{$size-game-cover});
			z-index: $zindex-cover;
		}

		&__tally {
			background-color: $color-accent;
			border-radius: 50%;
			box-shadow: 0 1px 3px rgba(0, 0, 0, .66);
			color: $color-dark;
			font-size: .825rem;
			font-weight: bold;
			height: 1rem;
			line-height: 1;
			padding: .25em;
			text-align: center;
			transition: box-shadow 1s ease-out;
			width: 1rem;
		}

		&__votes {
			color: $color-accent;
			line-height: 1;
			text-align: right;
			text-shadow: 0 1px 2px rgba(0, 0, 0, .6);
		}

		&:hover,
		&:focus,
		&:focus-within {
			-webkit-tap-highlight-color: transparent;

			.game__title {
				color: $color-primary;
			}

			.game__description {
				background-color: $color-background-alt;
				box-shadow: 0 1px 5px rgba(0, 0, 0, .66), 0 2px 10px rgba(0, 0, 0, .33);
				top: 10px;

				&::before {
					opacity: 1;
					transition: opacity .333s ease-in-out;
					transition-delay: 1.5s;
				}

				&::after {
					content: '';
					border-width: ceil($size-base * .666);
					border-style: solid;
					border-color: transparent transparent $color-background-alt;
					bottom: calc(#{($size-base * 2) + 5} + 1.125em);
					height: 0;
					left: calc(50% - #{$size-base * .5});
					position: absolute;
					width: 0;
					z-index: $zindex-cover + 1;
				}
			}

			.game__tally {
				box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
			}

			.game__cover {
				animation: focus 1s infinite;
			}
		}
	}

	.no-voters .game:active {
		animation: wiggle .5s ease;
		animation-iteration-count: 5;

		.game__cover {
			filter: saturate(.3);
			outline: 4px solid $color-dark;
		}
	}
</style>
