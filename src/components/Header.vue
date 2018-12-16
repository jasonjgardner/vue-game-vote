<template>
	<header id="app-header" :class="{'no-voters': voters.length < 1}">
		<div id="icons" role="presentation"
			 @click="showInstructions = true"
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
						<CoinIcon class="rotate--90 white-stroke mr-1 mb-0" />
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
	// @vue/component
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';

	// @vue/component
	import MinusCircle from 'vue-feather-icon/components/minus-circle';

	// @vue/component
	import Check from 'vue-feather-icon/components/check';

	export default {
		name: 'Header',
		components: {
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
			 * Adds voters
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
	@import '../css/_variables.scss';

	#icons {
		cursor: pointer;
		height: $size-app-icon;
		position: relative;
		width: $size-app-icon;

		svg {
			fill: white;
			height: $size-app-icon;
			position: absolute;
			transition: opacity .15s ease-in, transform .25s cubic-bezier(.68, -.55, .265, 1.55);
			width: $size-app-icon;

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

	.title {
		display: inline-block;
		font-size: 1rem;
		font-weight: normal;
		margin: 0 auto 0 $size-base;
		max-width: 150px;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
		white-space: nowrap;
	}

	#app-header {
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

	aside header {
		align-items: center;
		display: flex;

		#{$--hn} {
			margin-bottom: $size-gap;
			margin-top: $size-gap;
		}
	}

	blockquote {
		font-size: .825rem;
	}

	.white-stroke {
		stroke: white;
	}

	@media screen and (min-width: #{($media-screen-sm)}) {
		header {
			align-items: center;
			flex-direction: row;
			justify-content: flex-start;
		}

		.title {
			margin: 0 auto 0 $size-base;
		}
	}
</style>
