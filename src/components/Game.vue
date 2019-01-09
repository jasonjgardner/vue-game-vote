<template>
	<Transition name="reveal">
		<div class="game">
			<figure v-if="game.id"
					:title="title"
					itemscope itemtype="http://schema.org/VideoGame"
					@click="select"
			>
				<img class="game__cover" itemprop="image"
					 :src="require(`../${game.image}`)"
					 :alt='`"${game.name}" cover art`'
					 :title="game.name"
				>
				<figcaption class="game__description">
					<h3 class="game__title" itemprop="name">
						{{ game.name }}
					</h3>

					<p v-if="tally > 5" class="game__tally"
					   title="Votes cast"
					   :aria-label="`${tally} votes for ${game.name}`">
						{{ tally }}
					</p>
					<p v-else-if="tally > 0" class="game__votes"
					   :title="`Vote count for ${game.name}`"
					   :aria-label="`${tally} votes for ${game.name}`">
						<span v-for="idx in tally" :key="idx" aria-hidden="true">
							&#9679;
						</span>
					</p>
				</figcaption>
			</figure>
		</div>
	</Transition>
</template>

<script>
	/**
	 * Game choice component
	 * @module Game
	 * @emits Game#vote
	 * @vue-prop {Number} voters - Remaining votes
	 * @vue-prop {GameData} game - Game data
	 * @vue-computed {string} title - Conditional game title. Shows vote count when no voters remain, otherwise shows "Vote for..." message
	 * @vue-computed {Number} tally - Number of votes received
	 */
	export default {
		name: 'Game',
		props: {
			tally: {
				type: Number,
				required: false,
				default: 0
			},
			voters: {
				type: Number,
				required: false,
				default: 0
			},
			game: {
				type: Object,
				default: () => {
					return {};
				},
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
		computed: {
			title() {
				if (this.voters > 0) {
					return `✔ Vote for ${this.game.name}`;
				}

				return `${this.game.name} (${this.tally} vote${this.tally !== 1 ? 's' : ''})`;
			}
		},
		methods: {
			/** @description Casts a vote for this game
			 * @event Game#vote
			 * @see GameData
			 */
			select() {
				this.$emit('vote', this.game);
			}
		}
	};
</script>

<style lang="scss">
	@import '../css/variables';

	/*---
	title: Wiggle
	resume: Game
	section: Animations
	---
	Shakes game cover on click when there are no votes remaining.
	 */
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

	/*---
	title: Reveal Transition
	resume: Game
	section: Transitions
	---
	Transitions position and opacity
	 */
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

	/*---
	title: Game container
	resume: Game
	section: Layout
	---
	Game cover and title wrapper
	 */
	.game {
		display: flex;
		flex: 1 1 var(--size-game-cover, #{$size-game-cover});
		justify-content: center;
		margin-bottom: var(--size-base);


		figure {
			cursor: pointer;
			display: flex;
			flex-flow: column nowrap;
			margin: 0;
			max-width: var(--size-game-cover, #{$size-game-cover});
			padding: 0;
			position: relative;
			transition: all .5s cubic-bezier(.175, .885, .32, 1.275);
		}

		/// Game title
		&__title {
			color: var(--color-title);
			display: inline-block;
			font-size: 1rem;
			font-weight: bold;
			transition: color .425s ease-out;
		}

		/// Game description
		/// Shows tooltips on hover
		&__description {
			--height: calc(1rem + var(--size-base));
			align-items: center;
			border-radius: $size-border-radius;
			display: flex;
			height: var(--height);
			flex-flow: row nowrap;
			justify-content: space-between;
			padding: 0 .666rem;
			position: relative;
			top: 0;
			transition: background-color .25s ease-out, box-shadow .25s ease-in-out, top .25s ease-out;

			/// Game cover tooltip
			&::before {
				background-color: rgba(0, 0, 0, .75);
				border: 2px solid white;
				border-radius: calc(.125em + var(--size-base));
				bottom: calc(var(--height) + var(--size-gap));
				color: var(--color-lightest);
				content: 'Vote';
				display: block;
				font-size: 1rem;
				font-weight: 300;
				line-height: calc(2 * var(--size-base));
				height: calc(2 * var(--size-base));
				left: 50%;
				max-width: 300px;
				min-width: 200px;
				opacity: 0;
				padding: .125em 0;
				position: absolute;
				text-align: center;
				transition: opacity .333s ease-out;
				transition-delay: 0s;
				transform: translateX(-50%);
				width: calc(var(--size-game-cover) - (5 * var(--size-base)));
				vertical-align: middle;
				z-index: $zindex-cover + 1;
			}

			p,
			#{$--hn} {
				line-height: 1;
				margin: 0;
				padding: 0;
			}
		}

		/// Game box art
		&__cover {
			border: 1px solid var(--color-lightest, white);
			border-radius: $size-border-radius - 1;
			box-sizing: border-box;
			filter: drop-shadow(.01rem .125rem .25rem rgba(0, 0, 0, .45));
			height: var(--size-game-cover, #{$size-game-cover});
			max-height: calc(100vh - ((2 * var(--size-base)) + var(--size-app-icon) + 1px) - 3rem);
			transition: filter .25s ease-out;
			max-width: var(--size-game-cover, #{$size-game-cover});
			object-fit: contain;
			pointer-events: none; /// Do not show <img/> title. Title is SR-only
			z-index: $zindex-cover;
		}

		/// Game vote count bubble
		&__tally {
			background-color: var(--color-accent);
			border: .666em solid var(--color-accent);
			border-radius: 50%;
			box-shadow: 0 1px .125rem rgba(0, 0, 0, .125);
			color: var(--color-btn);
			display: inline-block;
			font-size: .75rem;
			font-weight: bold;
			height: 1em;
			line-height: $line-height-base;
			width: 1em;
			text-align: center;
			transition: box-shadow 1s ease-out;
			vertical-align: middle;
		}

		/// Game vote count dots
		&__votes {
			color: var(--color-accent);
			font-family: sans-serif;
			line-height: 1;
			text-align: right;
			text-shadow: 0 1px 2px rgba(0, 0, 0, .33);
		}

		/// Hocus events
		&:hover,
		&:focus {
			-webkit-tap-highlight-color: transparent;

			/// Highlight title on hover
			.game__title {
				color: var(--color-title-active);
			}

			/// Create tooltip bubble from description
			.game__description {
				background-color: var(--color-tooltip-background);
				filter: drop-shadow(0 .125rem .275rem rgba(0, 0, 0, .25));
				height: var(--height);
				top: calc(2 * var(--size-gap));
				z-index: $zindex-cover + 1;

				&::before {
					backdrop-filter: blur(10px);
					opacity: 1;
					transition: opacity .333s ease-in-out;
					transition-delay: 1.5s;
				}

				/// Bubble arrow
				&::after {
					content: '';
					border-width: calc(.9 * var(--size-base));
					border-style: solid;
					border-color: transparent transparent var(--color-tooltip-background);
					top: calc(-.5 * var(--height));
					height: 0;
					left: calc(50% - (.5 * var(--size-base)));
					position: absolute;
					width: 0;
					z-index: $zindex-cover + 1;
				}
			}

			.game__tally {
				filter: drop-shadow(0 2px 8px rgba(0, 0, 0, .5));
			}

			.game__cover {
				// stylelint-disable no-unknown-animations
				animation: focus 1s infinite;
				filter: drop-shadow(0 3px 5px rgba(0, 0, 0, .5));
			}
		}

		&:active figure {
			transform: scale(1.05, 1.05);
			opacity: .8;
			z-index: $zindex-cover + 1;
		}

		&:first-of-type {
			margin-left: var(--offset, 0);
		}
	}

	.no-voters .game figure {
		cursor: not-allowed;

		.game__description::before {
			content: '';
			display: none;
		}
	}

	.no-voters .game:active {
		animation: wiggle .5s ease;
		animation-iteration-count: 5;

		figure {
			opacity: 1;
			transform: none;
		}

		.game__cover {
			filter: saturate(.3);
			outline: 4px solid $color-dark;
		}
	}

	@media screen and (min-width: #{$media-screen-sm}) {
		.game:first-of-type {
			--offset: var(--size-base);
		}

		.game + .game {
			margin-left: var(--size-base);
		}

		.game:last-of-type {
			margin-right: var(--size-base);
		}

		.game__description {
			--height: calc(1em + var(--size-gap) + (2 * var(--size-base)));

			&::before {
				bottom: calc(var(--height) + var(--size-gap) + var(--size-base));
			}
		}
	}
</style>
