# Math

TeX math in [fulgurite](https://github.com/fulgurite-plugin) notes, typeset by [KaTeX](https://katex.org) in place: a
```` ```math ```` block (GitHub's) and `$$ … $$` on lines of its own show as the formula, and `$x^2$` within a line shows as
the formula in the line. While you edit a line its TeX stands out like code. Pandoc's rules decide what is `$` math:
`$5 and $6` stays money and `\$` is a dollar sign.

- A ```` ```math ```` or `$$` block shows as the formula; click (or tap) it to edit the TeX over its live rendering. A
  formula wider than the note is drawn smaller. Broken TeX shows in red.
- `$…$` in a line shows as the formula on the line's baseline; put the cursor on the line to see its TeX.
- Commands: Insert inline math, Insert math block (a ```` ```math ```` block of the selection, if any, opened to edit)
- Options: highlight inline math, highlight display math

In-place `$…$` needs a fulgurite that draws a page's "inline" mode; an older one only highlights it.

Bundles KaTeX (MIT) and its fonts (SIL Open Font License).

## Development

`npm run build` bundles `src/page.ts` (KaTeX and its fonts in one HTML page, which the app shows in its web view) into
`main.js` (`src/main.ts`, which registers that page for `math`: the app draws ```` ```math ```` and `$$` blocks with it
in "view" mode and `$…$` in "inline" mode). See
[api](https://github.com/fulgurite-plugin/fulgurite-api).
