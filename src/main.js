import 'normalize.css';
import './css/index.scss';

import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount('#app');
