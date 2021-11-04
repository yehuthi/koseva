import * as assert from "assert";
import { describe, it } from "mocha";
import * as paleo from "../src/paleo";

describe("Paleo Conversion", () => {
	it("converts", () => {
		assert.deepStrictEqual(paleo.convert("שלום"), "𐤔𐤋𐤅𐤌");
	});
	it("ignores non-Hebrew", () => {
		assert.deepStrictEqual(paleo.convert("Hello, עולם!"), "Hello, 𐤏𐤅𐤋𐤌!");
	});
	it("ignores niqqud", () => {
		assert.deepStrictEqual(paleo.convert("שָׁלוֹם"), "𐤔ָׁ𐤋𐤅ֹ𐤌");
	});
	it("ignores cantillation marks", () => {
		assert.deepStrictEqual(paleo.convert("משפטי֩"), "𐤌𐤔𐤐𐤈𐤉֩");
	});
});
