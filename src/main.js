import './css/index.scss';

import Vue from 'vue';
import App from './App.vue';
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false;

Vue.directive('tooltip', VTooltip);

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





