<template>
	<Transition appear name="fade">
		<div class="choice__results">
			<p class="text--secondary mb-0">
				<RandomText :choices="randomTitles" :html="true" />
			</p>

			<div class="choice__details" itemscope itemtype="http://schema.org/VideoGame">
				<div class="choice__header">
					<CheckCircle />
					<h2 class="choice__title" itemprop="name">
						{{ chosen.name }}
					</h2>
				</div>

				<div class="choice__cover">
					<img class="focus" itemprop="image"
						 :src="require(`../${chosen.img}`)"
						 :alt="chosen.name"
					>
				</div>

				<!--<dl>-->
					<!--<dt>Developer</dt>-->
					<!--<dd itemprop="developer">{{ chosen.developer }}</dd>-->
					<!--<dt>Publisher</dt>-->
					<!--<dd itemprop="publisher">{{ chosen.publisher }}</dd>-->
					<!--<dt>Players</dt>-->
					<!--<dd>-->
						<!--<span itemprop="numberOfPlayers">{{ chosen.numberOfPlayers }}</span>&nbsp;-->
						<!--<span class="text&#45;&#45;secondary" itemprop="playMode">({{ chosen.playMode }})</span>-->
					<!--</dd>-->
				<!--</dl>-->
			</div>

			<table>
				<thead>
				<tr>
					<th>Choice</th>
					<th>Votes</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="game in poll" :key="game.id" :class="{'text--accent': game.chosen}">
					<td>{{ game.name }}</td>
					<td class="text--center">
						{{ game.total }}
					</td>
				</tr>
				</tbody>
				<caption>Voting Results</caption>
			</table>

			<footer class="choice__actions">
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
			</footer>
		</div>
	</Transition>
</template>

<script>
	// @vue/component
	import CheckCircle from 'vue-feather-icon/components/check-circle';

	// @vue/component
	import RandomText from './RandomString';

	/**
	 * Game data
	 * @typedef {Object<string,any>} GameData
	 * @property {String} id - Unique game ID
	 * @property {String} name - Game name
	 * @property {String} img - Image source path
	 * @property {String} [developer] - Game developer
	 * @property {String} [publisher] - Game publisher
	 * @property {String} [gamePlatform] - Game platform/system
	 * @property {Boolean} [familyFriendly] - Game is family-friendly
	 * @property {'RP'|'EC'|'E'|'E10+'|'T'|'M'|'AO'} [esrb] - ESRB game rating
	 * @property {'CoOp'|'MultiPlayer'|'SinglePlayer'} [playMode] - Identifies game as single or multiplayer
	 * @property {Number} [numberOfPlayers=1] - Number of players
	 */

	/**
	 * Game selection component
	 * @vue-prop {GameData} chosen - Selected game's data
	 * @vue-data {Number} picks - Number of times the selection has been repicked. Used to apply conditional title
	 * @vue-computed {Boolean} canPickAgain - True if another game can be selected, or false if the voting process needs to be restarted
	 * @vue-computed {{[string]:mixed}} poll - The number of votes tallied for the selected game, along with game data
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
					return {}
				},
				id: {
					type: String,
					required: true
				},
				name: {
					type: String,
					required: true
				},
				img: {
					type: String,
					required: true
				},
				developer: String,
				publisher: String,
				gamePlatform: String,
				familyFriendly: Boolean,
				esrb: {
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
			}
		},
		data: () => {
			return {
				picks: 0
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
						chosen: this.chosen.id === vote.id
					};
				}

				return results;
			},
			randomTitles() {
				if (this.picks <= 0 && [...new Set(this.$parent.votes)].length === 1) {
					return ['It\'s unanimous!', 'We\'ve agreed on'];
				}

				return ['Let&rsquo;s play&hellip;', 'How about&hellip;'];
			}
		},
		methods: {
			/**
			 * Repicks a game. Increases picks count and removes currently elected game from votes list
			 */
			pickAgain() {
				this.picks++;
				this.$parent.votes = this.$parent.votes.filter(vote => vote.id !== this.chosen.id);

				this.$emit(this.$parent.votes.length > 0 ? 'choose' : 'reset');
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/_variables.scss';

	.choice__details {
		display: flex;
		flex-flow: column nowrap;

		dt,
		dd {
			float: left;
			width: 50%;
		}

		dt {
			clear: left;
		}
	}

	.choice__header {
		align-items: center;
		display: flex;
		margin-bottom: 1rem;

		svg {
			stroke: $color-lightest;
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
		box-shadow: 1px 3px 20px rgba(0, 0, 0, .75);
		margin: 0 auto 1rem;
		max-height: $size-game-cover-max;
		max-width: $size-game-cover-max;
		height: 90vw;
		width: 90vw;

		img {
			height: 100%;
			margin: 0 auto;
			object-fit: fill;
			width: 100%;
		}
	}

	.choice__results {
		margin: 0 auto;
		width: 90%;
	}

	.choice__actions {
		background-color: rgba(map-get($theme-dark, 'background'), .95);
		border-top: 1px solid $color-lightest;
		bottom: 0;
		box-shadow: 0 -.5rem .4rem -.3rem rgba(0, 0, 0, .45);
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
			box-shadow: -1px 1px 3px rgba(0, 0, 0, .5), 0 0 5px rgba(0, 0, 0, .33);
			display: block;
			flex: 1;
			max-width: $size-game-cover-max;
			padding: 1em;

			&:only-child {
				margin-left: auto;
			}
		}

		.btn + .btn {
			margin-left: $size-base;
		}
	}

	.chosen-enter {
		opacity: 1;
	}

	.chosen-leave-active {
		opacity: 0;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
		margin-bottom: 8rem;
		width: 100%;
	}

	thead {
		border-bottom: 1px solid $color-light;
	}

	tbody tr {
		&:hover,
		&:focus-within {
			background-color: map-get($theme-dark, 'background-alt');
		}

		&:nth-child(even) {
			background-color: #3a3a3a;
		}
	}

	th {
		color: #ccc;
		font-size: .925rem;
		padding: .25em .125em;

		&:first-child {
			text-align: left;
		}
	}

	td {
		border: 0;
		color: #999;
		margin: 0;
		padding: .25em .5em;
	}
</style>
