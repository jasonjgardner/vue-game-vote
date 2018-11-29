<template>
	<div id="app">
		<header class="app__header" v-bind:class="{ 'few-voters': voters < 3 && voters > 0, 'no-voters': voters < 1 }">
			<h1>Games</h1>

			<form id="voters">
				<label for="votesRemaining">Votes remaining:</label>
				<input id="votesRemaining" type="number" placeholder="# of votes" max="100" min="0" v-model.number="voters">

				<button class="btn" type="button" v-on:click="choose">Choose</button>
				<button class="btn" type="button" v-on:click="reset">Reset</button>
			</form>
		</header>

		<div id="games" v-if="!chosen">
			<GameChoice v-for="game in games" v-bind:game="game" v-bind:key="game.id" v-bind:votes="0"></GameChoice>
		</div>

		<div id="choice" v-if="chosen">
			<h2>Your Choice</h2>
			<img v-bind:src="require(`./assets/games/${chosen.id}.jpg`)" :alt="chosen.text" height="600">
		</div>
	</div>
</template>

<script>
	import GameChoice from './components/GameChoice';

	const defaultVoters = 5;

	export default {
		name: 'app',
		components: {
			GameChoice
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
						text: 'Let\'s Go Pikachu',
					},
					{
						id: 'mario-kart',
						text: 'Mario Kart 8'
					},
					{
						id: 'mario-party',
						text: 'Mario Party Board Game',
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
			choose: function() {
				const votes = this.votes.length ? this.votes : this.choices;
				this.chosen = votes[Math.floor(Math.random() * votes.length)];
			},
			reset: function() {
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
	#games,
	.app__header {
		display: flex;
		flex-flow: row nowrap;
	}

	#games {
		flex-wrap: wrap;
	}

	#voters {
		font-size: 1rem;
		margin-left: auto;

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
		align-items: center;
		padding: .5rem 1.25rem;

		h1,
		form {
			display: inline-block;
		}
	}
</style>
