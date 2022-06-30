import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import { titleCase } from "title-case";

const bundleName = "koseva";

const bg_script_name = `${bundleName}.bg.js`;

function transformManifest(version) {
	return content => {
		const manifest = JSON.parse(content);
		manifest.name = titleCase(pkg.name);
		manifest.version = pkg.version;
		manifest.description = pkg.description;
		manifest.content_scripts[0].js[0] = `${bundleName}.js`;
		version(manifest);
		return JSON.stringify(manifest);
	};
}

function mv3(manifest) {
	manifest.manifest_version = 3;
	manifest.background = { service_worker: bg_script_name };
	manifest.action = {};
}

function mv2(manifest) {
	manifest.manifest_version = 2;
	manifest.background = {
		scripts: [bg_script_name],
		persistent: false,
	};
	manifest.browser_action = {};
}

export default [
	{
		input: "src/koseva.ts",
		output: {
			file: `dist/v3/${bundleName}.js`,
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
						dest: "dist/v3/",
						transform: transformManifest(mv3),
					},
					{ src: "static/**/*.png", dest: "dist/v3" },
				],
			}),
		],
	},
	{
		input: "src/koseva.ts",
		output: {
			file: `dist/v2/${bundleName}.js`,
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
						dest: "dist/v2/",
						transform: transformManifest(mv2),
					},
					{ src: "static/**/*.png", dest: "dist/v2/" },
				],
			}),
		],
	},
	{
		input: "src/background_v3.ts",
		output: {
			file: `dist/v3/${bg_script_name}`,
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
		input: "src/background_v2.ts",
		output: {
			file: `dist/v2/${bg_script_name}`,
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
];
