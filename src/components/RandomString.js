/**
 * Random string component
 * Outputs a string from an array of options
 * @vue-prop {string[]} choices - Array of strings from which a random element will be selected
 * @vue-prop {Boolean} [html] - If `true` string output will not be escaped
 */
export default {
	name: 'RandomString',
	props: {
		choices: {
			type: Array,
			required: true,
			validator: val =>
				Array.isArray(val) &&
				val.length === val.filter(v => typeof v === "string").length,
			default: () => []
		},
		html: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		/**
		 * Selects an array element at random
		 * @returns {string}
		 */
		random: function () {
			return this.choices[Math.floor(Math.random() * this.choices.length)];
		}
	},
	template: `<span v-if="html === true" v-html="random()"></span><span v-else>{{ random() }}</span>`
};

