// TeX math syntax: `$x^2$` inline and `$$ … $$` display blocks are marked like code so they stand out while
// you type. Rendering (KaTeX) belongs to hybrid rendering, when the editor hides markup on the lines you are not on.
import type { EditorView, Plugin, StyleRange } from "fulgurite"

const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c)
const isDigit = (c: string | undefined) => c !== undefined && c >= "0" && c <= "9"

/** Pandoc's rules: `$` opens before a non-space and closes after a non-space, never before a digit, so `$5 and $6`
 *  stays money. `\$` is a literal dollar. `$$` runs to the next `$$`, across lines; unclosed, to the end like a fence.
 *  ponytail: a `$` inside a code span or fence still counts; skip those when someone writes shell prompts in math notes. */
function mathStyles(text: string): StyleRange[] {
  const out: StyleRange[] = []
  // The next `$` and `\` by indexOf, a native scan: looking at every character in JS is slow in QuickJS (a note with a
  // drawing's JSON is 150k of them), and so is its regex engine. Each is looked for again only once passed.
  let dollar = text.indexOf("$")
  let slash = text.indexOf("\\")
  let i = 0
  while (i < text.length) {
    if (dollar >= 0 && dollar < i) dollar = text.indexOf("$", i)
    if (slash >= 0 && slash < i) slash = text.indexOf("\\", i)
    i = dollar < 0 ? slash : slash < 0 ? dollar : Math.min(dollar, slash)
    if (i < 0) break
    if (text[i] === "\\") {
      i += 2
      continue
    }
    if (text[i + 1] === "$") {
      const close = text.indexOf("$$", i + 2)
      const end = close < 0 ? text.length : close + 2
      out.push({ start: i, end, style: "codeBlock" })
      i = end
      continue
    }
    if (isSpace(text[i + 1])) {
      i++
      continue
    }
    let j = i + 1
    let close = -1
    while (j < text.length && text[j] !== "\n") {
      if (text[j] === "\\" && text[j + 1] !== "\n") {
        j += 2
        continue
      }
      if (text[j] === "$") {
        if (isSpace(text[j - 1])) break // a dollar after a space is at best the next opener, never our closer
        if (!isDigit(text[j + 1])) {
          close = j
          break
        }
      }
      j++
    }
    if (close >= 0) {
      out.push({ start: i, end: close + 1, style: "inlineCode" })
      i = close + 1
    } else {
      i++
    }
  }
  return out
}

const plugin: Plugin = {
  onLoad(ctx) {
    ctx.settings.define([
      { key: "inline", name: "Highlight inline math", description: "$x^2$ within a line", type: "toggle", default: true },
      { key: "display", name: "Highlight display math", description: "$$ … $$ blocks, across lines", type: "toggle", default: true },
    ])
    ctx.editor.registerExtension({
      styles(text) {
        const on = ctx.settings.values()
        return mathStyles(text).filter((r) => (r.style === "codeBlock" ? on.display : on.inline) !== false)
      },
    })
    /** Wraps the selection (or nothing) in `open`/`close` and leaves the cursor inside. */
    const wrap = (open: string, close: string) => (view: EditorView) => {
      const [start, end] = view.selection ?? [view.cursor, view.cursor]
      const inner = view.text.slice(start, end)
      view.replace(start, end, open + inner + close)
      view.moveCursor(start + open.length + inner.length)
    }
    ctx.commands.add({ id: "insert-inline", name: "Insert inline math", editorCallback: wrap("$", "$") })
    ctx.commands.add({ id: "insert-block", name: "Insert math block", editorCallback: wrap("$$\n", "\n$$") })
  },
}

export default plugin
