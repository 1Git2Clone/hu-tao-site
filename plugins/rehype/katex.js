import rehypeKatex from 'rehype-katex';

export const REHYPE_KATEX = [rehypeKatex, {
  output: 'html',
  strict: false
}];
