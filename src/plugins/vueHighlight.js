import VueHighlightJS from "@highlightjs/vue-plugin";

export function useHighlight(app) {
	app.use(VueHighlightJS, {
		languages: {
			json: require("highlight.js/lib/languages/json")
		}
	});
}