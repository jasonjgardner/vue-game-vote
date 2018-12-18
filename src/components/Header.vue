<template>
	<header id="app-header" :class="{'no-voters': voters.length < 1}">
		<div id="icons" role="presentation"
			 @click="showInstructions = true"
		>
			<AppIcon />
			<HelpIcon />
		</div>

		<h1 class="title">
			Vote for a Game
		</h1>

		<form id="voters" class="d-flex">
			<label class="sr-only" for="votes-remaining">
				Votes Remaining:
			</label>

			<div class="voters__votes" :class="{'invalid': voters < 0 || voters > 99}">
				<input v-if="!hasVotes || voters > 0"
					   id="votes-remaining"
					   v-model.number="voters"
					   :readonly="hasVotes"
					   :title="`${voters} vote${voters === 1 ? '' : 's'} remaining`"
					   :blur="voters = Math.max(1, voters)"
					   type="number"
					   placeholder="#"
					   max="99" min="0"
				>

				<button v-if="hasVotes"
						class="btn"
						type="submit"
						name="choose"
						title="Choose the game"
						@click.prevent="$emit('choose')"
				>
					<CheckIcon />
					<span class="sr-only">
						Choose
					</span>
				</button>
			</div>

			<button v-if="hasVotes"
					class="btn btn--secondary btn--fab"
					type="reset"
					name="reset"
					title="Reset voting"
					@click.prevent="$emit('reset')"
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

		<Modal v-if="showInstructions" id="instructions">
			<h3 slot="header">
				Instructions
			</h3>
			<template slot="body">
				<h2 class="mt-0">
					Voting
				</h2>
				<p>
					The number of remaining votes is displayed inside a circle positioned in the upper
					right corner of the app.
				</p>

				<p>
					<b>Tap the <span class="text--accent">green</span> circle to adjust the allotted votes</b> via keyboard input.
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
			<template slot="footer">
				<button class="btn btn--primary" type="button" @click="showInstructions = false">
					OK
				</button>
			</template>
		</Modal>
	</header>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Check from 'vue-feather-icon/components/check';

	import AppIcon from '../assets/icon.svg';
	import HelpIcon from '../assets/help.svg';

	/**
	 * App header component
	 * @module Header
	 * @vue-prop {number} voters - Number of votes remaining
	 * @vue-prop {boolean} [hasVotes=false] - `true` if votes are available, otherwise `false`
	 * @vue-data {boolean} [showInstructions=false] - Set to `true` to show instructions modal, or `false` to hide it
	 */
	export default {
		name: 'Header',
		components: {
			AppIcon,
			HelpIcon,
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle,
			CheckIcon: Check,
			Modal: () => import(/* webpackChunkName: "modal" */'./Modal')
		},
		props: {
			voters: {
				type: Number,
				required: true,
				default: 0
			},
			hasVotes: {
				type: Boolean,
				default: false
			}
		},
		data: () => {
			return {
				showInstructions: false
			}
		},
		methods: {
			/**
			 * @description Adds voters and plays confirmation audio
			 * @memberof Header
			 */
			buyVote() {
				(
					new Audio(require('../assets/coin.mp3'))
				).play().finally(() => {
					this.$emit('buyVote')
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables';
	@import '../css/mixins';

	#icons {
		cursor: pointer;
		height: var(--size-app-icon);
		position: relative;
		width: var(--size-app-icon);

		svg {
			color: var(--color-lightest);
			fill: var(--color-lightest);
			height: var(--size-app-icon);
			position: absolute;
			transition: opacity .15s ease-in, transform .25s cubic-bezier(.68, -.55, .265, 1.55);
			width: var(--size-app-icon);

			line {
				stroke: var(--color-lightest);
				stroke-width: 2px;
				stroke-linecap: round;
				stroke-linejoin: round;
			}

			+ svg {
				opacity: 0;
				transform: translate(calc(-1 * var(--size-gap)), 0);
			}
		}

		&:hover svg {
			opacity: 0;
			transform: translate(0, calc(-1 * var(--size-gap)));

			+ svg {
				opacity: 1;
				transform: translate(0, 0);
			}
		}
	}

	.title {
		display: inline-block;
		font-size: 1rem;
		font-weight: normal;
		margin: 0 auto 0 var(--size-base);
		max-width: 150px;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
		white-space: nowrap;
	}

	#app-header {
		align-items: center;
		background-color: rgba(theme('background'), .97);
		border-bottom: 1px solid rgba($color-lightest, .66);
		box-shadow: 0 2px .3125rem rgba(0, 0, 0, .66), 0 .3125rem 1.5rem rgba(0, 0, 0, .33);
		box-sizing: border-box;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		left: 0;
		margin: 0;
		padding: var(--size-base);
		position: fixed;
		transition: border-bottom-color .5s ease-out;
		top: 0;
		width: 100%;
		z-index: $zindex-toolbar;

		&:hover,
		&:focus-within {
			border-bottom-color: var(--color-border);
		}
	}

	.voters__votes {
		background-color: var(--color-accent);
		border-radius: calc(.5 * var(--size-fab));
		box-shadow: -1px 1px 3px rgba(0, 0, 0, .5), 0 0 5px rgba(0, 0, 0, .33);
		color: $color-dark;
		display: flex;
		height: var(--size-fab);
		justify-content: center;
		min-width: var(--size-fab);
		text-align: center;
		transition: background-color .333s ease-in-out;

		&.invalid {
			background-color: var(--color-assertive);
		}

		input {
			background-color: transparent;
			border: 0;
			color: $color-dark;
			font-weight: bold;
			text-align: right;
			width: 1.5rem;

			&::selection {
				background-color: rgba(255, 255, 255, .5);
				color: var(--color-primary);
			}

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
			border-radius: 50%;
			padding-left: .25em;
			padding-right: .45em;

			&:active {
				animation: none;
				background-color: rgba(0, 0, 0, .5);
			}
		}

		&:focus,
		&:focus-within {
			background-color: var(--color-focus);
			color: var(--color-btn-background);
			outline: none;
		}
	}

	.no-voters .voters__votes {
		border-radius: 50%;
		width: var(--size-fab);
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

	aside header {
		align-items: center;
		display: flex;

		#{$--hn} {
			margin-bottom: var(--size-gap);
			margin-top: var(--size-gap);
		}
	}

	blockquote {
		font-size: .825rem;
	}

	.light-stroke {
		stroke: var(--color-lightest);
	}

	@media screen and (min-width: #{($media-screen-sm)}) {
		header {
			align-items: center;
			flex-direction: row;
			justify-content: flex-start;
		}

		.title {
			margin: 0 auto 0 var(--size-base);
		}
	}
</style>
