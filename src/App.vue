<template>
	<div class="d-flex flex-column nowrap" id="app"
		v-bind:class="{'few-voters': voters < 3 && voters > 0, 'no-voters': voters < 0, 'chosen': !!chosen}">
		<header class="d-flex app__header" v-show="!chosen">
			<h1 class="app__title">Vote for a Game</h1>

			<form class="d-flex" id="voters">
				<label class="sr-only" for="votesRemaining">Votes Remaining:</label>

				<div class="voters__votes" v-bind:class="{'focus': votesChanged}">
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

				<button class="btn btn--secondary btn--fab" type="button" v-on:click="buyVote">
					<coin-icon class="rotate--90"></coin-icon>
					<span class="sr-only">Buy Vote</span>
				</button>
			</form>
		</header>

		<section class="d-flex flex-column flex-1" id="choice" v-if="chosen">
			<GameChosen v-bind:chosen="chosen" v-bind:games="this.$parent.games"></GameChosen>
		</section>
		<main id="games" v-else>
			<GameChoice v-for="game in this.$parent.games" v-bind:game="game" v-bind:key="game.id"></GameChoice>
		</main>
	</div>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Check from 'vue-feather-icon/components/check';
	import GameChoice from './components/GameChoice';
	import GameChosen from './components/GameChosen';

	const defaultVoters = 4;

	export default {
		name: 'app',
		components: {
			GameChoice,
			GameChosen,
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle,
			CheckIcon: Check
		},
		data: function () {
			return {
				votes: [],
				voters: defaultVoters,
				votesChanged: undefined,
				chosen: null
			};
		},
		methods: {
			choose: function () {
				this.chosen = this.votes[Math.floor(Math.random() * this.votes.length)];
				window.scrollTo(0, 0);
			},
			reset: function () {
				this.voters = defaultVoters;
				this.chosen = null;
				this.votes = [];
			},
			buyVote: function() {
				(new Audio(require('./assets/coin.mp3'))).play().finally(() => this.voters = Math.max(1, this.voters + 1));
			}
		},

	};
</script>

<style lang="scss" scoped>
	@import './css/variables.scss';

	#app {
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		margin: calc(3.25rem + #{$size-btn-fab}) auto 0;
		width: 100%;

		&.chosen {
			margin-top: 0;
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

	@media screen and (min-width: #{($media-screen-sm + 1)}) {
		.app__header {
			align-items: center;
			flex-direction: row;
			justify-content: space-between;
		}
	}

	.app__title {
		font-size: 1.25rem;
		font-weight: normal;
		text-align: left;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
		margin: 0;
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
</style>
