import 'normalize.css';
import './css/index.scss';

import Vue from 'vue';
import App from './App.vue';
import data from './data.json';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	data: {
		games: [],
		...data
	}
}).$mount('#app');
