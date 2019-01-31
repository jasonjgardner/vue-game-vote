const mixin = {
	props: {
		timeout: {
			type: [Number, Boolean],
			required: false,
			default: 5000
		}
	},
	data() {
		return {
			$_timeout: undefined
		};
	},
	destroyed() {
		clearTimeout(this.$_timeout)
	},
	mounted() {
		this.$_timeout = setTimeout(() => this.$emit('timeout', false), this.timeout);
	}
};

export default mixin;
