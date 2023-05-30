import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import { titleCase } from "title-case";

const bundleName = "koseva";
const bg_script_name = `${bundleName}.bg.js`;

/**
 * @typedef Build
 * @type {object}
 * @property {2|3} manifest_version
 * @property {'gecko'} [browser]
 */

/**
 * @param {Build} build
 * @returns {object[]}
 */
function buildRollup(build) {
	const output_dir = `dist/v${build.manifest_version}${build.browser ? `-${build.browser}` : ''}`;
	function manifestFn(manifestString) {
		const manifest = JSON.parse(manifestString);
		manifest.name = titleCase(pkg.name);
		manifest.version = pkg.version;
		manifest.description = pkg.description;
		manifest.content_scripts[0].js[0] = `${bundleName}.js`;
		manifest.manifest_version = build.manifest_version;

		if (build.manifest_version === 3) {
			manifest.manifest_version = 3;
			manifest.background = { service_worker: bg_script_name };
			manifest.action = {};
		} else if (build.manifest_version === 2) {
			manifest.manifest_version = 2;
			manifest.background = {
				scripts: [bg_script_name],
				persistent: false,
			};
			manifest.browser_action = {};
		}

		if (build.browser === 'gecko') {
			delete manifest["options_page"]; // Firefox deprecated it
		}
		else if (!build.browser) {
			delete manifest.browser_specific_settings;
		}

		return JSON.stringify(manifest);
	}
	return [{
		input: "src/koseva.ts",
		output: {
			file: `${output_dir}/${bundleName}.js`,
			format: "cjs",
			plugins: [terser()],
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			typescript(),
			compiler({
				compilation_level: "ADVANCED",
				externs: "src/chrome_externs.js",
			}),
			copy({
				targets: [
					{
						src: "static/manifest.json",
						dest: output_dir,
						transform: manifestFn,
					},
					{ src: "static/**/*.png", dest: output_dir },
					{ src: "static/options.html", dest: output_dir },
					{ src: "static/options.js", dest: output_dir },
				],
			}),
		],
	},
	{
		input: `src/background_v${build.manifest_version}.ts`,
		output: {
			file: `${output_dir}/${bg_script_name}`,
			plugins: [terser()],
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			typescript(),
			compiler({
				compilation_level: "ADVANCED",
				externs: "src/chrome_externs.js",
			}),
		],
	},
	{
		input: "src/options.ts",
		output: {
			file: `${output_dir}/options.js`,
			plugins: [terser()]
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			typescript(),
			compiler({
				compilation_level: "ADVANCED",
				externs: "src/chrome_externs.js",
			}),
			copy({
				targets: [
					{ src: "static/locales/en.json", dest: `${output_dir}/_locales/en/`, rename: 'messages.json' },
					{ src: "static/locales/he.json", dest: `${output_dir}/_locales/he/`, rename: 'messages.json' },
				],
			}),
		]
	}];
}

export default [
	...buildRollup({ manifest_version: 3 }),
	// ...buildRollup({ manifest_version: 3, browser: 'gecko' }), // Firefox doesn't support background service workers yet.
	...buildRollup({ manifest_version: 2 }),
	...buildRollup({ manifest_version: 2, browser: 'gecko' }),
];
