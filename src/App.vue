<template>
	<div id="app"
		 :class="{'no-voters': voters < 1, 'cant-vote': voters < 0, 'modal-visible': showModal || dialogMessage }"
	>
		<section v-if="chosen" id="choice" class="d-flex flex-column flex-1">
			<Selected :chosen="chosen" :games="this.$parent.games"
				@choose="choose"
				@reset="reset"
			/>
		</section>
		<main v-else>
			<Header :voters="voters" :has-votes="votes.length > 0"
				@buyVote="voters = Math.max(1, voters + 1)"
				@choose="choose"
				@reset="reset"
			/>

			<div id="games">
				<Game v-for="game in filteredGames"
					  :key="game.id"
					  :game="game"
					  @vote="onVote"
				/>
			</div>
		</main>

		<Alert v-if="dialogMessage.length > 0" role="alert" @dismissed="dialogMessage = false">
			<h4 slot="header">
				Stop!
			</h4>
			<p slot="message">
				{{ dialogMessage }}
			</p>
			<template slot="footer">
				<button class="btn" type="reset" @click.prevent="reset">
					Reset
				</button>
				<button class="btn" type="submit" @click.prevent="choose">
					Elect
				</button>
			</template>
		</Alert>
	</div>
</template>

<script>
	// @vue/component
	import Header from './components/Header';

	// @vue/component
	import Game from './components/Game';

	let scrollRate = 1;

	function scrollX (event) {
		if (event.delta !== 0 && !document.body.classList.contains('backdrop-visible')) {
			window.scroll(window.scrollX + event.deltaY * scrollRate, window.scrollY);
			event.preventDefault();
		}
	}

	function resetScroll() {
		if (document.body.scrollHeight > document.body.clientHeight) { /// Has vertical scroll
			/// Turn off `scrollX`
			window.removeEventListener('wheel', scrollX);
			return;
		}

		window.addEventListener('wheel', scrollX);
	}

	window.addEventListener('resize', resetScroll);
	resetScroll();

	/**
	 * Game votes app
	 * @vue-prop {Object[]} games - Array of game data objects
	 * @vue-prop {Number} initialVoters - Number of votes initially allotted
	 * @vue-data {Number} errors - Number of votes cast after allotted votes have been used
	 * @vue-data {Object[]} votes - Array of game data objects for which votes have been cast
	 * @vue-data {Object} chosen - Selected game's data
	 * @vue-data {Boolean|String} showModal - Shows a specific modal when set to a string ID. Set to `false` to hide modal
	 * @vue-data {Boolean|String} dialogMessage - Displays a dialog if a string value is set. Hides the dialog if `false`
	 * @vue-data {Number} voters - Number of votes remaining
	 * @vue-computed {Object[]} filteredGames - Array of game data filtered by certain parameters
	 */
	export default {
		name: 'App',
		components: {
			Header,
			Game,
			Alert: () => import(/* webpackChunkName: "modal" */'./components/Modal/Dialog'),
			Selected: () => import(/* webpackChunkName: "selection" */'./components/Selection'),
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
		data: function () {
			return {
				errors: 0,
				votes: [],
				chosen: null,
				showModal: false,
				dialogMessage: false,
				voters: undefined
			};
		},
		computed: {
			filteredGames() {
				/** @var {{numberOfPlayers:number}} game - Game data **/
				return this.games.filter(game => game.numberOfPlayers >= this.initialVoters);
			}
		},
		created() {
			this.voters = this.initialVoters;

			//document.body.style.setProperty('--size-game-cover', '320px');
		},
		methods: {
			/**
			 * Selects a candidate at random
			 */
			choose() {
				this.dialogMessage = false;
				this.showModal = false;
				this.chosen = this.votes[Math.floor(Math.random() * this.votes.length)];
				window.scrollTo(0, 0);
			},
			/**
			 * Resets votes, vote counts, and selected game
			 */
			reset() {
				this.dialogMessage = false;
				this.showModal = false;
				this.errors = 0;
				this.voters = this.initialVoters;
				this.chosen = null;
				this.votes = [];
			},
			onVote(accepted) {
				if (!accepted) {
					this.errors++;
				}

				if (this.errors > 2) {
					this.dialogMessage = 'You\'re out of votes!';
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/variables';

	#app {
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		width: 100%;

		& > main {
			display: flex;
			flex-flow: column wrap;
			min-height: 100%;
			justify-content: center;
		}
	}

	#games {
		display: flex;
		flex-flow: row wrap;
		margin-top: (2 * $size-base) + $size-app-icon + 1;
	}

	@media (min-width: #{$media-screen-sm}) {
		#games {
			flex-wrap: nowrap;
		}
	}

	@media (min-width: #{$media-screen-md}) {
		#games {
			--size-game-cover: var(--size-game-cover-max, 500px);
		}
	}

	@media screen and (orientation: landscape) {
		#games {
			flex-wrap: nowrap;
		}
	}

	.modal-visible #games {
		margin-top: 0;
	}
</style>
