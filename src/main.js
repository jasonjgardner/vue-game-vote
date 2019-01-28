/**
 * Video Game Votes
 * @author Jason Gardner <holler@jasongardner.co>
 * @version 1.0.0
 * @licence MIT
 */

/**
 * Game data [schema]{@link https://schema.org/VideoGame}
 * @typedef {Object<string,any>} GameData
 * @property {String} id - Unique game ID
 * @property {String} name - Game name
 * @property {String} img - Image source path
 * @property {String} [developer] - Game developer
 * @property {String} [publisher] - Game publisher
 * @property {String} [gamePlatform] - Game platform/system
 * @property {Boolean} [familyFriendly] - Game is family-friendly
 * @property {'RP'|'EC'|'E'|'E10+'|'T'|'M'|'AO'} [contentRating] - ESRB game rating
 * @property {'CoOp'|'MultiPlayer'|'SinglePlayer'} [playMode] - Identifies game as single or multi-player
 * @property {Number} [numberOfPlayers=1] - Number of players
 */

import './css/index.scss';
import './lib/registerServiceWorker';
import sortBy from './lib/sortBy';
import Vue from 'vue';
import PortalVue from 'portal-vue'

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.use(PortalVue);

Vue.filter('random', choices => choices[Math.floor(Math.random() * choices.length)]);

import App from './App.vue';

import('./data.json').then(data => {
	data.games.sort(sortBy('id'));

	new Vue({
		data: {
			BUILD_TIME: process.env.BUILD_TIME,
			AUTHOR_URL: process.env.VUE_APP_AUTHOR_URL,
			GIT_REPO: process.env.VUE_APP_GIT_REPO,
			VERSION: process.env.VUE_APP_VERSION + (process.env.NODE_ENV === 'production' ? '' : '-beta')
		},
		render: h => h(App, {
			props: {
				initialVoters: 2,
				games: data.games
			}
		})
	}).$mount('#app');
});
