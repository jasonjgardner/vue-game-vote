<template>
	<div id="app"
		 :class="{'light-scheme': prefersLightScheme, 'sweet-fx': fxEnabled }"
		 role="application"
		 itemscope itemtype="http://schema.org/WebApplication">
		<Transition name="fade">
			<div v-if="chosen" id="choice"
				 class="d-flex flex-column flex-1"
				 role="doc-conclusion">
				<GameSelection :chosen="chosen"
							   :games="games"
							   :votes="votes"
							   @choose="choose"
							   @reset="reset"
				/>
			</div>
			<div v-else class="container"
				 :class="{'no-voters': voters < 1, 'vote-cast': voteCast}">
				<HeaderControls :voters="voters" :has-votes="votes.length > 0"
								@buyVote="voters = Math.max(1, voters + 1)"
								@choose="choose"
								@reset="reset"
								@show="show"
				/>

				<main id="games" class="scrollbar" @wheel="scrollX">
					<VideoGame v-for="game in filteredGames"
							   :key="game.id"
							   :voters="voters"
							   :tally="votes.filter(vote => vote.id === game.id).length"
							   :game="game"
							   @vote="onVote"
					/>
				</main>

				<portal v-if="shown === 'dialog'" to="overlay">
					<AlertDialog role="alert" @dismissed="shown = false">
						<h4 slot="header">
							{{ ['Hang on!', 'Wait!', 'Woops']|random }}
						</h4>
						<p slot="message">
							{{ ['You\'re out of votes!', 'We\'ve run out of votes! Are you ready to decide?']|random }}
						</p>
						<template slot="footer">
							<button class="btn btn--wide" type="reset" @click.prevent="reset">Reset</button>
							<button class="btn btn--wide" type="submit" @click.prevent="choose">Elect</button>
						</template>
					</AlertDialog>
				</portal>
				<portal v-else-if="shown === 'settings'" to="overlay">
					<SettingsControls
						:settings="{
							theme: prefersLightScheme ? 'light' : 'dark'
						}"
						@dismissed="shown = false"
						@change="applySettings"
					/>
				</portal>
			</div>
		</Transition>

		<portal-target name="overlay"></portal-target>
	</div>
</template>

<script>
	import HeaderControls from '@/components/HeaderControls';
	import VideoGame from '@/components/VideoGame';
	import HowlerMixin from '@/lib/HowlerMixin';

	/**
	 * Game votes app
	 * @vue-prop {GameData[]} games - Array of game data objects
	 * @vue-prop {Number} initialVoters - Number of votes initially allotted
	 * @vue-data {Number} errors - Number of votes cast after allotted votes have been used
	 * @vue-data {GameData[]} votes - Array of game data objects for which votes have been cast
	 * @vue-data {Object} chosen - Selected game's data
	 * @vue-data {Boolean|String} dialogMessage - Displays a dialog if a string value is set. Hides the dialog if `false`
	 * @vue-data {Number} voters - Number of votes remaining
	 * @vue-data {Boolean} prefersLightScheme - Whether or not to enable light scheme. Defaults to `true` during daytime
	 * @vue-data {Boolean} [voteCast=false] - Is set to `true` when a vote has been placed, then reverts back to `false`
	 * @vue-computed {GameData[]} filteredGames - Array of game data filtered by certain parameters
	 */
	export default {
		name: 'App',
		components: {
			HeaderControls,
			VideoGame,
			SettingsControls: () => import(
				/* webpackChunkName: "settings" */
				/* webpackMode: "lazy" */
				'@/components/SettingsControls'
			),
			AlertDialog: () => import(
				/* webpackChunkName: "dialog" */
				/* webpackMode: "lazy" */
				'@/components/Dialog/AlertDialog'
				),
			GameSelection: () => import(
				/* webpackChunkName: "selection" */
				/* webpackMode: "lazy" */
				'@/components/GameSelection'
				)
		},
		mixins: [HowlerMixin],
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
				shown: false,
				voters: this.initialVoters,
				prefersLightScheme: +(
					new Date()
				).getHours() <= 18,
				fxEnabled: true,
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
			import(
				/* webpackChunkName: "typekit" */
				/* webpackPrefetch: true */
				'@/lib/TypekitLoader'
				).then(loader => loader.default('apf6wfj'));

			import(
				/* webpackChunkName: "analytics" */
				/* webpackMode: "lazy" */
				'@/lib/googleAnalytics'
				).then(loader => loader.default(process.env.VUE_APP_GA_TRACKING));
		},
		mounted() {
			if (window.localStorage.colorScheme) {
				this.prefersLightScheme = window.localStorage.getItem('colorScheme') === 'light';
			}
		},
		methods: {
			/** @description Selects a candidate at random */
			choose() {
				this.shown = false;

				if (this.chosen) {
					this.votes = this.votes.filter(vote => vote.id !== this.chosen.id);
				}

				this.chosen = this.votes[Math.floor(Math.random() * this.votes.length)];

				window.scrollTo(0, 0);
			},
			/** @description Resets votes, vote counts, and selected game */
			reset() {
				this.shown = false;
				this.errors = 0;
				this.voters = this.initialVoters;
				this.chosen = null;
				this.votes = [];
			},
			show(what) {
				this.shown = what || false;
			},
			onVote(game) {
				let ok = this.voters > 0;

				if (ok) {
					this.play('click').finally(() => this.votes.push(game));
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
					this.shown = 'dialog';
				}

				/// Trigger transitions and animations in child components
				window.requestAnimationFrame(() => {
					this.voteCast = true;
					setTimeout(() => this.voteCast = false, 100);
				});
			},
			applySettings(settings) {
				console.log(settings);
			},
			scrollX(event) {
				/// Translate vertical scrolling into horizontal scrolling
				//noinspection JSSuspiciousNameCombination
				event.target.scrollLeft += event.deltaY;
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
	}

	@media (min-width: #{$media-screen-md}), screen and (orientation: landscape) {
		#games {
			flex-wrap: nowrap;
		}
	}

	@media (min-width: #{$media-screen-md}) {
		#games {
			--size-game-cover: var(--size-game-cover-max, #{min($media-screen-md, $size-game-cover-max)});
		}
	}

	.backdrop-visible {
		#app > *:not(.vue-portal-target) {
			box-shadow: none;
			filter: blur($blur-radius) saturate(.9) drop-shadow(0 0 0 transparent);
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
