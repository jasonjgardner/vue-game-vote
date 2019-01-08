<template>
	<time :datetime="datetime">{{ formattedTime }}</time>
</template>

<script>
	import dayjs from 'dayjs';

	export default {
		name: 'DateTime',
		props: {
			time: {
				type: [Number, String],
				required: true,
				default: +(new Date())
			},
			format: {
				type: String,
				required: false,
				default: 'M-D-YYYY'
			}
		},
		data() {
			return {
				day: dayjs(this.time)
			}
		},
		computed: {
			datetime() {
				return this.day.format();
			},
			formattedTime() {
				return this.day.format(this.format);
			}
		}
	};
</script>
