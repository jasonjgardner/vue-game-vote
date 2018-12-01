<template>
	<div class="choice__results">
		<h2 class="choice__title">{{ chosen.text }}</h2>
		<img class="choice__cover focus" v-bind:src="require(`../assets/games/${chosen.id}.jpg`)" :alt="chosen.text">

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
			<button class="btn btn--secondary text--accent" type="button" v-on:click="this.$parent.choose">
				Pick Again
			</button>
			<button class="btn btn--primary" type="button" v-on:click="this.$parent.reset">
				Start Over
			</button>
		</footer>
	</div>
</template>

<script>
	import Game from '../types/Game';

	export default {
		name: 'GameChosen',
		props: {
			chosen: {
				...Game
			}
		},
		computed: {
			poll: function() {
				let results = {};

				for (const vote of this.$parent.votes) {
					results[vote.id] = {
						...vote,
						total: this.$parent.votes.filter(v => v.id === vote.id).length,
						chosen: this.chosen.id === vote.id
					}
				}

				return results;
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables.scss';

	.choice__title {
		font-size: 2rem;
		font-weight: bold;
		letter-spacing: .1em;
		text-align: center;
		text-transform: uppercase;
	}

	.choice__cover {
		margin: 0 auto 1rem;
		width: 100%;
	}

	.choice__results {
		margin: 0 auto;
		width: 90%;
	}

	.choice__actions {
		box-sizing: border-box;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin: 1.5rem 0 1rem;
		padding: 0 1rem;
		width: 100%;

		.btn {
			display: block;
			flex: 1;
			padding: 1em;
		}

		.btn + .btn {
			margin-left: 1rem;
		}
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
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
