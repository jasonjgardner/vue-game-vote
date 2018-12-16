<template>
	<div id="modal-content">

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


</style>
