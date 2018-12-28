export default function loadTypekit(kitId, scriptTimeout = 3000, async = true) {
	const firstScriptTag = document.getElementsByTagName('script')[0],
		  timeout        = setTimeout(() => {
			  document.documentElement.classList.remove('wf-loading');
			  document.documentElement.classList.add('wf-inactive');
		  }, scriptTimeout),
		  typekitScript  = document.createElement('script');

	let hasLoaded = false;

	document.documentElement.classList.add('wf-loading');

	typekitScript.src    = `https://use.typekit.net/${kitId}.js`;
	typekitScript.async  = async === true;
	typekitScript.onload = function () {
		const state = this.readyState;

		if (hasLoaded || state && state !== 'complete' && state !== 'loaded') {
			return;
		}

		hasLoaded = true;

		clearTimeout(timeout);

		try {
			Typekit.load({
				kitId: kitId,
				scriptTimeout: scriptTimeout,
				async: async,
			});
		} catch (e) {
		}
	};

	typekitScript.onreadystatechange = typekitScript.onload;
	firstScriptTag.parentNode.insertBefore(typekitScript, firstScriptTag);
}
