import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toString(tree);
		const stats = readingTime(textOnPage);
		if (!data.fm) data.fm = {};
		data.fm.readingTime = stats.text;
	};
}
