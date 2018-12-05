import './css/index.scss';
import './registerServiceWorker';
import Vue from 'vue';

Vue.config.productionTip = false;

import App from './App.vue';

import('./data.json').then(data => {
	new Vue({
		render: h => h(App),
		data: {
			games: [],
			initialVoters: 4,
			...data.default
		}
	}).$mount('#app');
});
