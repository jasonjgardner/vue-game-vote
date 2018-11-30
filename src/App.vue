<template>
	<div class="d-flex flex-column nowrap" id="app" v-bind:class="{ 'few-voters': voters < 3 && voters > 0, 'no-voters': voters < 0 }">
		<header class="d-flex app__header">
			<h1 class="app__title">Vote for a Game</h1>

			<form class="d-flex" id="voters">
				<label class="sr-only" for="votesRemaining">Votes Remaining:</label>
				<div class="voters__votes">
					<input id="votesRemaining" type="number" placeholder="#" max="99" min="0" readonly
						v-model.number="voters" v-if="voters > 0">
					<button class="btn" type="button" v-if="votes.length" v-on:click="choose">
						<check-icon></check-icon>
						<span class="sr-only">Choose</span>
					</button>
				</div>

				<button class="btn btn--secondary btn--fab" type="button" v-show="votes.length" v-on:click="reset">
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

		<main id="games" v-if="!chosen">
			<GameChoice v-for="game in games" v-bind:game="game" v-bind:key="game.id"></GameChoice>
		</main>

		<section class="d-flex flex-column" id="choice" v-if="chosen">
			<h2 class="choice__title">{{ chosen.text }}</h2>
			<img class="choice__cover" v-bind:src="require(`./assets/games/${chosen.id}.jpg`)" :alt="chosen.text">

			<h3>We Picked a Game!</h3>

			<p class="text--secondary">Hopefully it&rsquo;s the one you wanted.</p>

			<div class="choice__actions">
				<button class="btn btn--secondary" type="button" v-on:click="choose">
					Pick Again
				</button>
				<button class="btn btn--primary" type="button" v-on:click="reset">
					Start Over
				</button>
			</div>
		</section>
	</div>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Check from 'vue-feather-icon/components/check';
	import GameChoice from './components/GameChoice';

	const defaultVoters = 5;

	export default {
		name: 'app',
		components: {
			GameChoice,
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle,
			CheckIcon: Check
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

	#app {
		margin: calc(3.25rem + #{$size-btn-fab}) auto 0;
	}

	#games {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
	}

	.voters__votes {
		background-color: $color-accent;
		border-radius: ($size-btn-fab * .5);
		box-shadow: -1px 1px 3px rgba(0, 0, 0, .5), 0 0 5px rgba(0, 0, 0, .33);
		color: $color-dark;
		display: flex;
		height: $size-btn-fab;
		justify-content: center;
		min-width: $size-btn-fab;
		text-align: center;
		transition: background-color .333s ease-in-out;

		input {
			background-color: transparent;
			border: 0;
			color: $color-dark;
			font-weight: bold;
			text-align: right;
			width: 1.5rem;

			&:focus {
				color: $color-dark-alt;
				outline: none;
			}

			&:only-child {
				text-align: center;
			}
		}

		.btn {
			background-color: transparent;
			color: $color-dark;
			margin: 0;
			padding-bottom: 0;
			padding-left: 0;
			padding-right: 0;
		}

		input + .btn {
			padding-left: .25em;
			padding-right: .45em;
		}

		&:focus,
		&:focus-within {
			background-color: mix($color-accent, $color-primary);
			color: $color-btn-background;
			outline: none;
		}
	}

	.no-voters .voters__votes {
		border-radius: 50%;
		width: $size-btn-fab;
	}

	#voters {
		align-items: center;
		font-size: 1rem;
		justify-content: flex-end;
		text-align: right;

		> .btn {
			margin-left: 1rem;
		}
	}

	.app__header {
		align-items: center;
		background-color: rgba($color-background, .97);
		border-bottom: 1px solid rgba($color-lightest, .66);
		box-shadow: 0 2px .3125rem rgba(0, 0, 0, .66), 0 .3125rem 1.5rem rgba(0, 0, 0, .33);
		box-sizing: border-box;
		flex-wrap: wrap;
		justify-content: space-between;
		left: 0;
		margin: 0;
		padding: 1.5rem $padding-container;
		position: fixed;
		transition: border-bottom-color .5s ease-out;
		top: 0;
		width: 100%;
		z-index: $zindex-toolbar;

		&:hover,
		&:focus-within {
			border-bottom-color: $color-lightest;
		}
	}

	.app__title {
		font-size: 1.25rem;
		font-weight: normal;
		text-align: left;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
		margin: 0;
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

	.choice__actions {
		background-color: $color-background-alt;
		margin: 1.5rem auto 0;
		width: 100%;

		.btn {
			display: block;
			padding: 1em 2.5em;
		}

		.btn + .btn {
			margin-top: 1rem;
		}
	}

	@media screen and (min-width: #{($media-screen-sm + 1)}) {
		.app__header {
			align-items: center;
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>
