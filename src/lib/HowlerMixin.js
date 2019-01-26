import { Howl } from 'howler';

const mixin = {
	destroyed() {
		this.$_howl.unload();
	},
	created() {
		this.$_howl = new Howl({
			src: [require('@/assets/audio/sprite.ogg'), require('@/assets/audio/sprite.mp3')],
			sprite: {
				click: [0, 80],
				back: [80, 200],
				coin: [270, 1151],
				home: [1273, 2041],
				load: [2245, 2689],
				news: [2742, 3000],
				pause: [3175, 3800],
				select: [3900, 3940],
				tap: [3974, 4000]
			}
		});
	},
	data() {
		return {
			$_enableAudio: true
		}
	},
	methods: {
		enableAudio(enable) {
			this.$_enableAudio = !!enable;
		},
		play(track) {
			return new Promise((resolve, reject) => {
				if (!this.$_enableAudio) {
					resolve(false);
				}

				this.$_howl.once('end', () => resolve);
				this.$_howl.once('playerror', reject);
				this.$_howl.play(track);
			});
		}
	}
};

export default mixin;
