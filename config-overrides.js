const tsImportPluginFactory = require("ts-import-plugin");
const { injectBabelPlugin, compose, getLoader } = require("react-app-rewired");
const rewireTypescript = require("react-app-rewire-typescript");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const rewireSvgReactLoader = require("react-app-rewire-svg-react-loader");
const rewireLess = require("react-app-rewire-less");
const rewireStyledComponents = require("react-app-rewire-styled-components");
const rewireMobX = require("react-app-rewire-mobx");

const color = require("color");

module.exports = function override(config, env) {
	config = compose(
		rewireTypescript,
		rewireReactHotLoader,
		rewireSvgReactLoader,
		rewireStyledComponents,
		rewireMobX,
		rewireLess
	)(config, env);

	const tsLoader = getLoader(
		config.module.rules,
		rule =>
			rule.loader &&
			typeof rule.loader === "string" &&
			rule.loader.includes("ts-loader")
	);

	tsLoader.options = {
		getCustomTransformers: () => ({
			before: [
				tsImportPluginFactory({
					libraryName: "antd",
					libraryDirectory: "es",
					style: true
				})
			]
		})
	};

	config = rewireLess.withLoaderOptions({
		javascriptEnabled: true,
		modifyVars: {
			"@menu-bg": color("#f8f8f8"),
			"@menu-item-color": color("#f8f8f8")
				.alpha(0.5)
				.darken(0.5),
			"@menu-highlight-color": "#1088ae",
			"@menu-item-active-bg": color("#1088ae").lighten(0.4)
			// '@primary-color': 'red'
		}
	})(config, env);

	return config;
};
