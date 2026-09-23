"use strict";
var __plugin = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });
  var isSpace = (c) => c === void 0 || /\s/.test(c);
  var isDigit = (c) => c !== void 0 && c >= "0" && c <= "9";
  function mathStyles(text) {
    const out = [];
    let i = 0;
    while (i < text.length) {
      const c = text[i];
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c !== "$") {
        i++;
        continue;
      }
      if (text[i + 1] === "$") {
        const close2 = text.indexOf("$$", i + 2);
        const end = close2 < 0 ? text.length : close2 + 2;
        out.push({ start: i, end, style: "codeBlock" });
        i = end;
        continue;
      }
      if (isSpace(text[i + 1])) {
        i++;
        continue;
      }
      let j = i + 1;
      let close = -1;
      while (j < text.length && text[j] !== "\n") {
        if (text[j] === "\\" && text[j + 1] !== "\n") {
          j += 2;
          continue;
        }
        if (text[j] === "$") {
          if (isSpace(text[j - 1])) break;
          if (!isDigit(text[j + 1])) {
            close = j;
            break;
          }
        }
        j++;
      }
      if (close >= 0) {
        out.push({ start: i, end: close + 1, style: "inlineCode" });
        i = close + 1;
      } else {
        i++;
      }
    }
    return out;
  }
  var plugin = {
    onLoad(ctx) {
      ctx.settings.define([
        { key: "inline", name: "Highlight inline math", description: "$x^2$ within a line", type: "toggle", default: true },
        { key: "display", name: "Highlight display math", description: "$$ \u2026 $$ blocks, across lines", type: "toggle", default: true }
      ]);
      ctx.editor.registerExtension({
        styles(text) {
          const on = ctx.settings.values();
          return mathStyles(text).filter((r) => (r.style === "codeBlock" ? on.display : on.inline) !== false);
        }
      });
      const wrap = (open, close) => (view) => {
        const [start, end] = view.selection ?? [view.cursor, view.cursor];
        const inner = view.text.slice(start, end);
        view.replace(start, end, open + inner + close);
        view.moveCursor(start + open.length + inner.length);
      };
      ctx.commands.add({ id: "insert-inline", name: "Insert inline math", editorCallback: wrap("$", "$") });
      ctx.commands.add({ id: "insert-block", name: "Insert math block", editorCallback: wrap("$$\n", "\n$$") });
    }
  };
  var main_default = plugin;
  return __toCommonJS(main_exports);
})();
