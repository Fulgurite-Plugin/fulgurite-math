# Math

TeX math in [fulgurite](https://github.com/fulgurite-plugin) notes: a ```` ```math ```` block (GitHub's) shows typeset by
[KaTeX](https://katex.org), and `$x^2$` within a line and `$$ … $$` blocks across lines stand out like code while you
type. Pandoc's rules decide what is `$` math: `$5 and $6` stays money and `\$` is a dollar sign.

- A ```` ```math ```` block shows as the formula; click (or tap) it to edit the TeX over its live rendering. A formula
  wider than the note is drawn smaller. Broken TeX shows in red.
- Commands: Insert inline math, Insert math block (a ```` ```math ```` block of the selection, if any, opened to edit)
- Options: highlight inline math, highlight display math

`$…$` and `$$…$$` are highlighted, not typeset: the app draws a plugin's page only for fenced blocks.

Bundles KaTeX (MIT) and its fonts (SIL Open Font License).

## Development

`npm run build` bundles `src/page.ts` (KaTeX and its fonts in one HTML page, which the app shows in its web view) into
`main.js` (`src/main.ts`, which registers that page for ```` ```math ```` blocks). See
[api](https://github.com/fulgurite-plugin/fulgurite-api).
