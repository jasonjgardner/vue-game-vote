<template>
	<div id="app" :class="{'no-voters': voters < 1, 'light-scheme': prefersLightScheme }" role="application">
		<div v-if="chosen" id="choice"
			 class="d-flex flex-column flex-1"
			 role="doc-conclusion">
			<Selected :chosen="chosen"
					  :games="games"
					  :votes="votes"
					  @choose="choose"
					  @reset="reset"
			/>
		</div>
		<div v-else class="container" :class="{'vote-cast': voteCast}">
			<AppHeader :voters="voters" :has-votes="votes.length > 0"
					   @showModal="showModal"
					   @buyVote="voters = Math.max(1, voters + 1)"
					   @choose="choose"
					   @reset="reset"
			/>

			<main id="games" class="scrollbar">
				<Game v-for="game in filteredGames"
					  :key="game.id"
					  :voters="voters"
					  :tally="votes.filter(vote => vote.id === game.id).length"
					  :game="game"
					  @vote="onVote"
				/>
			</main>
		</div>

		<Modal v-if="modal === 'instructions'" aria-modal="true"
			   :aria-hidden="modal !== 'instructions'"
			   @dismissed="modal = false">
			<header slot="header">
				<h3>Instructions</h3>
			</header>
			<template slot="body">
				<h2 class="mt-0">
					Voting
				</h2>
				<p>
					The number of remaining votes is displayed inside a circle positioned in the upper
					right corner of the app.
				</p>

				<p>
					<b>Tap the <span class="text--accent">colored circle</span> to adjust the allotted votes</b> via
					keyboard input.
					The new value must be between 1 and 99. Set the initial value to the number of voters participating.
				</p>

				<h3>Buying Votes</h3>
				<p>
					The number of remaining votes can also be adjusted by pressing the <b>Coin</b> button. Pay
					<b>one <a href="#mario-coin">Mario coin</a></b> per additional vote.
				</p>

				<aside id="mario-coin">
					<header class="d-flex align--center">
						<CoinIcon class="rotate--90 light-stroke mr-1 mb-0 mt-0"/>
						<h4 class="mb-0 mt-0">Mario Coins</h4>
					</header>

					<blockquote>
						<p>
							Mario Coins are toy coins embossed with Mario's face. They're given as a reward for good
							behavior and
							taken away for bad behavior, poor sportsmanship, bitching, moaning, etc.
						</p>
					</blockquote>
				</aside>
			</template>
			<template slot="footer">
				<button class="btn btn--primary btn--wide btn--shadow h-focus" type="button" @click="modal = false">
					OK
				</button>
			</template>
		</Modal>

		<Alert v-if="!modal && showNoVoteDialog" :role="'alert'" @dismissed="showNoVoteDialog = false">
			<h4 slot="header">
				<RandomText :choices="['Hang on!', 'Wait!', 'Woops']"/>
			</h4>
			<p slot="message">
				<RandomText :choices="['You\'re out of votes!', 'We\'ve run out of votes! Are you ready to decide?']"/>
			</p>
			<template slot="footer">
				<button class="btn" type="reset" @click.prevent="reset">Reset</button>
				<button class="btn" type="submit" @click.prevent="choose">Elect</button>
			</template>
		</Alert>
	</div>
</template>

<script>
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Header from './components/Header';
	import Game from './components/Game';
	import RandomText from './components/RandomString';
	import typekitLoader from './lib/TypekitLoader';

	/**
	 * Game votes app
	 * @vue-prop {GameData[]} games - Array of game data objects
	 * @vue-prop {Number} initialVoters - Number of votes initially allotted
	 * @vue-data {Number} errors - Number of votes cast after allotted votes have been used
	 * @vue-data {GameData[]} votes - Array of game data objects for which votes have been cast
	 * @vue-data {Object} chosen - Selected game's data
	 * @vue-data {Boolean|String} showModal - Shows a specific modal when set to a string ID. Set to `false` to hide modal
	 * @vue-data {Boolean|String} dialogMessage - Displays a dialog if a string value is set. Hides the dialog if `false`
	 * @vue-data {Number} voters - Number of votes remaining
	 * @vue-data {Boolean} prefersLightScheme - Whether or not to enable light scheme. Defaults to `true` during daytime
	 * @vue-data {Boolean} [voteCast=false] - Is set to `true` when a vote has been placed, then reverts back to `false`
	 * @vue-computed {GameData[]} filteredGames - Array of game data filtered by certain parameters
	 */
	export default {
		name: 'App',
		components: {
			CoinIcon: MinusCircle,
			AppHeader: Header,
			Game,
			RandomText,
			Modal: () => import(/* webpackChunkName: "dialog" */'./components/Dialog/Modal'),
			Alert: () => import(/* webpackChunkName: "dialog" */'./components/Dialog/Alert'),
			Selected: () => import(/* webpackChunkName: "selection" */'./components/Selection')
		},
		props: {
			games: {
				type: Array,
				required: true
			},
			initialVoters: {
				type: Number,
				required: true,
				validator: val => val > 0
			}
		},
		data() {
			return {
				errors: 0,
				votes: [],
				chosen: null,
				modal: false,
				showNoVoteDialog: false,
				voters: this.initialVoters,
				prefersLightScheme: +(
					new Date()
				).getHours() <= 18,
				voteCast: false
			};
		},
		computed: {
			filteredGames() {
				/** @var {GameData} game - Game data **/
				return this.games.filter(game => game.numberOfPlayers >= this.initialVoters);
			}
		},
		created() {
			typekitLoader('apf6wfj');
		},
		methods: {
			/** @description Selects a candidate at random */
			choose() {
				this.showNoVoteDialog = false;
				this.modal = false;

				if (this.chosen) {
					this.votes = this.votes.filter(vote => vote.id !== this.chosen.id);
				}

				this.chosen = this.votes[Math.floor(Math.random() * this.votes.length)];

				window.scrollTo(0, 0);
			},
			/** @description Resets votes, vote counts, and selected game */
			reset() {
				this.showNoVoteDialog = false;
				this.modal = false;
				this.errors = 0;
				this.voters = this.initialVoters;
				this.chosen = null;
				this.votes = [];
			},
			onVote(game) {
				this.voteCast = true;
				let ok = this.voters > 0;

				if (ok) {
					(
						new Audio(require('./assets/audio/stomp.mp3'))
					).play().finally(() => this.votes.push(game));
				}

				--this.voters;

				if (this.voters < 0) {
					this.voters = 0;
					ok = false;
				}

				if (!ok) {
					this.errors++;
				}

				if (this.errors > 2) {
					this.showNoVoteDialog = true;
					this.modal = false;
				}

				setTimeout(() => this.voteCast = false, 1000);
			},
			showModal(which) {
				(
					new Audio(require('./assets/audio/pause.mp3'))
				).play().finally(() => this.modal = which);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/variables';

	#app {
		background-color: var(--color-background);
		color: var(--color-text, currentColor);
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		margin: 0 auto;
		overflow: auto;
		width: 100%;

		.container {
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			min-height: 100%;
		}
	}

	#games {
		align-items: center;
		display: flex;
		flex-grow: 1;
		flex-flow: row wrap;
		margin-top: calc((2 * var(--size-base)) + var(--size-app-icon) + var(--size-gap) + 1px);
	}

	@media (min-width: #{$media-screen-md}), screen and (orientation: landscape) {
		#games {
			flex-wrap: nowrap;
		}
	}

	@media (min-width: #{$media-screen-md}) {
		#games {
			--size-game-cover: var(--size-game-cover-max, 500px);
		}
	}

	.backdrop-visible {
		#app > *:not(.modal) {
			filter: blur($blur-radius) saturate(.9);
			pointer-events: none;
			user-select: none;
		}

		#games {
			margin-top: 0;
		}
	}

	main + footer {
		box-sizing: border-box;
		color: var(--color-muted);
		font-size: .75rem;
		padding: 0 var(--size-gap);
		text-align: right;
		width: 100%;

		a {
			color: currentColor;

			&:hover,
			&:focus,
			&:active {
				color: var(--color-primary);
			}
		}

		abbr {
			text-decoration: none;
		}
	}
</style>
