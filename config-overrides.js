const tsImportPluginFactory = require("ts-import-plugin");
const { injectBabelPlugin, compose, getLoader } = require("react-app-rewired");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const rewireTypescript = require("react-app-rewire-typescript");
const rewireLess = require("react-app-rewire-less");
const rewireStyledComponents = require("react-app-rewire-styled-components");
const rewireMobX = require("react-app-rewire-mobx");

module.exports = function override(config, env) {
	config = compose(
		rewireTypescript,
		rewireReactHotLoader,
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
			// '@primary-color': 'red'
		}
	})(config, env);

	return config;
};
