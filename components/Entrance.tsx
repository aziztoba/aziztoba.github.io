"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "./Brand";
import { ProceduralCanvas } from "./ProceduralCanvas";
import { ThemePicker } from "./ThemePicker";
import { useReducedMotion } from "./ThemeProvider";
import { codeScenes } from "../data/code";
import { EntranceTransition } from "./EntranceTransition";
function Syntax({ line }: { line: string }) {
  return (
    <>
      {line
        .split(
          /("[^"]*"|\/\/.*$|\b(?:public|private|readonly|async|await|var|const|let|return|if|for|foreach|yield|using|new|class|sealed|type|function|break)\b|\b\d+\b)/g,
        )
        .map((part, i) => (
          <span
            key={i}
            className={
              part.startsWith("//")
                ? "comment"
                : part.startsWith('"')
                  ? "string"
                  : /^\d+$/.test(part)
                    ? "number"
                    : /^(public|private|readonly|async|await|var|const|let|return|if|for|foreach|yield|using|new|class|sealed|type|function|break)$/.test(
                          part,
                        )
                      ? "keyword"
                      : ""
            }
          >
            {part}
          </span>
        ))}
    </>
  );
}
export function Entrance() {
  const [picker, setPicker] = useState(false);
  const [scene, setScene] = useState(0);
  const [cursor, setCursor] = useState(16);
  const [leaving, setLeaving] = useState(false);
  const reduced = useReducedMotion();
  const router = useRouter();
  const complete = useCallback(() => router.push("/site/"), [router]);
  const enter = useCallback(() => {
    if (reduced) complete();
    else setLeaving(true);
  }, [reduced, complete]);
  useEffect(() => {
    router.prefetch("/site/");
  }, [router]);
  const current = codeScenes[scene];
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setCursor((n) => (n + 1) % 36), 1800);
    const switcher = setInterval(
      () => setScene((n) => (n + 1) % codeScenes.length),
      22000,
    );
    return () => {
      clearInterval(timer);
      clearInterval(switcher);
    };
  }, [reduced]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        picker ||
        leaving ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.target instanceof HTMLInputElement
      )
        return;
      if (e.key === ":" || e.key === "t") {
        e.preventDefault();
        setPicker(true);
      } else if (
        e.key === "Enter" &&
        !(e.target as HTMLElement)?.closest("a,button")
      ) {
        e.preventDefault();
        enter();
      } else if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((n) => (n + 1) % 36);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((n) => (n + 35) % 36);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [picker, leaving, enter]);
  return (
    <main className={`entrance ${leaving ? "leaving" : ""}`}>
      <Brand />
      <h1 className="sr-only">Abdulaziz Toba — AI Engineer</h1>
      <div className="code-wall" aria-label="Animated illustrative code">
        <div className="code-lines">
          {(reduced
            ? current.code +
              "\n\n" +
              codeScenes[(scene + 1) % codeScenes.length].code
            : current.code
          )
            .split("\n")
            .map((line, i) => (
              <div
                key={i}
                className={`code-line ${i === cursor ? "current-line" : ""}`}
              >
                <span className="line-number">{120 + i}</span>
                <code>
                  <Syntax line={line} />
                  {i === cursor && <span className="code-caret" />}
                </code>
              </div>
            ))}
        </div>
        <div className="vim-line">
          <b>NORMAL</b>
          <span>{current.path}</span>
          <span>
            {120 + cursor}:1 {cursor ? "5%" : "Top"}
          </span>
        </div>
      </div>
      <div className="entrance-eye">
        <ProceduralCanvas kind="eye" />
      </div>
      <div className="entrance-desk">
        <ProceduralCanvas kind="desk" />
      </div>
      <footer className="entrance-footer">
        <span className="tagline">// intelligence, engineered.</span>
        <div>
          <button
            className="theme-trigger"
            aria-label="Change theme"
            onClick={() => setPicker(true)}
          >
            <span>⌁</span> :theme
          </button>
          <a
            className="enter"
            href="/site/"
            aria-label="Enter portfolio"
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              enter();
            }}
          >
            enter ↩
          </a>
        </div>
      </footer>
      {picker && <ThemePicker onClose={() => setPicker(false)} />}
      {leaving && <EntranceTransition onComplete={complete} />}
    </main>
  );
}
