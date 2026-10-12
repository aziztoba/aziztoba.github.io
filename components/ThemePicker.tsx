"use client";
import { useEffect, useRef, useState } from "react";
import { themes } from "../lib/themes";
import { useTheme } from "./ThemeProvider";
export function ThemePicker({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const start = useRef(theme.id);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = themes.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()),
  );
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    input.current?.focus();
    return () => previous?.focus();
  }, []);
  useEffect(() => {
    dialog.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [index, query]);
  function cancel() {
    setTheme(start.current);
    onClose();
  }
  return (
    <dialog
      ref={dialog}
      className="theme-picker"
      aria-label="Colorscheme"
      onCancel={(e) => {
        e.preventDefault();
        cancel();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) cancel();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          const next =
            (index + (e.key === "ArrowDown" ? 1 : -1) + filtered.length) %
            Math.max(1, filtered.length);
          setIndex(next);
          if (filtered[next]) setTheme(filtered[next].id);
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (filtered[index]) {
            setTheme(filtered[index].id);
            onClose();
          }
        }
      }}
    >
      <fieldset>
        <legend>colorscheme</legend>
        <div className="picker-search">
          :
          <input
            ref={input}
            value={query}
            aria-label="Search themes"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
              const t = themes.find((t) =>
                t.name.includes(e.target.value.toLowerCase()),
              );
              if (t) setTheme(t.id);
            }}
          />
        </div>
        <div className="picker-list" role="listbox" aria-label="Themes">
          {filtered.map((t, i) => (
            <button
              key={t.id}
              role="option"
              aria-selected={i === index}
              tabIndex={-1}
              onMouseEnter={() => {
                setIndex(i);
                setTheme(t.id);
              }}
              onClick={() => {
                setTheme(t.id);
                onClose();
              }}
            >
              <span>
                {i === index ? "›" : " "} {t.name}
              </span>
              <span className="swatches">
                {t.colors.slice(1, 8).map((c, n) => (
                  <i key={n} style={{ background: c }} />
                ))}
              </span>
              {t.light && <small>light</small>}
            </button>
          ))}
          {!filtered.length && <p className="dim">no matching colorscheme</p>}
        </div>
        <div className="picker-foot">
          <button onClick={cancel} aria-label="Cancel theme selection">
            esc
          </button>
          <span>
            {filtered.length ? index + 1 : 0}/{filtered.length}
          </span>
        </div>
      </fieldset>
    </dialog>
  );
}
