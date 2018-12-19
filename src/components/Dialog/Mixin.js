/**
 * @namespace Modal
 * @module Mixin
 * @description Vue.js mixin to add/remove class `backdrop-visible` to/from `body` when modal is mounted or destroyed.
 */
export default {
	/**
	 * @description Add `backdrop-visible` class to `body` when a modal or dialog is shown
	 */
	mounted: () => document.body.classList.add('backdrop-visible'),
	/**
	 * @description Remove `backdrop-visible` class when a modal or dialog has been dismissed
	 */
	destroyed: () => document.body.classList.remove('backdrop-visible')
};
