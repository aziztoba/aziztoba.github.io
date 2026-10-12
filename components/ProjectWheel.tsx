"use client";
import { useRef, type CSSProperties } from "react";
import { entries, projects } from "../data/profile";
import { Monogram } from "./Brand";
import { ProceduralCanvas } from "./ProceduralCanvas";
export function ProjectWheel({
  selected,
  onSelect,
  open,
}: {
  selected: string;
  onSelect: (id: string, commit?: boolean) => void;
  open: boolean;
}) {
  const current = projects.find((p) => p.id === selected)?.parent || selected;
  const index = Math.max(
    0,
    entries.findIndex((e) => e.id === current),
  );
  const drag = useRef<{ y: number; index: number; moved: boolean } | null>(
    null,
  );
  const lastWheel = useRef(0),
    dragged = useRef(false);
  function select(n: number) {
    onSelect(
      entries[((n % entries.length) + entries.length) % entries.length].id,
    );
  }
  return (
    <nav
      className={`wheel ${open ? "drawer-open" : ""}`}
      aria-label="Projects, experience and stack"
    >
      <ProceduralCanvas kind="tree" />
      <div
        role="listbox"
        aria-label="Projects, experience and stack"
        className="wheel-list"
        onWheel={(e) => {
          if (Date.now() - lastWheel.current < 100) return;
          lastWheel.current = Date.now();
          select(index + (e.deltaY > 0 ? 1 : -1));
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = { y: e.clientY, index, moved: false };
          dragged.current = false;
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const distance = d.y - e.clientY;
          if (Math.abs(distance) > 12) {
            d.moved = true;
            dragged.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            select(d.index + Math.round(distance / 72));
          }
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
          if (d?.moved)
            setTimeout(() => {
              dragged.current = false;
            }, 0);
        }}
        onPointerCancel={() => {
          drag.current = null;
          dragged.current = false;
        }}
      >
        {entries.map((entry, i) => {
          let offset = i - index;
          if (offset > entries.length / 2) offset -= entries.length;
          if (offset < -entries.length / 2) offset += entries.length;
          const chosen = offset === 0,
            p = projects.find((p) => p.id === entry.id);
          const style = {
            "--tile-x": `${chosen ? 3 : Math.pow(Math.abs(offset), 1.7) * 8}px`,
            "--tile-y": `${offset * 78}px`,
            "--rotation": `${offset * -5}deg`,
            "--scale": chosen ? 1 : 0.63,
            "--tile-opacity": Math.abs(offset) > 3 ? 0.38 : 0.74,
          } as CSSProperties;
          return (
            <button
              key={entry.id}
              className={`wheel-item ${chosen ? "selected" : ""}`}
              style={style}
              role="option"
              aria-label={entry.label}
              aria-selected={chosen}
              tabIndex={chosen ? 0 : -1}
              onClick={() => {
                if (!dragged.current) onSelect(entry.id, true);
              }}
            >
              {p ? (
                <img src={`/previews/${p.id}-0.svg`} alt="" draggable={false} />
              ) : entry.id === "about" ? (
                <div className="tile-monogram">
                  <Monogram />
                </div>
              ) : entry.id === "themes" ? (
                <div className="tile-colors">
                  {[
                    "#689e80",
                    "#8f57ff",
                    "#dd5670",
                    "#d8d4b4",
                    "#53b1ca",
                    "#d8a657",
                    "#c5d4cd",
                    "#746da5",
                  ].map((c) => (
                    <span key={c} style={{ background: c }} />
                  ))}
                </div>
              ) : (
                <div
                  className={`tile-text ${entry.id === "stack" ? "tile-stack" : ""}`}
                >
                  {entry.id === "stack"
                    ? "C#  ◇  TS  ◉\nλ  .NET  ⌘\nAI  ◈  SQL"
                    : entry.id === "more"
                      ? "{ … }"
                      : "~/work"}
                  <span>
                    {entry.id === "stack"
                      ? "LANGUAGES / TOOLS"
                      : entry.id === "more"
                        ? "PUBLIC & PROFESSIONAL"
                        : "ENGINEERING"}
                  </span>
                </div>
              )}
              <span className="wheel-caption">{entry.label}</span>
              {chosen && <span className="wheel-marker" />}
            </button>
          );
        })}
      </div>
      <p className="wheel-hint" aria-hidden="true">
        scroll · drag the wheel
      </p>
    </nav>
  );
}
