<template>
	<Transition appear name="fade">
		<main class="choice__results" aria-labelledby="choice-intro">
			<p id="choice-intro" class="text--secondary mb-0" role="heading">
				<RandomText :choices="randomTitles" :html="true"/>
			</p>

			<div class="choice__details" itemscope
				 itemtype="http://schema.org/VideoGame"
				 aria-labelledby="choice-name">
				<div class="choice__header">
					<CheckCircle aria-hidden="true"/>
					<h2 id="choice-name" class="choice__title" itemprop="name">
						{{ chosen.name }}
					</h2>
				</div>

				<figure class="choice__cover">
					<img class="focus" itemprop="image"
						 :src="require(`../${chosen.image}`)"
						 :alt="chosen.name"
						 role="presentation"
						 aria-labelledby="choice-name"
					>

					<figcaption>
						<dl>
							<dt>Developer</dt>
							<dd itemprop="developer">{{ chosen.developer }}</dd>
							<dt>Publisher</dt>
							<dd itemprop="publisher">{{ chosen.publisher }}</dd>
							<dt>Players</dt>
							<dd>
								<span itemprop="numberOfPlayers">{{ chosen.numberOfPlayers }}</span>&nbsp;
								<span class="text--secondary" itemprop="playMode">({{ chosen.playMode }})</span>
							</dd>
						</dl>

						<div v-if="chosen.hasOwnProperty('contentRating')">
							<span class="sr-only" itemprop="contentRating"
								  :aria-label="`Rated ${chosen.contentRating} by ESRB`">
								{{ chosen.contentRating }}
							</span>

							<img id="esrb-icon" :src="require(`../assets/esrb/${chosen.contentRating}.png`)"
								 :alt="`ESRB rating ${chosen.contentRating}`"
								 :title="`Rated ${chosen.contentRating}`"
							>
						</div>

						<p v-if="chosen.familyFriendly"><small>This is a <b>family-friendly</b> game.</small></p>
					</figcaption>
				</figure>
			</div>

			<table title="The results are in!">
				<thead>
				<tr>
					<th>Choice</th>
					<th>Votes</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="game in poll" :key="game.id" :class="{'selected': game.chosen}">
					<td>{{ game.name }}</td>
					<td class="text--center" :aria-label="`${game.total} vote(s)`">
						{{ game.total }}
					</td>
				</tr>
				</tbody>
				<caption>Voting Results</caption>
			</table>

			<div class="choice__actions" role="form">
				<button v-if="canPickAgain"
						ref="repick"
						class="btn btn--secondary text--accent"
						type="button"
						name="repick"
						@click="pickAgain"
				>
					Pick Again
				</button>
				<button ref="restart" class="btn btn--primary"
						type="reset"
						name="restart"
						@click.prevent="$emit('reset')"
				>
					Start Over
				</button>
			</div>
		</main>
	</Transition>
</template>

<script>
	import CheckCircle from 'vue-feather-icon/components/check-circle';
	import RandomText from './RandomString';

	/**
	 * Game selection component
	 * @module Selection
	 * @requires RandomText
	 * @requires CheckCircle
	 * @vue-prop {GameData} chosen - Selected game's data
	 * @vue-data {Number} picks - Number of times the selection has been repicked. Used to apply conditional title
	 * @vue-computed {Boolean} canPickAgain - True if another game can be selected, or false if the voting process needs to be restarted
	 * @vue-computed {Object<string, GameData>} poll - The number of votes tallied for the selected game, along with game data
	 * @vue-computed {String} randomTitles - Returns a humorous random title
	 */
	export default {
		name: 'Selection',
		components: {
			CheckCircle,
			RandomText
		},
		props: {
			chosen: {
				type: Object,
				default: () => {
					return {};
				},
				id: {
					type: String,
					required: true,
				},
				name: {
					type: String,
					required: true,
				},
				image: {
					type: String,
					required: true,
				},
				developer: String,
				publisher: String,
				gamePlatform: String,
				familyFriendly: Boolean,
				contentRating: {
					type: String,
					required: false,
					validator: rating => ['RP', 'EC', 'E', 'E10+', 'T', 'M', 'AO'].indexOf(rating) > -1,
				},
				playMode: {
					type: String,
					required: false,
					validator: gamePlayMode => ['CoOp', 'MultiPlayer', 'SinglePlayer'].indexOf(gamePlayMode) > -1,
				},
				numberOfPlayers: {
					type: Number,
					default: 1,
				},
			},
		},
		data() {
			return {
				picks: 0,
			};
		},
		computed: {
			canPickAgain() {
				return [...new Set(this.$parent.votes)].length > 1;
			},
			poll() {
				let results = {};

				for (const vote of this.$parent.votes) {
					results[vote.id] = {
						...vote,
						total: this.$parent.votes.filter(v => v.id === vote.id).length,
						chosen: this.chosen.id === vote.id,
					};
				}

				return results;
			},
			randomTitles() {
				if (this.picks <= 0 && [...new Set(this.$parent.votes)].length === 1) {
					return ['It\'s unanimous!', 'We\'ve agreed on'];
				}

				return ['Let&rsquo;s play&hellip;', 'How about&hellip;'];
			},
		},
		methods: {
			/**
			 * @description Repicks a game
			 * @memberof Selection
			 * @event Selection#choose
			 * @event Selection#reset
			 */
			pickAgain() {
				this.picks++;
				this.$parent.votes = this.$parent.votes.filter(vote => vote.id !== this.chosen.id);

				this.$emit(this.$parent.votes.length > 0 ? 'choose' : 'reset');
			}
		},
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables';
	@import '../css/mixins';

	#esrb-icon {
		height: auto;
		max-width: calc(4 * var(--size-base));
	}

	.choice__details {
		margin: 0 auto;
	}

	.choice__header {
		align-items: center;
		display: flex;
		margin-bottom: 1rem;

		svg {
			stroke: var(--color-primary);
		}
	}

	.choice__title {
		display: inline-block;
		font-size: 2rem;
		font-weight: normal;
		line-height: 1.5;
		margin: 0 0 0 1rem;
	}

	.choice__cover {
		display: flex;
		flex-flow: column nowrap;
		margin: 0 auto calc(2 * var(--size-base));
		max-width: 90vw;
		width: 100%;

		> img {
			filter: drop-shadow(1px .125rem 1.125rem rgba(0, 0, 0, .75));
			height: 100%;
			margin: 0 auto;
			max-height: $size-game-cover-max;
			max-width: $size-game-cover-max;
			object-fit: fill;
			width: 100%;
		}
	}

	.choice__results {
		margin: 0 auto;
		max-width: calc(2 * var(--size-game-cover));
		width: 90%;
	}

	.choice__actions {
		background-color: var(--color-background);
		border-top: 1px solid var(--color-border);
		bottom: 0;
		box-shadow: 0 -.5rem .4rem -.3rem rgba(0, 0, 0, .125);
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		left: 0;
		margin: auto 0 0;
		padding: 1.5rem 1rem;
		position: fixed;
		width: 100%;

		.btn {
			box-shadow: -1px .125rem .25rem rgba(0, 0, 0, .125), 0 0 .275rem rgba(0, 0, 0, .25);
			display: block;
			flex: 1;
			max-width: $size-game-cover-max;
			padding: 1em;

			&:only-child {
				margin-left: auto;
			}
		}

		.btn + .btn {
			margin-left: var(--size-base);
		}
	}

	.chosen-enter {
		opacity: 1;
	}

	.chosen-leave-active {
		opacity: 0;
	}

	caption {
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
		margin-bottom: 8rem;
		width: 100%;
	}

	thead {
		background-color: var(--color-background-table-row-alt);
		border-bottom: 1px solid var(--color-border);
	}

	tbody tr {
		background-color: var(--color-background-table-row);

		&:hover,
		&:focus-within {
			background-color: var(--color-background-alt);
		}

		&:nth-child(even) {
			background-color: var(--color-background-table-row-alt);
		}
	}

	th {
		color: var(--color-secondary);
		padding: .5em;

		&:first-child {
			text-align: left;
		}
	}

	td {
		border: 0;
		color: var(--color-text);
		margin: 0;
		padding: .25em .5em;
	}

	.selected {
		color: var(--color-accent);
		border-left: 2px solid var(--color-accent);

		td {
			color: var(--color-accent);
		}
	}

	dl {
		font-size: .925rem;
		margin-left: auto;
		margin-right: auto;
		width: calc(15 * var(--size-base));
	}

	dt,
	dd {
		margin-bottom: var(--size-gap);
		overflow: hidden;
		padding: var(--size-gap);
		text-overflow: ellipsis;
	}

	dt {
		--size-term: calc(5 * var(--size-base));
		border-bottom: 1px solid var(--color-border);
		color: var(--color-secondary);
		float: left;
		font-size: .875em;
		font-weight: bold;
		padding-right: var(--size-base);
		width: var(--size-term);
	}

	dd {

	}

	@media screen and (min-width: #{$media-screen-md}) {
		.choice__cover {
			flex-direction: row;
			justify-content: space-around;
			width: 90%;

			img {
				margin-right: calc(2 * var(--size-base));
			}

			dl {
				font-size: 1.125rem;
				margin-left: 0;
				width: calc(18 * var(--size-base));
			}

			dt {
				--size-term: 100%;
			}
		}

		.choice__actions {
			box-shadow: none;
			transform: translateX(var(--size-base));
			width: calc(100% - (2 * var(--size-base)));
		}
	}
</style>
