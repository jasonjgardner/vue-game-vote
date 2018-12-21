<template>
	<div id="app" :class="{'no-voters': voters < 1 }" role="application">
		<div v-if="chosen" id="choice"
			 class="d-flex flex-column flex-1"
			 role="doc-conclusion">
			<Selected :chosen="chosen" :games="this.$parent.games"
				@choose="choose"
				@reset="reset"
			/>
		</div>
		<div v-else class="container">
			<AppHeader :voters="voters" :has-votes="votes.length > 0"
			    @showModal="showModal"
				@buyVote="voters = Math.max(1, voters + 1)"
				@choose="choose"
				@reset="reset"
			/>

			<main id="games">
				<Game v-for="game in filteredGames"
					  :key="game.id"
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
					<b>Tap the <span class="text--accent">colored circle</span> to adjust the allotted votes</b> via keyboard input.
					The new value must be between 1 and 99. Set the initial value to the number of voters participating.
				</p>

				<h3>Buying Votes</h3>
				<p>
					The number of remaining votes can also be adjusted by pressing the <b>Coin</b> button. Pay <b>one</b>&nbsp;
					<a href="#mario-coin">Mario coin</a> per additional vote.
				</p>

				<aside id="mario-coin">
					<header>
						<CoinIcon class="rotate--90 light-stroke mr-1 mb-0" />
						<h4>Mario Coins</h4>
					</header>

					<blockquote>
						<p>
							Mario Coins are toy coins embossed with Mario's face. They're given as a reward for good behavior and
							taken away for bad behavior, poor sportsmanship, bitching, moaning, etc.
						</p>
					</blockquote>
				</aside>
			</template>
			<div slot="footer">
				<button class="btn btn--primary" type="button" @click="modal = false">
					OK
				</button>
			</div>
		</Modal>

		<Alert v-if="showNoVoteDialog" :role="'alert'" @dismissed="showNoVoteDialog = false">
			<h4 slot="header">
				Hang on!
			</h4>
			<p slot="message">
				You&rsquo;re out of votes!
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
	import HorizontalScroll from './lib/HorizontalScroll';

	const Scroller = new HorizontalScroll();
	Scroller.attach();

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
	 * @vue-computed {GameData[]} filteredGames - Array of game data filtered by certain parameters
	 */
	export default {
		name: 'App',
		components: {
			AppHeader: Header,
			Game,
			Modal: () => import(/* webpackChunkName: "dialog" */'./components/Dialog/Modal'),
			Alert: () => import(/* webpackChunkName: "dialog" */'./components/Dialog/Alert'),
			Selected: () => import(/* webpackChunkName: "selection" */'./components/Selection'),
			CoinIcon: MinusCircle
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
				voters: undefined
			};
		},
		computed: {
			filteredGames() {
				/** @var {GameData} game - Game data **/
				return this.games.filter(game => game.numberOfPlayers >= this.initialVoters);
			}
		},
		created() {
			this.voters = this.initialVoters;
			document.body.classList.toggle('light-scheme', +(new Date()).getHours() <= 18); /// Light scheme during day
			document.body.classList.add('scrollbar');
		},
		methods: {
			/**
			 * @description Selects a candidate at random
			 */
			choose() {
				this.showNoVoteDialog = false;
				this.modal = false;
				this.chosen = this.votes[Math.floor(Math.random() * this.votes.length)];
				window.scrollTo(0, 0);
			},
			/**
			 * @description Resets votes, vote counts, and selected game
			 */
			reset() {
				this.showNoVoteDialog = false;
				this.modal = false;
				this.errors = 0;
				this.voters = this.initialVoters;
				this.chosen = null;
				this.votes = [];
			},
			onVote(accepted) {
				if (!accepted) {
					this.errors++;
				}

				this.showNoVoteDialog = this.errors > 2;
			},
			showModal(which) {
				this.modal = which;
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/variables';

	#app {
		background-color: var(--color-background);
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		margin: 0 auto;
		width: 100%;

		.container {
			display: flex;
			flex-flow: column wrap;
			justify-content: center;
			min-height: 100%;
		}
	}

	#games {
		display: flex;
		flex-flow: row wrap;
		margin-top: calc((2 * var(--size-base)) + var(--size-app-icon) + 1px);
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
</style>
