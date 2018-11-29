<template>
	<figure class="game" v-on:click="vote(game)">
		<img class="game__cover" v-bind:src="require(`../assets/games/${game.id}.jpg`)" :alt="game.text" height="600">
		<figcaption class="game__description">
			<h3 class="game__title">{{ game.text }}</h3>

			<p class="game__votes" v-if="tally > 0" title="Votes received">
				<span v-for="idx in tally" :key="idx">&#9679;</span>
				<span class="sr-only">{{ tally }}</span>
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
			},
			votes: Number
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
			tally: function() {
				return this.$parent.votes.filter(vote => {
					return vote.id === this.game.id;
				}).length || 'x';
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables.scss';

	.game {
		cursor: pointer;
		display: flex;
		flex-flow: column nowrap;

		&:hover,
		&:focus,
		&:focus-within {
			.game__title {
				color: $color-primary;
			}
		}

		&__cover {
			max-height: 30vh;
		}

		&:active .game__cover {
			outline: 5px solid $color-selected;
		}

		&__description {
			align-items: center;
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
		}

		&__votes {
			border-radius: 50%;
			color: $color-accent;
			font-size: .925rem;
			font-weight: 600;
			height: 1.125em;
			line-height: 1.125;
			text-align: right;
			text-shadow: 0 0 2px rgba(0, 0, 0, .5);
			padding: .25em;
			width: 1.125em;
		}
	}
</style>
