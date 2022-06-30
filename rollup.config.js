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

function patchManifest(contents) {
	const object = JSON.parse(contents);
	object.name = titleCase(pkg.name);
	object.version = pkg.version;
	object.description = pkg.description;
	object.content_scripts[0].js[0] = `${bundleName}.js`;
	object.background.service_worker = bg_script_name;
	return JSON.stringify(object);
}

export default [
	{
		input: "src/koseva.ts",
		output: {
			file: `dist/${bundleName}.js`,
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
						dest: "dist/",
						transform: patchManifest,
					},
					{ src: "static/**/*.png", dest: "dist/" },
				],
			}),
		],
	},
	{
		input: "src/background.ts",
		output: {
			file: `dist/${bg_script_name}`,
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
