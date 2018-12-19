<template>
	<header id="app-header" :class="{'no-voters': voters.length < 1}">
		<div id="icons" role="presentation"
			 @click="$emit('showModal', 'instructions')"
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
			CheckIcon: Check
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
		data() {
			return {
				showInstructions: false
			}
		},
		methods: {
			/**
			 * @description Adds voters and plays confirmation audio
			 * @memberof Header
			 * @event Header#buyVote
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

<style lang="scss">
	.light-scheme {
		--color-app-header: rgba(theme('background', 'light'), .97);
	}
</style>

<style lang="scss" scoped>
	@import '../css/variables';
	@import '../css/mixins';

	#icons {
		cursor: pointer;
		height: var(--size-app-icon);
		position: relative;
		width: var(--size-app-icon);

		svg {
			color: var(--color-text);
			fill: var(--color-text);
			height: var(--size-app-icon);
			position: absolute;
			transition: opacity .15s ease-in, transform .25s cubic-bezier(.68, -.55, .265, 1.55);
			width: var(--size-app-icon);

			line {
				stroke: var(--color-text);
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
		color: var(--color-text);
		display: inline-block;
		font-size: 1rem;
		font-weight: normal;
		margin: 0 auto 0 var(--size-base);
		max-width: 150px;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	#app-header {
		align-items: center;
		background-color: var(--color-app-header, #{rgba(theme('background'), .97)});
		border-bottom: 1px solid var(--color-border);
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
			//box-shadow: 0 2px .3125rem rgba(0, 0, 0, .33), 0 .3125rem 1.5rem rgba(0, 0, 0, .125);
		}
	}

	.voters__votes {
		background-color: var(--color-accent);
		border-radius: calc(.5 * var(--size-fab));
		box-shadow: -1px 1px .25rem rgba(0, 0, 0, .5), 0 0 .275rem rgba(0, 0, 0, .33);
		color: var(--color-fab);
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
			color: var(--color-input);
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
			color: var(--color-btn);
			margin: 0;
			padding-bottom: 0;
			padding-left: 0;
			padding-right: 0;
		}

		input + .btn {
			border-radius: 50%;
			color: var(--color-btn-alt);
			padding-left: .25em;
			padding-right: .45em;

			svg {
				stroke: currentColor;
			}

			&:active {
				animation: none;
				background-color: rgba(0, 0, 0, .5);
			}
		}

		&:focus,
		&:focus-within {
			animation: focus 2s infinite;
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

	@media screen and (min-width: #{$media-screen-md}) {
		#app-header {
			width: calc(100% - (2 * var(--size-base)));
			transform: translateX(var(--size-base));
		}
	}
</style>
