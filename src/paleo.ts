/** A tuples array that map from Hebrew letter to its Paleo-Hebrew equivalent. */
const he2paleo: [string, string][] = [
	// Despite that your editor is probably showing you the tuples have the Paleo-Hebrew letter first,
	// it's really the Hebrew letter that comes first (the whole text inside the brackets is RTL).
	["א", "𐤀"],
	["ב", "𐤁"],
	["ג", "𐤂"],
	["ד", "𐤃"],
	["ה", "𐤄"],
	["ו", "𐤅"],
	["ז", "𐤆"],
	["ח", "𐤇"],
	["ט", "𐤈"],
	["י", "𐤉"],
	["כ", "𐤊"],
	["ך", "𐤊"],
	["ל", "𐤋"],
	["מ", "𐤌"],
	["ם", "𐤌"],
	["נ", "𐤍"],
	["ן", "𐤍"],
	["ס", "𐤎"],
	["ע", "𐤏"],
	["פ", "𐤐"],
	["ף", "𐤐"],
	["צ", "𐤑"],
	["ץ", "𐤑"],
	["ק", "𐤒"],
	["ר", "𐤓"],
	["ש", "𐤔"],
	["ת", "𐤕"],
];

/**
 * Converts Hebrew in text into Paleo script.
 * Ignores niqqud and cantillation marks.
 */
export function convert(string: string): string {
	const str: string[] = [...string];
	for (let i = 0; i < str.length; i++) {
		const pair = he2paleo.find(([hebrew, _paleo]) => hebrew === str[i]);
		if (pair) str[i] = pair[1];
	}
	return str.join("");
}
