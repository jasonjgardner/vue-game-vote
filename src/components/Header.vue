<template>
	<div id="app-header" :class="{'no-voters': voters.length < 1}" role="banner">
		<div id="icons" role="presentation"
			 @click="$emit('showModal', 'instructions')"
		>
			<AppIcon/>
			<HelpIcon/>
		</div>

		<header>
			<h1 class="title" itemprop="name">
				Vote for a Game
			</h1>

			<ul>
				<li>
					<abbr title="Version">Ver.</abbr>
					<a :href="$root.$data.GIT_REPO"
					   class="f-outline"
					   rel="noopener"
					   target="_blank"
					   title="View source on GitHub">
						<span itemprop="softwareVersion">{{ $root.$data.VERSION }}</span>
					</a>
				</li>
				<li>
					<a :href="$root.$data.AUTHOR_URL"
					   class="f-outline"
					   rel="author"
					   itemprop="creator"
					   title="Created by Jason Gardner">
						By Jason
					</a>
				</li>
			</ul>
		</header>

		<form id="voters" class="d-flex">
			<label id="votes-remaining-label" class="sr-only" for="votes-remaining">
				Votes Remaining:
			</label>

			<div class="voters__votes h-focus" :class="{'invalid': voters < 0 || voters > 99, 'pulse': chaChing}">
				<input v-if="!hasVotes || voters > 0"
					   id="votes-remaining"
					   v-model.number="voters"
					   :readonly="hasVotes"
					   :title="`${voters} vote${voters === 1 ? '' : 's'} remaining`"
					   type="number"
					   placeholder="#"
					   max="99" min="0"
					   aria-labelledby="votes-remaining-label"
				>

				<button v-if="hasVotes"
						class="btn"
						type="submit"
						name="choose"
						title="Choose the game"
						@click.prevent="$emit('choose')"
				>
					<CheckIcon/>
					<span class="sr-only">
						Choose
					</span>
				</button>
			</div>

			<Transition name="jump">
				<button v-show="hasVotes"
						class="btn btn--secondary btn--fab h-focus"
						type="reset"
						name="reset"
						title="Reset voting"
						@click.prevent="$emit('reset')"
				>
					<ResetIcon/>
					<span class="sr-only">
						Reset
					</span>
				</button>
			</Transition>

			<button class="btn btn--secondary btn--fab h-focus"
					type="button"
					name="buy"
					title="Pay a coin to buy a vote" @click.prevent="buyVote"
			>
				<CoinIcon class="rotate--90"/>
				<span class="sr-only">
					Buy Vote
				</span>
			</button>
		</form>
	</div>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Check from 'vue-feather-icon/components/check';
	import { Howl } from 'howler';
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
				default: 0,
			},
			hasVotes: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				audio: undefined,
				showInstructions: false,
				chaChing: false
			};
		},
		mounted() {
			this.audio = new Howl({
				src: [require('../assets/audio/coin.ogg'), require('../assets/audio/coin.mp3')],
				autoplay: false,
				loop: false,
				volume: .5,
			});
		},
		methods: {
			/** @description Adds voters and plays confirmation audio
			 * @memberof Header
			 * @event Header#buyVote
			 */
			buyVote() {
				this.chaChing = true;

				this.audio.once('play', () => {
					this.$emit('buyVote');
					setTimeout(() => this.chaChing = false, 100);
				}, this.audio.play());
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables';
	@import '../css/mixins';

	.btn svg {
		stroke: currentColor;
	}

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
		cursor: default;
		display: inline-block;
		font-size: 1rem;
		font-weight: bold;
		margin: 0;
		transition: color .5s ease-out;
	}

	#app-header {
		align-items: center;
		background-color: var(--color-app-header);
		border-bottom: 1px solid var(--color-border);
		box-sizing: border-box;
		display: flex;
		flex-wrap: nowrap;
		left: 0;
		margin: 0;
		min-height: calc((2 * var(--size-gap)) + var(--size-app-icon));
		padding: var(--size-gap) var(--size-base);
		position: sticky;
		transition: border-bottom-color .5s ease-out;
		top: 0;
		width: 100%;
		z-index: $zindex-toolbar;

		header {
			align-items: flex-start;
			color: var(--color-secondary);
			display: flex;
			flex-flow: column nowrap;
			margin: 0 auto 0 var(--size-base);
			padding-bottom: 1px; /// Don't hide link outline
			overflow: hidden;
			text-align: left;
			text-overflow: ellipsis;
			white-space: nowrap;

			a {
				color: var(--color-secondary);
				transition: color .25s ease-in-out;

				&:hover,
				&:focus {
					color: var(--color-text)
				}

				&:active {
					text-decoration: none;
				}
			}

			abbr {
				text-decoration: none;
			}

			p {
				font-size: .825rem;
				margin: 0;
			}

			ul {
				font-size: .75rem;
				margin: 0;
				padding: 0;
			}

			li {
				display: inline-block;
				list-style-type: none;
			}

			li + li {
				border-left: 1px solid var(--color-secondary);
				margin-left: var(--size-gap);
				padding-left: var(--size-gap);
			}
		}

		&:hover,
		&:focus-within {
			border-bottom-color: var(--color-border);

			.title {
				color: var(--color-primary);
			}
		}
	}

	.voters__votes {
		background-color: var(--color-accent);
		border-radius: calc(.5 * var(--size-fab));
		box-shadow: -1px .125rem .25rem rgba(0, 0, 0, .25), 0 .1rem .275rem rgba(0, 0, 0, .25);
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
			max-width: 1.5rem;

			&::selection {
				background-color: rgba(255, 255, 255, .5);
				color: var(--color-primary);
			}

			&:focus {
				color: var(--color-input);
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
			color: var(--color-btn);
			padding-left: .25em;
			padding-right: .45em;

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

	/// When parent has `.vote-cast` class, the remaining votes counter will shrink
	.vote-cast .voters__votes {
		animation: shrink .333s ease-out;
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

	.light-stroke {
		stroke: var(--color-lightest);
	}

	@media screen and (min-width: #{($media-screen-sm)}) {
		#app-header {
			padding-bottom: var(--size-base);
			padding-top: var(--size-base);
		}

		.title {
			margin: 0;
		}
	}

	@media screen and (min-width: #{$media-screen-md}) {
		#app-header {
			--size-fab: 3rem;
			transform: translateX(var(--size-base));
			width: calc(100% - (2 * var(--size-base)));

			&,
			&:hover {
				box-shadow: none;
			}
		}
	}
</style>
