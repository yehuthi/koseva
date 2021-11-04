/** Ring buffer container. */
export interface Ring<T> {
	length: number;
	maxSize: number;
	cursor: number;
	data: T[];
}

/** Creates a new ring buffer of the given size. */
export function create<T>(maxSize: number): Ring<T> {
	return {
		length: 0,
		maxSize,
		cursor: 0,
		data: new Array(maxSize),
	};
}

/** Pushes a value into the ring buffer. */
export function push<T>(ring: Ring<T>, value: T) {
	ring.data[ring.cursor] = value;
	ring.cursor = (ring.cursor + 1) % ring.maxSize;
	if (ring.length < ring.maxSize) ring.length++;
}

/** Iterates the values of the ring buffer in insertion order (FIFO). */
export function* iterate<T>(ring: Ring<T>): Generator<T> {
	for (let i = ring.cursor; i < ring.length; i++) {
		yield ring.data[i];
	}
	for (let i = 0; i < ring.cursor; i++) {
		yield ring.data[i];
	}
}

/**
 * Iterates the values in overlapping pairs.
 * E.g. [1,2,3,4] would yield the pairs: [1,2] [2,3] [3,4].
 */
function* iteratePairs<T>(iterator: Iterator<T>): Generator<[T, T]> {
	let { value: v1, done } = iterator.next();
	if (done) return;
	let previous = v1;
	for (;;) {
		let { value: next, done } = iterator.next();
		if (done) return;
		yield [previous, next];
		previous = next;
	}
}

/**
 * Computes the average of the numbers in the ring.
 * @returns The average or undefined if the ring is empty.
 */
export function average(ring: Ring<number>): number | undefined {
	if (ring.length == 0) return undefined;
	let sum: number = 0;
	for (const n of iterate(ring)) {
		sum += n;
	}
	return sum / ring.length;
}

/**
 * Computes the average of the differences, in insertion order.
 * E.g. given a list of dates, returns the average of the duration between them.
 *
 * @returns The average of the differences, or undefined if the ring has less-than 2 values.
 */
export function averageDiff(ring: Ring<number>): number | undefined {
	if (ring.length <= 1) return undefined;
	let sum = 0;
	for (const [n, m] of iteratePairs(iterate(ring))) {
		sum += m - n;
	}
	return sum / (ring.length - 1);
}
