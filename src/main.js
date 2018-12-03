import 'normalize.css';
import './css/index.scss';

import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import('./data.json').then(data => {
	new Vue({
		render: h => h(App),
		data: {
			games: [],
			...data
		}
	}).$mount('#app');
});





