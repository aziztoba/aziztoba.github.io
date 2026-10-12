"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { entries, projects } from "../data/profile";
import github from "../data/github.json";
import { resolveCommand } from "../lib/commands";
import { useTheme } from "./ThemeProvider";
import { Brand } from "./Brand";
import { ProjectWheel } from "./ProjectWheel";
import { Terminal } from "./Terminal";
import { ProceduralCanvas } from "./ProceduralCanvas";
import { galleryEvent } from "./Gallery";
export function Portfolio() {
  const [id, setId] = useState("about"),
    [drawer, setDrawer] = useState(false),
    [command, setCommand] = useState<string | null>(null),
    [message, setMessage] = useState(""),
    [typing, setTyping] = useState(false),
    [worm, setWorm] = useState(false);
  const buffer = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const onTyping = useCallback((value: boolean) => setTyping(value), []);
  const navigate = useCallback((next: string, commit = false) => {
    if (![...entries, ...projects].some((e) => e.id === next)) next = "about";
    setId(next);
    setMessage("");
    if (location.hash !== `#${next}`) history.pushState(null, "", `#${next}`);
    buffer.current?.scrollTo(0, 0);
    if (commit) {
      setDrawer(false);
      requestAnimationFrame(() => buffer.current?.focus());
    }
  }, []);
  useEffect(() => {
    const update = () => {
      let next = "about";
      try {
        next = decodeURIComponent(location.hash.slice(1)) || "about";
      } catch {}
      navigate(next);
    };
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    try {
      setWorm(localStorage.getItem("aziz-worm") === "true");
    } catch {}
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, [navigate]);
  useEffect(() => {
    if (command !== null) input.current?.focus();
  }, [command]);
  const focusWheel = () => {
    if (matchMedia("(max-width: 700px)").matches) setDrawer(true);
    requestAnimationFrame(() =>
      (document.querySelector(".wheel-item.selected") as HTMLElement)?.focus(),
    );
  };
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        document.querySelector("dialog[open]")
      )
        return;
      if ((event.target as HTMLElement)?.matches("input,textarea")) return;
      const key = event.key;
      if (key === ":") {
        event.preventDefault();
        setCommand("");
        setMessage("");
        return;
      }
      const inside = buffer.current?.contains(document.activeElement);
      const control = (event.target as HTMLElement)?.closest("a,button");
      if (
        key === "Tab" &&
        (control?.matches(".wheel-item") ||
          (event.shiftKey && event.target === buffer.current))
      ) {
        event.preventDefault();
        if (inside) focusWheel();
        else buffer.current?.focus();
        return;
      }
      if (inside) {
        if (
          ["j", "k", "ArrowDown", "ArrowUp", "d", "u", "g", "G"].includes(
            key,
          ) &&
          !control
        ) {
          event.preventDefault();
          const el = buffer.current!;
          if (key === "g") el.scrollTop = 0;
          else if (key === "G") el.scrollTop = el.scrollHeight;
          else
            el.scrollBy({
              top: ["k", "ArrowUp", "u"].includes(key)
                ? -(key === "u" ? el.clientHeight / 2 : 13)
                : key === "d"
                  ? el.clientHeight / 2
                  : 13,
            });
        }
        if (key === "Escape") {
          event.preventDefault();
          focusWheel();
        }
        if (key === "Enter" && !control) {
          event.preventDefault();
          window.dispatchEvent(
            new CustomEvent(galleryEvent, { detail: "zoom" }),
          );
        }
        if (key === " " && !control) {
          event.preventDefault();
          window.dispatchEvent(
            new CustomEvent(galleryEvent, { detail: "toggle" }),
          );
        }
      } else {
        if (["j", "k", "ArrowDown", "ArrowUp"].includes(key)) {
          event.preventDefault();
          const current = projects.find((p) => p.id === id)?.parent || id;
          const index = entries.findIndex((e) => e.id === current);
          navigate(
            entries[
              (index +
                (["k", "ArrowUp"].includes(key) ? -1 : 1) +
                entries.length) %
                entries.length
            ].id,
          );
          requestAnimationFrame(() =>
            (
              document.querySelector(".wheel-item.selected") as HTMLElement
            )?.focus(),
          );
        }
        if (
          key === "Enter" &&
          !(event.target as HTMLElement)?.closest("a,button")
        ) {
          event.preventDefault();
          setDrawer(false);
          buffer.current?.focus();
        }
        if (key === "Escape") setDrawer(false);
      }
      if (["ArrowLeft", "ArrowRight", "h", "l"].includes(key)) {
        event.preventDefault();
        window.dispatchEvent(
          new CustomEvent(galleryEvent, {
            detail: key === "ArrowLeft" || key === "h" ? -1 : 1,
          }),
        );
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [id, navigate]);
  function execute() {
    const action = resolveCommand(command || "", id, theme.id);
    setCommand(null);
    if (action.type === "navigate") navigate(action.id, true);
    if (action.type === "theme") setTheme(action.id);
    if (action.type === "message") setMessage(action.message);
    if (action.type === "exit") location.assign("/");
  }
  const project = projects.find((p) => p.id === id),
    repo = github.repos.find((r) => r.name === project?.repo);
  return (
    <main className="portfolio">
      <Brand />
      <div className="editor">
        <button
          className="mobile-tab"
          aria-label="Browse projects"
          aria-expanded={drawer}
          aria-controls="project-navigation"
          onClick={() => setDrawer((v) => !v)}
        >
          ~/Projects <span>{drawer ? "−" : "+"}</span>
        </button>
        <div
          id="project-navigation"
          className={`navigation-host ${drawer ? "open" : ""}`}
        >
          <ProjectWheel selected={id} onSelect={navigate} open={drawer} />
        </div>
        <section className="terminal-region">
          <div className="winbar">
            {project
              ? `~/Projects/${project.name}`
              : id === "about"
                ? "~/README.md"
                : `~/${id}/`}
          </div>
          <div
            className="buffer"
            ref={buffer}
            tabIndex={0}
            role="region"
            aria-label="Terminal content"
          >
            <Terminal
              id={id}
              onNavigate={(next) => navigate(next, true)}
              onTyping={onTyping}
            />
          </div>
        </section>
        <aside className="editor-eye" aria-hidden="true">
          <ProceduralCanvas kind="eye" active={typing} />
        </aside>
      </div>
      <footer className="editor-status">
        <div className="status-main">
          <strong>AZIZTOBA</strong>
          <div className="cmd">
            {command !== null ? (
              <label>
                :
                <input
                  ref={input}
                  aria-label="Vim command"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      execute();
                    }
                    if (
                      event.key === "Escape" ||
                      (event.key === "Backspace" && !command)
                    ) {
                      setCommand(null);
                      focusWheel();
                    }
                  }}
                />
              </label>
            ) : (
              message || (
                <>
                  <span className="desktop-hint">
                    :cmd · ↑↓ wheel · tab buffer
                  </span>
                  <span className="mobile-hint">tap ~/Projects · :cmd</span>
                </>
              )
            )}
          </div>
        </div>
        <div className="project-stats">
          <span>
            {repo
              ? `☆ ${repo.stars} · forks ${repo.forks}`
              : project
                ? "work / private source"
                : `${github.followers} followers · ☆ ${github.stars}`}
          </span>
          <span className="dim">
            {project?.organization || "github / public"}
          </span>
        </div>
        <div className="agent-status">
          <span>
            WORM{" "}
            <button
              aria-label="Toggle worm"
              aria-pressed={worm}
              onClick={() => {
                setWorm((v) => !v);
                try {
                  localStorage.setItem("aziz-worm", String(!worm));
                } catch {}
              }}
            >
              {worm ? "on" : "off"}
            </button>
          </span>
          <span>
            EYE <i>●</i> · tracking
          </span>
          <span>GHOST · {typing ? "typing" : "idle"}</span>
        </div>
        <a
          className="activity"
          href="https://github.com/aziztoba"
          target="_blank"
          rel="noreferrer"
          title={`Public GitHub activity · ${github.fetchedAt.slice(0, 10)}`}
        >
          <span>GitHub · {github.publicRepos} repos</span>
          <span className="activity-bars">
            {github.contributions.slice(-56).map((d, i) => (
              <i key={i} style={{ height: `${2 + d.level * 3}px` }} />
            ))}
          </span>
        </a>
      </footer>
      <div className="editor-desk" aria-hidden="true">
        <ProceduralCanvas kind="desk" active={typing} />
      </div>
      {worm && (
        <div className="worm" aria-hidden="true">
          · · · · · · · ●
        </div>
      )}
    </main>
  );
}
