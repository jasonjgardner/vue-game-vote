<template>
	<div class="app__header" :class="{'no-voters': voters.length < 1}" role="banner">
		<div id="icons" role="presentation"
			 @click="openInstructions"
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

		<form id="voters">
			<div class="flex-item">
				<label id="votes-remaining-label" class="sr-only" for="votes-remaining">
					Votes Remaining:
				</label>

				<div class="voters__votes btn--shadow--lg h-focus"
					 :class="{'invalid': voters < 0 || voters > 99, 'pulse': chaChing, 'has-votes-cast': hasVotes, 'has-votes-remaining': voters > 0}">
					<input id="votes-remaining"
						   v-model.number="voters"
						   :readonly="hasVotes"
						   :title="`${voters} vote${voters === 1 ? '' : 's'} remaining`"
						   type="number"
						   placeholder="#"
						   max="99" min="0"
						   aria-labelledby="votes-remaining-label"
					>

					<button v-show="hasVotes"
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
			</div>
			<!-- /.flex-item -->

			<div class="flex-item">
				<Transition name="jump">
					<button v-if="hasVotes"
							class="btn btn--secondary btn--fab btn--shadow h-focus"
							type="button"
							name="reset"
							title="Reset voting"
							@click="reset"
					>
						<ResetIcon/>
						<span class="sr-only">Reset</span>
					</button>
				</Transition>
			</div>
			<!-- /.flex-item -->

			<div class="flex-item">
				<button class="btn btn--secondary btn--fab btn--shadow h-focus"
						type="button"
						name="buy"
						title="Pay a coin to buy a vote" @click="buyVote"
				>
					<CoinIcon class="rotate-90"/>
					<span class="sr-only">Buy Vote</span>
				</button>
			</div>
			<!-- /.flex-item -->

			<div class="flex-item mr-1">
				<button class="btn btn--secondary btn--fab btn--shadow h-focus"
						type="button"
						name="show-settings"
						title="Settings"
						@click="$emit('show', 'settings')"
				>
					<SettingsIcon/>
					<span class="sr-only">Settings</span>
				</button>
			</div>
			<!-- /.flex-item -->
		</form>

		<portal v-if="showInstructions" to="overlay">
			<Modal aria-modal="true"
				   :aria-hidden="!showInstructions"
				   @dismissed="showInstructions = false">
				<template slot="header">
					<InfoIcon class="mr-1 stroke-current-color"/>
					<h2>Information</h2>
				</template>
				<template slot="body">
					<article>
						<h3>Voting</h3>

						<p>
							The number of remaining votes is displayed inside a circle positioned in the upper
							right corner of the app.
						</p>

						<p>
							<strong>Tap the <span class="text--accent">circle</span> to adjust the allotted
								votes</strong> via
							keyboard input.
							The new value must be between 1 and 99. Set the initial value to the number of voters
							participating.
						</p>

						<h3>Buying Votes</h3>
						<p>
							The number of remaining votes can also be adjusted by pressing the <b>Coin</b> button. Pay
							<b>one <a href="#mario-coin">Mario coin</a></b> per additional vote.
						</p>

						<aside id="mario-coin">
							<header class="d-flex align--center">
								<CoinIcon class="rotate-90 mr-1 mb-0 mt-0 stroke-current-color"/>
								<h4 class="mb-0 mt-0">Mario Coins</h4>
							</header>

							<blockquote>
								<p>
									Mario Coins are toy coins embossed with Mario's face. They're given as a reward for
									good
									behavior and
									taken away for bad behavior, poor sportsmanship, bitching, moaning, etc.
								</p>
							</blockquote>
						</aside>
					</article>

					<hr>

					<section>
						<h3>Application Information</h3>

						<dl class="dl--horizontal dl--striped">
							<dt>Last Updated</dt>
							<dd>
								<time itemprop="dateModified">{{ $root.$data.BUILD_TIME }}</time>
							</dd>
							<dt>Browser Support</dt>
							<dd>
								<ul>
									<li><strong itemprop="browserRequirements">Chrome 70+</strong></li>
									<li>Edge 17+</li>
									<li>Firefox 63+</li>
									<li>Opera 56+</li>
									<li>Safari 12+</li>
								</ul>
							</dd>
						</dl>
					</section>
				</template>
				<template slot="footer">
					<button class="btn btn--primary btn--wide btn--shadow h-focus" type="button"
							@click="showInstructions = false">
						OK
					</button>
				</template>
			</Modal>
		</portal>
	</div>
</template>

<script>
	import RotateCcw from 'vue-feather-icon/components/rotate-ccw';
	import MinusCircle from 'vue-feather-icon/components/minus-circle';
	import Check from 'vue-feather-icon/components/check';
	import InfoIcon from 'vue-feather-icon/components/info';
	import SettingsIcon from 'vue-feather-icon/components/settings';
	import AppIcon from '@/assets/img/icon.svg';
	import HelpIcon from '@/assets/img/help.svg';
	import HowlerMixin from '@/lib/HowlerMixin';
	import { EventBus } from '@/main';

	/**
	 * App header component
	 * @module Header
	 * @vue-prop {number} voters - Number of votes remaining
	 * @vue-prop {boolean} [hasVotes=false] - `true` if votes are available, otherwise `false`
	 * @vue-data {boolean} [showInstructions=false] - Set to `true` to show instructions modal, or `false` to hide it
	 */
	export default {
		name: 'HeaderControls',
		components: {
			AppIcon,
			HelpIcon,
			InfoIcon,
			SettingsIcon,
			ResetIcon: RotateCcw,
			CoinIcon: MinusCircle,
			CheckIcon: Check,
			Modal: () => import(/* webpackChunkName: "dialog" */'./Dialog/Modal')
		},
		mixins: [HowlerMixin], /// FIXME: Make mixin share $_enableAudio setting
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
				showInstructions: false,
				chaChing: false
			};
		},
		methods: {
			/** @description Adds voters and plays confirmation audio
			 * @memberof Header
			 * @event Header#buyVote
			 */
			buyVote() {
				this.chaChing = true;

				EventBus.$emit('howl', 'coin', () => {
					this.$emit('buyVote');
					this.chaChing = false;
				});
			},
			reset() {
				window.requestAnimationFrame(() => {
					EventBus.$emit('howl', 'load', () => this.$emit('reset'));
				});
			},
			openInstructions() {
				window.requestAnimationFrame(() => {
					EventBus.$emit('howl', 'pause', () => this.showInstructions = true);
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '~@/css/_variables';
	@import '~@/css/_mixins';

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

	.sweet-fx #icons svg {
		transition: fill .5s ease-out, stroke .5s ease-out, opacity .15s ease-in, transform .25s cubic-bezier(.68, -.55, .265, 1.55);
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

	.app__header {
		align-items: center;
		background-color: var(--color-app__header);
		border-bottom: 1px solid var(--color-border);
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
			border-bottom-color: var(--color-border-alt, var(--color-border));

			.title {
				color: var(--color-primary);
			}
		}
	}

	.voters__votes {
		background-color: var(--color-accent);
		border-radius: calc(.5 * var(--size-fab));
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

		.btn {
			background-color: transparent;
			color: var(--color-btn);
			margin: 0;
			padding-bottom: 0;
			padding-left: 0;
			padding-right: 0;
		}

		&:focus,
		&:focus-within {
			animation: focus 2s infinite;
			background-color: var(--color-focus);
			color: var(--color-btn-background);
			outline: none;
		}
	}

	#votes-remaining {
		background-color: transparent;
		border: 0;
		color: var(--color-input);
		display: none;
		font-weight: bold;
		text-align: center;
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

	.has-votes-remaining #votes-remaining {
		display: inline-block;
		text-align: center;
	}

	.has-votes-cast #votes-remaining {
		text-align: right;
	}

	#votes-remaining + .btn {
		border-radius: 50%;
		color: var(--color-btn);

		&:active {
			animation: none;
			background-color: rgba(0, 0, 0, .5);
		}
	}

	.has-votes-cast.has-votes-remaining #votes-remaining + .btn {
		padding-left: .25em;
		padding-right: .45em;
	}

	/// When parent has `.vote-cast` class, the remaining votes counter will shrink
	.sweet-fx .vote-cast .voters__votes {
		animation: shrink .333s ease-out;
	}

	.no-voters .voters__votes {
		border-radius: 50%;
		width: var(--size-fab);
	}

	.sweet-fx .no-voters .voters__votes {
		animation: jump 1s ease-out;
		animation-delay: 5s;
		animation-iteration-count: 10;
	}

	.sweet-fx .no-voters.vote-cast .voters__votes {
		animation-name: pulse;
	}

	#voters {
		align-items: center;
		display: flex;
		flex-wrap: nowrap;
		font-size: 1rem;
		justify-content: flex-end;
		text-align: right;

		.flex-item {
			flex-grow: 1;
			flex-shrink: 1;
			max-width: calc(var(--size-fab) + 2em);

			&:empty {
				margin-left: 0 !important;
				max-width: 0;
				transition: max-width .333s cubic-bezier(.175, .885, .32, 1.275), margin-left .333s;
			}
		}

		.flex-item + .flex-item {
			margin-left: 1rem;
		}
	}

	.light-stroke {
		stroke: var(--color-lightest);
	}

	@media screen and (min-width: #{($media-screen-sm)}) {
		.app__header {
			padding-bottom: var(--size-base);
			padding-top: var(--size-base);
		}

		.title {
			margin: 0;
		}
	}

	@media screen and (min-width: #{$media-screen-md}) {
		.app__header {
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
