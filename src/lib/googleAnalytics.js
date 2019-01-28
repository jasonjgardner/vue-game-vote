export default function googleAnalytics(trackingId) {
	const ga = window.ga || (() => (ga.q = ga.q || []).push(arguments));
	ga.l = +new Date;
	ga('create', `UA-${trackingId}`, 'auto');
	ga('send', 'pageview');
	window.ga = ga;
}
