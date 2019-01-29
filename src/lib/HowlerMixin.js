import { Howl } from 'howler';

const mixin = {
	destroyed() {
		if (this.$_howl) {
			this.$_howl.unload();
		}
	},
	data() {
		return {
			$_howl: undefined,
			$_enableAudio: false
		};
	},
	methods: {
		enableAudio(enable) {
			if (enable) {
				this.$_howl = new Howl({
					src: [require('@/assets/audio/sprite.ogg'), require('@/assets/audio/sprite.mp3')],
					sprite: {
						click: [0, 80],
						back: [80, 200],
						coin: [270, 1000],
						home: [1200, 200],
						load: [2200, 500],
						news: [2700, 200],
						pause: [3175, 700],
						select: [3900, 50],
						tap: [3974, 100]
					},
					preload: true
				});
			} else if (this.$_howl !== undefined) {
				this.$_howl.unload();
				this.$_howl = undefined;
			}
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
