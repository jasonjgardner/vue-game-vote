<template>
	<div id="app"
		 :class="{'no-voters': voters < 1, 'cant-vote': voters < 0, 'modal-visible': showModal || dialogMessage }"
	>
		<section v-if="chosen" id="choice" class="d-flex flex-column flex-1">
			<Selected :chosen="chosen" :games="this.$parent.games" />
		</section>
		<main v-else>
			<header class="app__header">
				<div class="app__icon" role="presentation"
					 @click="showModal = 'instructions'"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46">
						<path d="M20,4V20H4V4H20m2-3H2A1,1,0,0,0,1,2V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1Z"
							  transform="translate(-1 -1)"/>
						<path
							d="M44,4V20H28V4H44m2-3H26a1,1,0,0,0-1,1V22a1,1,0,0,0,1,1H46a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1Z"
							transform="translate(-1 -1)"/>
						<path
							d="M44,28V44H28V28H44m2-3H26a1,1,0,0,0-1,1V46a1,1,0,0,0,1,1H46a1,1,0,0,0,1-1V26a1,1,0,0,0-1-1Z"
							transform="translate(-1 -1)"/>
						<path
							d="M20,28V44H4V28H20m2-3H2a1,1,0,0,0-1,1V46a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V26a1,1,0,0,0-1-1Z"
							transform="translate(-1 -1)"/>
						<line x1="40" y1="30" x2="30" y2="40"/>
						<line x1="30" y1="30" x2="40" y2="40"/>
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46">
						<path
							d="M7.56 38H4.44a.44.44 0 0 0-.44.44v3.12a.44.44 0 0 0 .44.44h3.12a.44.44 0 0 0 .44-.44v-3.12a.44.44 0 0 0-.44-.44zM41.56 4h-3.12a.44.44 0 0 0-.44.44v3.12a.44.44 0 0 0 .44.44h3.12a.44.44 0 0 0 .44-.44V4.44a.44.44 0 0 0-.44-.44zM7.56 4H4.44a.44.44 0 0 0-.44.44v3.12a.44.44 0 0 0 .44.44h3.12A.44.44 0 0 0 8 7.56V4.44A.44.44 0 0 0 7.56 4zM41.56 38h-3.12a.44.44 0 0 0-.44.44v3.12a.44.44 0 0 0 .44.44h3.12a.44.44 0 0 0 .44-.44v-3.12a.44.44 0 0 0-.44-.44z"></path>
						<path
							d="M43 3v40H3V3h40m2-3H1a1 1 0 0 0-1 1v44a1 1 0 0 0 1 1h44a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"></path>
						<path
							d="M32 19.83L27.14 24H25v5h-4v-8h4.47L28 18.85v-2.7L25.5 14h-4.66L18 16.23V19h-4v-4.83q1.13-1.08 2.37-2.1c.82-.68 1.65-1.37 2.47-2.07h8.32L32 14.17zM25 36h-4v-4h4z"></path>
					</svg>
				</div>

				<h1 class="app__title">
					Vote for a Game
				</h1>

				<form id="voters" class="d-flex">
					<label class="sr-only" for="votes-remaining">
						Votes Remaining:
					</label>

					<div class="voters__votes" :class="{'invalid': voters < 0 || voters > 99}">
						<input v-if="!votes.length || voters > 0"
							   id="votes-remaining"
							   v-model.number="voters"
							   :readonly="votes.length > 0"
							   :title="`${voters} vote${voters === 1 ? '' : 's'} remaining`"
							   :blur="voters = Math.max(1, voters)"
							   type="number"
							   placeholder="#"
							   max="99" min="0"
						>

						<button v-if="votes.length"
								class="btn"
								type="submit"
								name="choose"
								title="Choose the game"
								@click.prevent="choose"
						>
							<CheckIcon />
							<span class="sr-only">
								Choose
							</span>
						</button>
					</div>

					<button v-show="votes.length"
							class="btn btn--secondary btn--fab"
							type="reset"
							name="reset"
							title="Reset voting"
							@click.prevent="reset"
					>
						<ResetIcon />
						<span class="sr-only">
							Reset
						</span>
					</button>

					<button class="btn btn--secondary btn--fab"
							type="button"
							name="buy"
							title="Pay a coin to buy a vote" @click.prevent="buyVote"
					>
						<CoinIcon class="rotate--90" />
						<span class="sr-only">
							Buy Vote
						</span>
					</button>
				</form>
			</header>

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

		<Modal v-if="showModal === 'instructions'">
			<h3 slot="header">
				Instructions
			</h3>
			<template slot="body">
				<Component :is="modalComponent" />
			</template>
			<template slot="footer">
				<button class="btn btn--primary" type="button" @click="showModal = false">
					OK
				</button>
			</template>
		</Modal>
	</div>
</template>

<script>
	// @vue/component
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';

	// @vue/component
	import MinusCircle from 'vue-feather-icon/components/minus-circle';

	// @vue/component
	import Check from 'vue-feather-icon/components/check';

	// @vue/component
	import Modal from './components/Modal';

	// @vue/component
	import Dialog from './components/Modal/Dialog';

	// @vue/component
	import Tooltip from './components/Tooltip';

	// @vue/component
	import Game from './components/Game';

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
			Modal,
			Tooltip,
			Alert: Dialog,
			Game,
			Selected: () => import(/* webpackChunkName: "selection" */'./components/Selection'),
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle,
			CheckIcon: Check
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

			document.body.style.setProperty('--size-game-cover', '320px');
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
			/**
			 * Adds voters
			 */
			buyVote() {
				(
					new Audio(require('./assets/coin.mp3'))
				).play().finally(
					() => this.voters = Math.max(1, this.voters + 1)
				);
			},
			modalComponent(resolve, reject) {
				if (this.showModal && this.showModal.length > 0) {
					return import(`./components/Modal/${this.showModal.charAt(0).toUpperCase()
					+ this.showModal.slice(1)}`)
						.then(resolve, reject);
				}

				reject();
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
	@import './css/variables.scss';

	#app {
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		width: 100%;

		> main {
			display: flex;
			flex-flow: column wrap;
			min-height: 100%;
			justify-content: center;
		}
	}

	.app__icon {
		cursor: pointer;
		height: 48px;
		position: relative;
		width: 48px;

		svg {
			fill: white;
			height: 48px;
			position: absolute;
			transition: opacity .15s ease-in, transform .25s cubic-bezier(.68, -.55, .265, 1.55);
			width: 48px;

			line {
				stroke: white;
				stroke-width: 2px;
				stroke-linecap: round;
				stroke-linejoin: round;
			}

			+ svg {
				opacity: 0;
				transform: translate(#{$size-gap * -1}, 0);
			}
		}

		&:hover svg {
			opacity: 0;
			transform: translate(0, #{$size-gap * -1});

			+ svg {
				opacity: 1;
				transform: translate(0, 0);
			}
		}
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
		flex-wrap: nowrap;
		justify-content: space-between;
		left: 0;
		margin: 0;
		padding: $size-base $padding-container;
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
			display: inline-block;
			font-size: 1rem;
			margin-left: $size-base;
			margin-right: auto;
			max-width: 150px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	#games {
		display: flex;
		flex-flow: row wrap;
		margin-top: ($size-base * 2) + 49; /// Header padding + icon height + border bottom

		.game {
			margin-right: 0;
		}
	}

	@media screen and (min-width: #{($media-screen-sm)}) {
		#games .game {
			margin-right: $size-base;
		}

		.app__header {
			align-items: center;
			flex-direction: row;
			justify-content: flex-start;

			.app__title {
				margin: 0 auto 0 $size-base;
			}
		}
	}

	@media screen and (min-width: #{$media-screen-md}) {
		#games {
			--size-game-cover: #{min(480px, $size-game-cover-max)};
			flex-wrap: nowrap;
		}
	}

	.modal-visible #games {
		margin-top: 0;
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
		flex-wrap: nowrap;
		font-size: 1rem;
		justify-content: flex-end;
		text-align: right;

		> .btn {
			margin-left: 1rem;
		}
	}
</style>
