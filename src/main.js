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
import './registerServiceWorker';
import sortBy from './lib/sortBy';
import Vue from 'vue';

Vue.config.productionTip = process.env.NODE_ENV === '"development"';

import App from './App.vue';

import('./data.json').then(data => {
	data.games.sort(sortBy('id'));

	new Vue({
		render: h => h(App, {
				props: {
				initialVoters: 2,
				games: data.games
			}
		})
	}).$mount('#app');
});

export const Bus = new Vue();
