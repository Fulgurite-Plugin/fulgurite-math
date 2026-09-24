# Math

TeX math in [Fulgurite](https://github.com/Fulgurite-Plugin)'s editor: `$x^2$` within a line and `$$ … $$` blocks
across lines stand out like code while you type. Pandoc's rules decide what is math: `$5 and $6` stays money and `\$`
is a dollar sign.

- Commands: Insert inline math, Insert math block (around the selection, if any)
- Options: highlight inline math, highlight display math

Rendering (KaTeX) is not there yet.

## Development

See [api](https://github.com/Fulgurite-Plugin/fulgurite-api).
