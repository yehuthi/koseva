import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from "./package.json";
import { titleCase } from "title-case";

const bundleName = "koseva";

function patchManifest(contents) {
	const object = JSON.parse(contents);
	object.name = titleCase(pkg.name);
	object.version = pkg.version;
	object.description = pkg.description;
	object.content_scripts[0].js[0] = `${bundleName}.js`;
	return JSON.stringify(object);
}

export default {
	input: "src/koseva.ts",
	output: {
		file: `dist/${bundleName}.js`,
		format: 'cjs',
		plugins: [terser()]
	},
	plugins: [
		nodeResolve(),
		typescript(),
		compiler({ compilation_level: "ADVANCED" }),
		copy({
			targets: [
				{ src: "static/manifest.json", dest: "dist/", transform: patchManifest },
				{ src: "static/**/*.png", dest: "dist/" },
			],
		}),
	],
}