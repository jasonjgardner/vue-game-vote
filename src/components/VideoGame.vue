<template>
	<Transition name="reveal">
		<div class="game" tabindex="0" @keypress="select">
			<figure v-if="game.id"
					:title="title"
					itemscope itemtype="http://schema.org/VideoGame"
					@click="select"
			>
				<picture v-if="Array.isArray(game.image)" class="game__cover">
					<source :srcset="require(`@/${game.image[1]}`)"
							type="image/webp">
					<source :srcset="require(`@/${game.image[0]}`)"
							type="image/jpeg">
					<img :src="require(`@/${game.image[0]}`)"
						 :alt='`"${game.name}" cover art`'
						 :title="game.name"
						 itemprop="image">
				</picture>
				<img v-else class="game__cover"
					 :src="require(`@/${game.image}`)"
					 :alt='`"${game.name}" cover art`'
					 :title="game.name"
					 itemprop="image">

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
		name: 'VideoGame',
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
					type: [Array, String],
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
			 * @param {(MouseEvent|KeyboardEvent)} event - Click or keypress event
			 * @event Game#vote
			 * @see GameData
			 */
			select(event) {
				if (event.type === 'click' || ['a', 'Enter'].includes(event.key)) {
					this.$emit('vote', this.game);
				}
			}
		}
	};
</script>

<style lang="scss">
	@import '~@/css/_variables';

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

		& > figure {
			cursor: pointer;
			display: flex;
			flex-flow: column nowrap;
			margin: 0;
			max-width: var(--size-game-cover, #{$size-game-cover});
			padding: 0;
			position: relative;
		}

		/// Game title
		&__title {
			color: var(--color-title);
			display: inline-block;
			font-size: 1.125rem;
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
			flex-flow: row nowrap;
			justify-content: space-between;
			min-height: var(--height);
			padding: 0 .666rem;
			position: relative;
			top: 0;
			transition: background-color .25s ease-out, top .25s ease-out;
			user-select: none;

			/// Game cover tooltip
			&::before {
				background-color: rgba(0, 0, 0, .75);
				border: 2px solid rgba(255, 255, 255, .88);
				border-radius: calc(.125em + var(--size-base));
				bottom: calc(var(--height) + var(--size-gap));
				color: var(--color-lightest);
				content: 'Vote';
				display: block;
				font-size: 1rem;
				font-weight: 300;
				line-height: 1;
				left: 50%;
				max-width: 300px;
				min-width: 200px;
				opacity: 0;
				padding: calc(2 * var(--size-gap)) 0;
				position: absolute;
				text-align: center;
				transition: opacity .333s ease-out;
				transition-delay: 0s;
				transform: translate3d(-50%, 0, 0);
				width: calc(var(--size-game-cover) - (5 * var(--size-base)));
				will-change: transform, opacity;
				vertical-align: middle;
				z-index: $zindex-cover + 1;
			}

			/// Bubble arrow
			&::after {
				content: '';
				border-width: calc(.9 * var(--size-base));
				border-style: solid;
				border-color: transparent transparent var(--color-tooltip-background);
				bottom: calc(1 * var(--height));
				height: 0;
				left: calc(50% - (.5 * var(--size-base)));
				opacity: 0;
				position: absolute;
				transition: opacity .125s ease-out;
				width: 0;
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
		&__cover,
		&__cover img {
			border: 3px solid transparent;
			border-radius: 2 * $size-border-radius;
			height: var(--size-game-cover, #{$size-game-cover});
			transition: filter .25s ease-out;
			max-height: calc(100vh - ((2 * var(--size-base)) + var(--size-app-icon) + 1px) - 3rem);
			max-width: var(--size-game-cover, #{$size-game-cover});
			object-fit: contain;
			object-position: center;
			pointer-events: none; /// Do not show <img/> title. Title is SR-only
			user-select: none;
			z-index: $zindex-cover;
		}

		/// Game vote count bubble
		&__tally {
			background-color: var(--color-accent);
			border: .666em solid var(--color-accent);
			border-radius: 50%;
			box-sizing: content-box;
			color: var(--color-btn);
			display: inline-block;
			font-size: .75rem;
			font-weight: bold;
			height: 1em;
			line-height: $line-height-base;
			width: 1em;
			text-align: center;
			vertical-align: middle;
			user-select: none;
		}

		/// Game vote count dots
		&__votes {
			color: var(--color-accent);
			font-family: sans-serif;
			line-height: 1;
			text-align: right;
			text-shadow: 0 1px 2px rgba(0, 0, 0, .33);
			user-select: none;
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
				height: var(--height);
				top: calc(2 * var(--size-gap));
				z-index: $zindex-cover + 1;

				&::before,
				&::after {
					opacity: 1;
					transition: opacity .333s ease-in-out;
				}

				&::before {
					transition-delay: 1.5s;
				}
			}

			.game__cover {
				// stylelint-disable no-unknown-animations
				animation: focus 1s infinite;
				border-color: var(--color-lightest);
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

	.sweet-fx .game {
		> figure {
			transition: all .5s cubic-bezier(.175, .885, .32, 1.275);
		}

		&__cover {
			filter: drop-shadow(.01rem .125rem .25rem rgba(0, 0, 0, .425));
		}

		&__tally {
			filter: drop-shadow(0 .125rem .125rem rgba(0, 0, 0, .25));
		}
	}

	.sweet-fx .game:hover,
	.sweet-fx .game:focus {
		.game__cover {
			filter: drop-shadow(0 .125em .25em rgba(0, 0, 0, .5));
		}

		.game__description {
			filter: drop-shadow(0 .125rem .25rem rgba(0, 0, 0, .2));
		}

		.game__tally {
			animation: jump 1s alternate infinite;
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
		figure {
			opacity: 1;
			transform: none;
		}

		.game__cover {
			opacity: .9;
			outline: 4px solid $color-dark;
		}
	}

	.sweet-fx .no-voters .game:active {
		animation: wiggle .5s ease;
		animation-iteration-count: 5;

		.game__cover {
			filter: saturate(.3);
			opacity: 1;
		}
	}

	.sweet-fx .no-voters .game:focus .game__cover {
		filter: brightness(.9);
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
