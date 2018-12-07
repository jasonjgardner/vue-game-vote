import './css/index.scss';
import './registerServiceWorker';
import Vue from 'vue';

Vue.config.productionTip = process.env.NODE_ENV === '"development"';

import App from './App.vue';

import('./data.json').then(data => {
	new Vue({
		render: h => h(App, {
			props: {
				initialVoters: 4,
				games: data.games
			}
		})
	}).$mount('#app');
});
