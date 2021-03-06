<template>
	<main class="choice__results" aria-labelledby="choice-intro">
		<p id="choice-intro" class="text--secondary mb-0" role="heading">
			{{ randomTitles|random }}
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

			<div class="choice__cover" role="figure">
				<Transition appear name="slide">
					<img v-if="typeof chosen.image === 'string'"
						 :src="require(`@/${chosen.image}`)"
						 :alt='`"${chosen.name}" cover art`'
						 :title="chosen.name"
						 class="focus"
						 itemprop="image">
					<picture v-else>
						<source v-for="(type, src) in chosen.image" :key="type"
								:type="`image/${type}`"
								:srcset="require(`@/${chosen.image[src]}`)">

						<img :src="require(`@/${chosen.image.jpeg}`)"
							 :alt='`"${chosen.name}" cover art`'
							 :title="chosen.name"
							 class="focus"
							 itemprop="image"
							 role="presentation"
							 aria-labelledby="choice-name">
					</picture>
				</Transition>

				<div class="choice__container" :aria-expanded="showDetails">
					<div class="col">
						<dl>
							<template v-if="chosen.hasOwnProperty('developer') && chosen.developer.length > 0">
								<dt>Developer</dt>
								<dd itemprop="developer">{{ chosen.developer }}</dd>
							</template>
							<template v-if="chosen.hasOwnProperty('publisher') && chosen.publisher.length > 0">
								<dt>Publisher</dt>
								<dd itemprop="publisher">{{ chosen.publisher }}</dd>
							</template>
							<dt>Players</dt>
							<dd>
								<span itemprop="numberOfPlayers">{{ chosen.numberOfPlayers > 1 ? `1 - ${chosen.numberOfPlayers}` : 1 }}</span>&nbsp;
								<meta itemprop="playMode" :content="chosen.playMode">
							</dd>
						</dl>
					</div>
					<!-- /.col -->
					<div class="col">
						<div v-if="chosen.familyFriendly" class="d-flex nowrap">
							<FamilyFriendlyIcon class="icon" aria-hidden="true"/>
							<h5 class="ml-1">This is a family-friendly game.</h5>
						</div>
						<div v-else class="d-flex nowrap">
							<FamilyUnfriendlyIcon class="icon" aria-hidden="true"/>
							<h5 class="ml-1">This is not a family-friendly game.</h5>
						</div>
					</div>
					<!-- /.col -->
				</div>
			</div>
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
			<caption>{{ votesCaption }} cast</caption>
		</table>

		<div class="choice__actions" role="form">
			<button v-show="canPickAgain"
					:disabled="!canPickAgain"
					class="btn h-focus"
					type="button"
					name="repick"
					@click="pickAgain"
			>
				Pick Again
			</button>
			<button class="btn btn--primary h-focus"
					type="reset"
					name="restart"
					@click.prevent="$emit('reset')"
			>
				Start Over
			</button>
		</div>
	</main>
</template>

<script>
	import CheckCircle from 'vue-feather-icon/components/check-circle';
	import FamilyFriendlyIcon from '@/assets/img/is-family-friendly.svg';
	import FamilyUnfriendlyIcon from '@/assets/img/not-family-friendly.svg';

	/**
	 * Game selection component
	 * @module GameSelection
	 * @requires CheckCircle
	 * @vue-prop {GameData} chosen - Selected game's data
	 * @vue-data {Number} picks - Number of times the selection has been repicked. Used to apply conditional title
	 * @vue-computed {Boolean} canPickAgain - True if another game can be selected, or false if the voting process needs to be restarted
	 * @vue-computed {Object<string, GameData>} poll - The number of votes tallied for the selected game, along with game data
	 * @vue-computed {String} randomTitles - Returns a humorous random title
	 */
	export default {
		name: 'GameSelection',
		components: {
			CheckCircle,
			FamilyFriendlyIcon,
			FamilyUnfriendlyIcon
		},
		props: {
			chosen: {
				type: Object,
				default: () => {
					return {};
				},
				id: {
					type: String,
					required: true
				},
				name: {
					type: String,
					required: true
				},
				image: {
					type: [Array, String],
					required: true
				},
				developer: String,
				publisher: String,
				gamePlatform: String,
				familyFriendly: Boolean,
				contentRating: {
					type: String,
					required: false,
					validator: rating => ['RP', 'EC', 'E', 'E10+', 'T', 'M', 'AO'].indexOf(rating) > -1
				},
				playMode: {
					type: String,
					required: false,
					validator: gamePlayMode => ['CoOp', 'MultiPlayer', 'SinglePlayer'].indexOf(gamePlayMode) > -1
				},
				numberOfPlayers: {
					type: Number,
					default: 1
				}
			},
			votes: {
				type: Array,
				required: true,
				default: () => []
			}
		},
		data() {
			return {
				picks: 0,
				showDetails: false
			};
		},
		computed: {
			canPickAgain() {
				return [...new Set(this.votes)].length > 1;
			},
			poll() {
				let results = {};

				for (const vote of this.votes) {
					results[vote.id] = {
						...vote,
						total: this.votes.filter(v => v.id === vote.id).length,
						chosen: this.chosen.id === vote.id
					};
				}

				return results;
			},
			votesCaption() {
				const total = this.votes.length;

				if (total !== 1) {
					return `${total} votes`;
				}

				return '1 vote';
			},
			randomTitles() {
				if (this.picks <= 0 && [...new Set(this.votes)].length === 1) {
					return ['It\'s unanimous!', 'We\'ve agreed on'];
				}

				return ['Let\'s play...', 'How about...'];
			}
		},
		methods: {
			/** @description Repicks a game
			 * @memberof Selection
			 * @event Selection#choose
			 * @event Selection#reset
			 */
			pickAgain() {
				this.picks++;
				this.$emit(this.votes.length > 0 ? 'choose' : 'reset');
				window.scrollTo(0, 0);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '~@/css/_variables';
	@import '~@/css/_mixins';

	#choice-intro {
		margin-left: var(--size-base);
	}

	.icon {
		display: block;
		fill: var(--color-secondary);
		height: auto;
		justify-content: center;
		max-height: 48px;
		max-width: calc(4 * var(--size-base));
		min-width: calc(2 * var(--size-base));
	}

	.choice__details {
		margin: 0 auto;
		padding-left: var(--size-base);
		padding-right: var(--size-base);
	}

	.choice__header {
		align-items: center;
		display: flex;
		margin-bottom: calc(2 * var(--size-base));

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
		align-items: center;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		margin: 0 auto calc(2 * var(--size-base));
		max-width: 90vw;
		width: 100%;

		[itemprop='image'] {
			border: 1px solid var(--color-lightest);
			border-radius: $size-border-radius;
			height: 100%;
			margin: 0 auto;
			max-height: $size-game-cover-max;
			max-width: $size-game-cover-max;
			object-fit: fill;
			width: 100%;

			&:only-child {
				margin-left: auto;
				margin-right: auto;
			}
		}
	}

	.sweet-fx .choice__cover [itemprop='image'] {
		filter: drop-shadow(1px .5rem 1rem rgba(0, 0, 0, .5));
	}

	.choice__container {
		display: flex;
		flex-direction: column;
		margin-top: var(--size-base);
		overflow: hidden;
		transition: max-width .333s ease-out;

		&[aria-expanded='false'] {
			max-width: 0;
		}
	}

	.choice__results {
		margin: 0 auto;
		max-width: calc(2 * var(--size-game-cover));
		width: 100%;
	}

	.choice__actions {
		background-color: var(--color-background);
		border-top: 1px solid var(--color-border);
		bottom: 0;
		box-shadow: 0 -.5rem .4rem -.3rem rgba(0, 0, 0, .125);
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-evenly;
		left: 0;
		margin: var(--size-base) 0 0;
		padding: 1.5rem 1rem;
		position: sticky;
		width: 100%;

		.btn {
			display: block;
			filter: drop-shadow(-1px .125rem .25rem rgba(0, 0, 0, .125));
			flex: 1;
			max-width: $size-game-cover-max;
			padding: 1em;

			&:only-child {
				margin-left: auto;
				margin-right: auto;
			}

			+ .btn {
				margin-left: var(--size-base);
			}

			&:first-child:not(.btn--primary) {
				--color-btn: var(--color-text);
			}
		}
	}

	.chosen-enter {
		opacity: 1;
	}

	.chosen-leave-active {
		opacity: 0;
	}

	caption {
		font-weight: 500;
		line-height: 1.5;
		margin-bottom: 1rem;
		text-transform: capitalize;
	}

	table {
		background-color: var(--color-background);
		border-collapse: collapse;
		border-spacing: 0;
		box-shadow: 1px -1px 10px rgba(0, 0, 0, .05);
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
			background-color: var(--color-surface);
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
	}

	dt,
	dd {
		border-bottom: 1px solid var(--color-border);
		margin-bottom: var(--size-gap);
		overflow: hidden;
		padding: var(--size-gap);
		text-overflow: ellipsis;
	}

	dt {
		--size-term: calc(6 * var(--size-base));
		color: var(--color-secondary);
		float: left;
		font-size: .875em;
		font-weight: bold;
		line-height: 1.75;
		padding-right: var(--size-base);
		width: var(--size-term);
	}

	@media screen and (min-width: #{$media-screen-sm}) {
		table {
			margin-left: auto;
			margin-right: auto;
			width: 90%;
		}

		.choice__results {
			max-width: 100%;
		}

		.choice__actions .btn:only-child {
			margin-right: 0;
		}
	}

	@media screen and (min-width: #{$media-screen-md}) {
		.choice__cover {
			flex-direction: row;
			max-width: 90%;

			[itemprop='image'] {
				margin: 0 calc(4 * var(--size-gap)) 0 0;
			}

			.choice__container {
				flex-direction: column;
				justify-content: space-between;
			}

			img {
				margin-right: calc(2 * var(--size-base));
			}

			dl {
				font-size: 1.125rem;
				margin-left: 0;
				margin-right: var(--size-base);
				width: calc(18 * var(--size-base));
			}

			dt {
				--size-term: 100%;
			}

			dd {
				border-bottom: 0;
			}
		}

		.choice__actions {
			box-shadow: none;
			transform: translateX(var(--size-base));
			position: fixed;
			width: calc(100% - (2 * var(--size-base)));
		}

		.content-rating {
			border-top: 1px solid var(--color-border);
			flex-flow: row wrap;
			font-size: .925rem;
			margin-top: var(--size-gap);
			padding-top: var(--size-gap);
			text-align: center;
			width: 100%;

			.icon + .icon {
				margin-left: var(--size-base);
			}

			p:last-of-type {
				margin-bottom: 0;
			}
		}
	}

	@media screen and (min-width: #{$media-screen-lg}) {
		table,
		.choice__results {
			width: 90%;
		}
	}
</style>
