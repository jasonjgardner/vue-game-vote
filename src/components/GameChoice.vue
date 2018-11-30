<template>
	<figure class="game" v-on:click="vote(game)" v-if="game.id">
		<img class="game__cover" v-bind:src="require(`../assets/games/${game.id}.jpg`)" :alt="game.text" height="600">
		<figcaption class="game__description">
			<h3 class="game__title">{{ game.text }}</h3>

			<p class="game__votes" v-if="tally > 0" v-bind:title="tally + ' votes'">
				<span v-for="idx in tally" :key="idx">&#9679;</span>
				<span class="sr-only"></span>
			</p>
		</figcaption>
	</figure>
</template>

<script>
	export default {
		name: 'GameChoice',
		props: {
			game: {
				id: String,
				name: String
			}
		},
		methods: {
			vote: function (game) {
				if (this.$parent.voters > 0) {
					this.$parent.votes.push(game);
				}

				--this.$parent.voters;
			}
		},
		computed: {
			tally: function () {
				return this.$parent.votes.filter(vote => {
					return vote.id === this.game.id;
				}).length;
			}
		}
	};
</script>

<style lang="scss" scoped>
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

	.game {
		cursor: pointer;
		display: flex;
		flex-flow: column nowrap;
		margin: 0 1rem 1rem 0;
		max-width: $size-game-cover;
		padding: 0;

		&:last-child {
			margin-right: 0;
		}

		&__title {
			display: inline-block;
			font-size: 1rem;
			font-weight: 300;
		}

		&__description {
			align-items: center;
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			padding: 0 .5rem;
			transition: background-color .25s ease-out;
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
			}
		}

		&__cover {
			box-shadow: 0 0 5px rgba(0, 0, 0, .75), 0 2px 10px rgba(0, 0, 0, .5);
			height: $size-game-cover;
			transition: filter .25s ease-out;
			width: $size-game-cover;
		}

		&:active .game__cover {
			animation: focus 1s infinite;
		}

		&__votes {
			color: $color-accent;
			text-align: right;
			text-shadow: 0 0 2px rgba(0, 0, 0, .5);
			text-wrap: none;
		}
	}

	.no-voters .game {
		cursor: not-allowed;
	}

	.no-voters .game:active {
		animation: wiggle .5s ease;
		animation-iteration-count: 5;

		.game__cover {
			filter: saturate(.33);
			outline: 4px solid $color-dark;
		}
	}
</style>
