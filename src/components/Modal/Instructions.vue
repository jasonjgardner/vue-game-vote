<template>
	<div id="modal-content">
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
	</div>
</template>

<script>
	// @vue/component
	import MinusCircle from 'vue-feather-icon/components/minus-circle';

	/**
	 * Instructions modal component
	 */
	export default {
		name: 'Instructions',
		components: {
			CoinIcon: MinusCircle
		}
	};
</script>

<style lang="scss" scoped>
	@import '../../css/variables';

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
</style>
