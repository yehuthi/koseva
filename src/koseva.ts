import he2paleo from "he2paleo";
import type { Ring } from "./ring";
import * as ring from "./ring";

/** Recursively converts the text in the node to Paleo-Hebrew. */
function convertInNode(element: Node) {
	if (element instanceof Text) {
		if (element.textContent)
			element.textContent = he2paleo(element.textContent);
	} else {
		element.childNodes.forEach(convertInNode);
	}
}

/** Runs the given function and returns the duration it took to execute in milliseconds. */
function time(f: () => void): number {
	const start = performance.now();
	f();
	const end = performance.now();
	return end - start;
}

/** Observes the given element for DOM mutations and converts the node's text to Paleo-Hebrew on changes. */
function observe(root: Node) {
	/*
	 * We don't react to every mutation immediately, because under pressure we can severely slow down
	 * the browser.
	 * Instead we measure the frequency of mutations, and the time it takes to process them. If the
	 * average process time is longer than the average frequency, then we'll probably degrade performance if
	 * we react immediately. So instead we defer processing with a timeout.
	 */

	/** The timestamps in which a mutation has occured. */
	const mutationFrequencyRing: Ring<number> = ring.create(4);
	/** The durations conversion took. */
	const processRing: Ring<number> = ring.create(4);
	/**
	 * Executes conversion on the relevant nodes indicated by the given {@link MutationRecord}s,
	 * and adds the duration to the process ring.
	 */
	const process = (records: MutationRecord[]) => {
		const duration = time(() => {
			records.forEach(({ target, type, addedNodes }) => {
				if (type === "childList") addedNodes.forEach(convertInNode);
				else convertInNode(target);
			});
		});
		ring.push(processRing, duration);
	};
	/** The current timeout handle, if exists. */
	let timeout: ReturnType<typeof setTimeout> | undefined;
	const observer = new MutationObserver(records => {
		ring.push(mutationFrequencyRing, performance.now());
		const frequency = ring.averageDiff(mutationFrequencyRing);
		const processDuration = ring.average(processRing);
		if ((frequency || Infinity) <= (processDuration || 0)) {
			if (!timeout) {
				const timeoutDuration: number = (processDuration || 100) * 5;
				timeout = setTimeout(() => {
					timeout = undefined;
					process(records);
				}, timeoutDuration);
			}
		} else {
			process(records);
		}
	});
	observer.observe(root, {
		subtree: true,
		childList: true,
	});
}

observe(document);
convertInNode(document);
