import * as assert from "assert";
import { describe, it } from "mocha";
import type { Ring } from "../src/ring";
import * as ring from "../src/ring";

describe("Ring Buffer", () => {
	describe("push", () => {
		it("wraps around", () => {
			const r: Ring<number> = ring.create(2);
			ring.push(r, 1);
			ring.push(r, 2);
			ring.push(r, 3);
			assert.deepStrictEqual(r, {
				length: 2,
				maxSize: 2,
				cursor: 1,
				data: [3, 2],
			});
		});
	});
	it("iterates", () => {
		const r: Ring<number> = ring.create(5);
		ring.push(r, 1);
		ring.push(r, 2);
		const it = ring.iterate(r);
		assert.deepStrictEqual(it.next(), { value: 1, done: false });
		assert.deepStrictEqual(it.next(), { value: 2, done: false });
		assert.deepStrictEqual(it.next(), { value: undefined, done: true });
	});
	it("averageDiff", () => {
		const r: Ring<number> = ring.create(5);
		ring.push(r, 5);
		ring.push(r, 10);
		ring.push(r, 15);
		ring.push(r, 20);
		assert.equal(ring.averageDiff(r), 5);
	});
	it("average", () => {
		const r: Ring<number> = ring.create(5);
		ring.push(r, 10);
		ring.push(r, 20);
		ring.push(r, 30);
		assert.equal(ring.average(r), 20);
	});
});
