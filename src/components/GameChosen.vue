<template>
	<div class="choice__results">
		<p class="text--secondary mb-0">
			<random-text v-bind:choices="['Let&rsquo;s play&hellip;', 'How about&hellip;']"></random-text>
		</p>

		<div class="choice__header">
			<check-circle></check-circle>
			<h2 class="choice__title">{{ chosen.text }}</h2>
		</div>

		<div class="choice__cover">
			<img class="focus" v-bind:src="require(`../${chosen.img}`)" :alt="chosen.text">
		</div>

		<table>
			<thead>
			<tr>
				<th>Choice</th>
				<th>Votes</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="game in poll" v-bind:key="game.id" v-bind:class="{'text--accent': game.chosen}">
				<td>{{ game.text }}</td>
				<td class="text--center">
					{{ game.total }}
				</td>
			</tr>
			</tbody>
			<caption>Voting Results</caption>
		</table>

		<footer class="choice__actions">
			<button class="btn btn--secondary text--accent" type="button" name="repick" v-if="canPickAgain" v-on:click="pickAgain">
				Pick Again
			</button>
			<button class="btn btn--primary" type="button" name="restart" v-on:click="this.$parent.reset">
				Start Over
			</button>
		</footer>
	</div>
</template>

<script>
	import CheckCircle from 'vue-feather-icon/components/check-circle';
	import RandomText from './RandomText';
	import Game from '../types/Game';

	export default {
		name: 'GameChosen',
		components: {
			CheckCircle,
			RandomText
		},
		props: {
			chosen: {
				...Game
			}
		},
		methods: {
			pickAgain: function () {
				this.$parent.votes = this.$parent.votes.filter(vote => vote.id !== this.chosen.id);

				if (!this.$parent.votes.length) {
					this.$parent.reset();
					return;
				}

				this.$parent.choose();
			}
		},
		computed: {
			canPickAgain: function () {
				return [...new Set(this.$parent.votes)].length > 1;
			},
			poll: function () {
				let results = {};

				for (const vote of this.$parent.votes) {
					results[vote.id] = {
						...vote,
						total: this.$parent.votes.filter(v => v.id === vote.id).length,
						chosen: this.chosen.id === vote.id
					};
				}

				return results;
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables.scss';

	@keyframes glow {
		0%,
		100% {
			filter: saturate(0) brightness(100%);
		}

		33% {
			filter: brightness(110%);
		}

		50% {
			filter: saturate(1.5) brightness(105%);
		}

		66% {
			filter: brightness(90%);
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
		background-color: rgba($color-background, .95);
		border-top: 1px solid $color-lightest;
		bottom: 0;
		box-shadow: 0 -2px .3125rem rgba(0, 0, 0, .5), 0 -.3125rem 1.5rem rgba(0, 0, 0, .25);
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
				justify-self: center;
			}
		}

		.btn + .btn {
			margin-left: 1rem;
		}
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

	tr:nth-child(even) {
		background-color: #3a3a3a;
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
