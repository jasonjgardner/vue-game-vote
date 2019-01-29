/**
 * TypeKit Loader
 * @description Asynchronously loads TypeKit
 * @param {string} kitId - TypeKit kit ID
 * @param {number} [scriptTimeout=3000] - Milliseconds before adding `wf-` classes to `<html>`
 */
export default function loadTypeKit(kitId, scriptTimeout = 3000) {
	return new Promise((resolve, reject) => {
		const firstScriptTag = document.getElementsByTagName('script')[0],
			timeout        = setTimeout(() => {
				document.documentElement.classList.remove('wf-loading');
				document.documentElement.classList.add('wf-inactive');
			}, scriptTimeout),
			typeKitScript  = document.createElement('script');

		let hasLoaded = false;

		document.documentElement.classList.add('wf-loading');

		typeKitScript.src    = `https://use.typekit.net/${kitId}.js`;
		typeKitScript.async  = true;
		typeKitScript.onload = function () {
			const state = this.readyState;

			if (hasLoaded || state && state !== 'complete' && state !== 'loaded') {
				return;
			}

			hasLoaded = true;

			clearTimeout(timeout);

			try {
				/* eslint-disable no-undef */
				Typekit.load({
					kitId: kitId,
					scriptTimeout: scriptTimeout,
					async: true,
				});
			} catch (err) {
				reject(err);
			}

			resolve();
		};

		typeKitScript.onreadystatechange = typeKitScript.onload;
		firstScriptTag.parentNode.insertBefore(typeKitScript, firstScriptTag);
	});
}
