<template>
	<div id="app">
		<header class="app__header" v-bind:class="{ 'few-voters': voters < 3 && voters > 0, 'no-voters': voters < 1 }">
			<h1 class="app__title">Games</h1>

			<form id="voters">
				<label for="votesRemaining">Votes Remaining:</label>
				<input id="votesRemaining" type="number" placeholder="# of votes" max="100" min="0" v-model.number="voters">

				<button class="btn btn--primary" type="button" v-if="votes.length" v-on:click="choose">Choose</button>
				<button class="btn btn--secondary btn--fab" type="button" v-if="votes.length" v-on:click="reset">
					<reset-icon></reset-icon>
					<span class="sr-only">Reset</span>
				</button>

				<div role="separator"></div>

				<button class="btn btn--secondary btn--fab" type="button" v-on:click="voters++">
					<coin-icon class="rotate--90"></coin-icon>
					<span class="sr-only">Buy Vote</span>
				</button>
			</form>
		</header>

		<div id="games" v-if="!chosen">
			<GameChoice v-for="game in games" v-bind:game="game" v-bind:key="game.id"></GameChoice>
		</div>

		<div id="choice" v-if="chosen">
			<h2 class="choice__title">{{ chosen.text }}</h2>
			<img class="choice__cover" v-bind:src="require(`./assets/games/${chosen.id}.jpg`)" :alt="chosen.text">
		</div>
	</div>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import GameChoice from './components/GameChoice';

	const defaultVoters = 5;

	export default {
		name: 'app',
		components: {
			GameChoice,
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle
		},
		data: function () {
			return {
				votes: [],
				voters: defaultVoters,
				chosen: null,
				games: [
					{
						id: 'arms',
						text: 'Arms'
					},
					{
						id: 'pokemon',
						text: 'Let\'s Go Pikachu'
					},
					{
						id: 'mario-kart',
						text: 'Mario Kart 8'
					},
					{
						id: 'mario-party',
						text: 'Mario Party Board Game'
					},
					{
						id: 'minecraft',
						text: 'Minecraft'
					},
					{
						id: '1-2-switch',
						text: '1-2 Switch'
					}
				]
			};
		},
		methods: {
			choose: function () {
				const votes = this.votes.length ? this.votes : this.choices;
				this.chosen = votes[Math.floor(Math.random() * votes.length)];
			},
			reset: function () {
				this.voters = defaultVoters;
				this.chosen = null;
				this.votes = [];
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/variables.scss';

	#voters,
	#choice,
	#games,
	.app__header {
		display: flex;
		flex-flow: row wrap;
	}

	#choice,
	#games {
		flex-wrap: wrap;
		margin: 0 auto;
		max-width: 90%;
	}

	#voters {
		align-items: center;
		font-size: 1rem;
		justify-content: flex-end;
		text-align: right;

		label {
			font-size: .825rem;
			line-height: 1.5;
			text-align: right;
			white-space: nowrap;
		}

		input {
			background-color: transparent;
			border: 0;
			color: $color-lightest;
			text-align: center;
			width: 2rem;
		}

		.btn {
			margin-left: 1rem;
		}
	}

	.app__header {
		box-sizing: border-box;
		flex-wrap: wrap;
		justify-content: center;
		padding: .5rem 1.25rem;
		margin: 0;
		max-width: 100%;
	}

	#choice,
	.app__header {
		flex-direction: column;
	}

	.app__title {
		font-size: 1rem;
		text-align: left;
	}

	.choice__title {
		text-align: center;
	}

	.choice__cover {
		margin: 0 auto;
		max-height: $size-game-cover;
		max-width: $size-game-cover;
		outline: 2px solid $color-selected;
	}

	@media screen and (min-width: #{($media-screen-sm + 1)}) {
		.app__header {
			align-items: center;
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>
