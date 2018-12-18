/**
 * @class HorizontalScroll
 * @classdesc Forces mouse wheel events to scroll horizontally when vertical scrolling is not an option.
 * @version 1.0.0
 * @exports HorizontalScroll
 */
export default class HorizontalScroll {
	/**
	 * @type {number}
	 * @private
	 */
	_scrollRate = 1;

	/**
	 * @description Allows setting scroll rate upon initialization
	 * @memberof HorizontalScroll#
	 * @param {number} [scrollRate=1] - Distance scrolled per wheel rotation
	 */
	constructor(scrollRate = 1) {
		this.scrollRate = scrollRate || 1;
	}

	/**
	 * @description Scroll speed setter
	 * @memberof HorizontalScroll#
	 * @param {number} rate - Positive number indicating horizontal scroll speed
	 */
	set scrollRate(rate) {
		this._scrollRate = Math.max(.1, +rate);
	}

	/**
	 * @description Watches wheel movement and translates vertical scrolling to horizontal scrolling
	 * @memberof HorizontalScroll#
	 * @param {WheelEvent} event - Scrolling event
	 */
	onScroll(event) {
		if (event.deltaY !== 0 && !document.body.classList.contains('backdrop-visible')) {
			window.scroll(window.scrollX + event.deltaY * (this._scrollRate || 1), window.scrollY);
			event.preventDefault();
		}
	}

	/**
	 * @description Removes scroll event when vertical scrolling is an option, otherwise adds `onScroll` to wheel event
	 * @memberof HorizontalScroll#
	 */
	reset() {
		if (document.body.scrollHeight > document.body.clientHeight) { /// Has vertical scroll
			window.removeEventListener('wheel', this.onScroll);
			return;
		}

		window.addEventListener('wheel', this.onScroll, true);
	}

	/**
	 * @description Resets scroll events on window resize. Resizing window may add or remove vertical scrollbars.
	 * @memberof HorizontalScroll#
	 */
	attach() {
		window.addEventListener('resize', this.reset, true);
		this.reset();
	}
}
