// The page the app shows for a ```math block (main.ts registers it): the block's TeX typeset by KaTeX in the app's web
// view. "view" draws it at the note's width; "edit" is the TeX over its rendering, saving it as the block's text;
// "inline" typesets `$x^2$` as it goes in a line of text, which the app draws in place of the TeX.
import type { CodeBlockHost } from "fulgurite"
import katex from "katex"
import "katex/dist/katex.min.css"

const host = (window as unknown as { fulgurite: CodeBlockHost }).fulgurite
const root = document.getElementById("root")!
// Errors show as the TeX in red, the message on hover. Commands that load or link things stay off (KaTeX's default).
const render = (tex: string) => katex.render(tex, root, { displayMode: host.mode !== "inline", throwOnError: false })
// flow-root: the formula's margins count in the height the app gives it.
root.style.display = "flow-root"

if (host.mode === "edit") {
  document.documentElement.style.cssText = `height: 100%; color-scheme: ${host.dark ? "dark" : "light"}`
  document.body.style.cssText = "margin: 0; height: 100%; display: flex; flex-direction: column; background: Canvas; color: CanvasText"
  root.style.cssText += "; flex: 1; overflow: auto; padding: 0 16px"
  const input = document.createElement("textarea")
  input.style.cssText = "flex: 0 0 40%; resize: none; border: 0; border-bottom: 1px solid color-mix(in srgb, CanvasText 15%, transparent); outline: none; padding: 16px; font: 15px/1.5 ui-monospace, Consolas, monospace; background: none; color: inherit"
  input.spellcheck = false
  input.value = host.source.replace(/\n$/, "")
  input.addEventListener("input", () => {
    render(input.value)
    host.save(input.value + "\n")
  })
  document.body.prepend(input)
  render(input.value)
  input.focus()
} else if (host.mode === "inline") {
  // On nothing (the app trims the picture's sides), the formula's baseline in the middle of the height it says: the app
  // puts that middle on the line's baseline.
  document.documentElement.style.background = "transparent"
  document.body.style.cssText = `margin: 0; overflow: hidden; background: transparent; color: ${host.dark ? "#fff" : "#000"}`
  root.style.cssText = "display: inline-block; position: relative; padding: 0 2px; white-space: nowrap"   // one line, however narrow the frame
  render(host.source)
  const baseline = document.createElement("span")   // an empty inline block sits on the baseline
  baseline.style.cssText = "display: inline-block; width: 0; height: 0"
  root.append(baseline)
  void root.offsetHeight
  document.fonts.ready.then(() => {
    const box = root.getBoundingClientRect()
    const base = baseline.getBoundingClientRect().bottom - box.top
    const half = Math.ceil(Math.max(base, box.height - base)) + 1
    root.style.top = `${half - base}px`
    host.resize(2 * half)
  })
} else {
  document.body.style.cssText = `margin: 0; overflow: hidden; color: ${host.dark ? "#fff" : "#000"}`
  if (host.source.trim()) {
    render(host.source)
  } else {
    root.textContent = "Empty math block"
    root.style.cssText += "; font: 13px -apple-system, sans-serif; padding: 6px 0; opacity: 0.5"
  }
  // The app takes its picture at the first height it hears, so the fonts go in first (the layout starts their loads).
  void root.offsetHeight
  document.fonts.ready.then(() => {
    // A formula wider than the note, smaller: it's a picture, it can't scroll. By font size, not `zoom`: KaTeX is all
    // em, and WebKit gives a zoomed element's height unzoomed (a gap under the picture on iPhone).
    const fit = root.clientWidth / root.scrollWidth
    if (fit < 1) root.style.fontSize = `${fit}em`
    new ResizeObserver(() => host.resize(Math.ceil(root.getBoundingClientRect().height))).observe(root)
  })
}
