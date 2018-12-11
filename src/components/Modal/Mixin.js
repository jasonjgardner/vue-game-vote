/**
 * Modal/dialog Vue mixin
 */
export default {
	/**
	 * Add `backdrop-visible` class to `body` when a modal or dialog is shown
	 */
	mounted: () => document.body.classList.add('backdrop-visible'),
	/**
	 * Remove `backdrop-visible` class when a modal or dialog has been dismissed
	 */
	destroyed: () => document.body.classList.remove('backdrop-visible')
};
