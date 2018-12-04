<template>
	<div id="app" v-bind:class="{'no-voters': voters < 1, 'cant-vote': voters < 0, 'modal-visible': showModal }">
		<section class="d-flex flex-column flex-1" id="choice" v-if="chosen">
			<GameChosen v-bind:chosen="chosen" v-bind:games="this.$parent.games"></GameChosen>
		</section>
		<main id="games" v-else>
			<header class="app__header">
				<img id="icon" :src="require('./assets/icon.svg')" alt="Software Selection icon"
					title="Vote for a game to play" height="48" width="48" aria-hidden="true"
					v-on:click="showModal = 'instructions'">
				<h1 class="app__title">Vote for a Game</h1>

				<form class="d-flex" id="voters">
					<label class="sr-only" for="votes-remaining">Votes Remaining:</label>

					<div class="voters__votes" v-bind:class="{'invalid': voters < 0 || voters > 99}">
						<input id="votes-remaining" type="number" placeholder="#" max="99" min="0"
							v-model.number="voters" v-if="!votes.length || voters > 0"
							v-bind:readonly="votes.length > 0"
							v-bind:title="`${voters} vote${voters === 1 ? '' : 's'} remaining`"
							v-on:blur="voters = Math.max(1, voters)">
						<button class="btn" type="submit" name="choose" title="Choose the game" v-if="votes.length"
								v-on:click.prevent="choose">
							<check-icon></check-icon>
							<span class="sr-only">Choose</span>
						</button>
					</div>

					<button class="btn btn--secondary btn--fab" type="reset" name="reset" title="Reset voting"
							v-show="votes.length" v-on:click.prevent="reset">
						<reset-icon></reset-icon>
						<span class="sr-only">Reset</span>
					</button>

					<button class="btn btn--secondary btn--fab" type="button" name="buy"
							title="Pay a coin to buy a vote" v-on:click.prevent="buyVote">
						<coin-icon class="rotate--90"></coin-icon>
						<span class="sr-only">Buy Vote</span>
					</button>
				</form>
			</header>

			<GameChoice v-for="game in this.$parent.games" v-bind:game="game" v-bind:key="game.id"></GameChoice>
		</main>

		<modal class="modal" v-if="showModal === 'instructions'">
			<h3 slot="header">Instructions</h3>
			<div slot="body">
				<component :is="modalComponent"></component>
			</div>
			<div slot="footer">
				<button class="btn btn--primary" type="button" v-on:click="showModal = false">OK</button>
			</div>
		</modal>
	</div>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Check from 'vue-feather-icon/components/check';
	import Modal from './components/Modal';
	import GameChoice from './components/GameChoice';

	export default {
		name: 'app',
		components: {
			Modal,
			GameChoice,
			GameChosen: () => import(/* webpackChunkName: "gameChosen" */'./components/GameChosen'),
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle,
			CheckIcon: Check
		},
		data: function () {
			return {
				voters: this.$parent.initialVoters,
				votes: [],
				chosen: null,
				showModal: false
			};
		},
		methods: {
			choose: function () {
				this.chosen = this.votes[Math.floor(Math.random() * this.votes.length)];
				window.scrollTo(0, 0);
			},
			reset: function () {
				this.voters = this.$parent.initialVoters;
				this.chosen = null;
				this.votes = [];
			},
			buyVote: function () {
				(
					new Audio(require('./assets/coin.mp3'))
				).play().finally(
					() => this.voters = Math.max(1, this.voters + 1)
				);
			},
			modalComponent: function(resolve, reject) {
				if (this.showModal && this.showModal.length > 0) {
					return import(`./components/Modal/${this.showModal.charAt(0).toUpperCase() + this.showModal.slice(1)}`)
						.then(resolve, reject);
				}

				reject();
			}
		}

	};
</script>

<style lang="scss" scoped>
	@import './css/variables.scss';

	.modal-visible > *:not(.modal) {
		filter: blur(10px) saturate(.9);
	}

	#app {
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		transition-delay: .25s;
		width: 100%;
	}

	.app__title {
		font-size: 1rem;
		font-weight: normal;
		text-align: left;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
		margin: 0;
	}

	.app__header {
		align-items: center;
		background-color: rgba($color-background, .97);
		border-bottom: 1px solid rgba($color-lightest, .66);
		box-shadow: 0 2px .3125rem rgba(0, 0, 0, .66), 0 .3125rem 1.5rem rgba(0, 0, 0, .33);
		box-sizing: border-box;
		display: flex;
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

		.app__title {
			font-size: 1rem;
			margin-left: $size-base;
			margin-right: auto;
		}
	}

	@media screen and (min-width: #{($media-screen-sm + 1)}) {
		.app__header {
			align-items: center;
			flex-direction: row;
			justify-content: flex-start;

			.app__title {
				margin: 0 auto 0 $size-base;
			}
		}
	}

	#games {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-evenly;
		margin-top: $size-base * 8;
	}

	@media screen and (min-width: #{$media-screen-md}) {
		#games {
			justify-content: flex-start;
			padding-left: $padding-container;
			padding-right: $padding-container;
		}

		.game {
			margin-right: $size-base * 2;

			&:last-of-type {
				margin-right: 0;
			}
		}
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

		&.invalid {
			background-color: $color-assertive;
		}

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

			&[readonly] {
				cursor: default;
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
