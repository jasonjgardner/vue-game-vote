<template><span v-html="random()"></span></template>

<script>
	export default {
		name: 'RandomText',
		props: {
			choices: {
				type: Array,
				required: true,
				validator: val => Array.isArray(val) && val.length === val.filter(v => typeof v === 'string').length,
				default: () => []
			}
		},
		methods: {
			random: function () {
				return this.choices[Math.floor(Math.random() * this.choices.length)]
			}
		}
	};
</script>
