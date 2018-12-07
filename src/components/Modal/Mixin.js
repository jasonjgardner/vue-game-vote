export default {
	mounted: () => document.body.classList.add('backdrop-visible'),
	destroyed: () => document.body.classList.remove('backdrop-visible')
};
