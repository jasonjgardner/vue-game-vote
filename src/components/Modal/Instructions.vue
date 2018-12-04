<template>
	<div id="modal-content">
		<h2 class="mt-0">Voting</h2>
		<p>The number of remaining votes is displayed inside a circle positioned in the upper
			right corner of the app.</p>

		<p><b>Tap the <span class="text--accent">green</span> circle to adjust the allotted votes</b> via keyboard input.
		The new value must be between 1 and 99. Set the initial value to the number of voters participating.</p>

		<h3>Buying Votes</h3>
		<p>The number of remaining votes can also be adjusted by pressing the <b>Coin</b> button. Pay <b>one</b>&nbsp;
			<a href="#mario-coin">Mario coin</a> per additional vote.</p>

		<h5 id="mario-coin">Mario Coins</h5>

		<blockquote>
			<p>Mario Coins are toy coins embossed with Mario's face. They're given as a reward for good behavior and
				taken away for bad behavior, poor sportsmanship, bitching, moaning, etc.</p>
		</blockquote>
	</div>
</template>

<script>
	export default {
		name: 'Instructions'
	};
</script>
