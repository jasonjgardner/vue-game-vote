<template>
	<div class="select-wrapper">
		<label v-if="label.length" :for="id">{{ label }}</label>
		<select :id="id" :name="name">
			<slot></slot>
		</select>
		<PlusIcon/>
	</div>
</template>

<script>
	import PlusIcon from '../assets/img/plus-circle-inverse.svg';

	export default {
		name: 'Select',
		components: {
			PlusIcon
		},
		props: {
			id: {
				type: String,
				required: false,
				default() {
					return this.$attrs.id;
				}
			},
			name: {
				type: String,
				required: false,
				default() {
					return this.$attrs.name || this.id;
				}
			},
			label: {
				type: String,
				required: false,
				default: ''
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/variables';

	.select-wrapper {
		background-color: var(--color-invert, transparent);
		border: 2px solid var(--color-text);
		border-radius: $size-border-radius;
		cursor: pointer;
		padding: .5em calc(2 * var(--size-base));
		position: relative;
		text-align: center;
	}

	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		background-color: transparent;
		border: none;
		color: var(--color-text);
		cursor: pointer;
		display: inline-block;
		font-size: 1rem;
		font-weight: 600;
	}

	svg {
		height: 1.1666rem;
		position: absolute;
		top: var(--size-gap);
		right: var(--size-gap);
	}
</style>
