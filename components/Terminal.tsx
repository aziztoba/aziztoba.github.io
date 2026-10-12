"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  profile,
  projects,
  experience,
  education,
  skills,
} from "../data/profile";
import github from "../data/github.json";
import { themes } from "../lib/themes";
import { useTheme, useReducedMotion } from "./ThemeProvider";
import { ProceduralCanvas } from "./ProceduralCanvas";
import { Gallery } from "./Gallery";
type Block = { command: string; body: ReactNode };
function Output({
  children,
  reduced,
}: {
  children: ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced || !ref.current) return;
    const lines = Math.max(1, Math.ceil(ref.current.scrollHeight / 13));
    const animation = ref.current.animate(
      [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
      { duration: lines * 14, easing: `steps(${lines})` },
    );
    return () => animation.cancel();
  }, [reduced]);
  return (
    <div className="output" ref={ref}>
      {children}
    </div>
  );
}
export function Terminal({
  id,
  onNavigate,
  onTyping,
}: {
  id: string;
  onNavigate: (id: string) => void;
  onTyping: (value: boolean) => void;
}) {
  const { theme, setTheme } = useTheme(),
    reduced = useReducedMotion();
  const [progress, setProgress] = useState({ block: 0, chars: 0 });
  const project = projects.find((p) => p.id === id);
  let blocks: Block[] = [];
  if (project) {
    const repo = github.repos.find((r) => r.name === project.repo);
    blocks = [
      {
        command: `fetch ${project.id}`,
        body: (
          <>
            <h1>{project.name}</h1>
            <p>{project.summary}</p>
            <dl>
              <dt>work</dt>
              <dd>{project.organization}</dd>
              <dt>type</dt>
              <dd>
                {project.kind === "public"
                  ? "public repository"
                  : "professional project"}
              </dd>
              <dt>stack</dt>
              <dd>{project.stack.join(" · ")}</dd>
              {repo && (
                <>
                  <dt>updated</dt>
                  <dd>{repo.pushedAt.slice(0, 10)}</dd>
                </>
              )}
            </dl>
          </>
        ),
      },
      {
        command: "ls shots/",
        body: <Gallery key={project.id} project={project} />,
      },
      {
        command: "cat contribution.txt",
        body: (
          <ul className="contributions">
            {project.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ),
      },
      {
        command: "cat source.txt",
        body: repo ? (
          <a href={repo.url} target="_blank" rel="noreferrer">
            ↗ github.com/aziztoba/{repo.name}
          </a>
        ) : (
          <p className="dim">
            Employer project · source remains private.
            <br />
            Previews are original technical illustrations.
          </p>
        ),
      },
    ];
  } else if (id === "about") {
    blocks = [
      {
        command: "whoami",
        body: (
          <>
            <h1>
              {profile.name} <span className="dim">/ {profile.title}</span>
            </h1>
            <p>{profile.introduction}</p>
          </>
        ),
      },
      {
        command: "fetch github",
        body: (
          <dl>
            <dt>repos</dt>
            <dd>{github.publicRepos} public repositories</dd>
            <dt>updated</dt>
            <dd>{github.fetchedAt.slice(0, 10)}</dd>
          </dl>
        ),
      },
      {
        command: "ls links/",
        body: (
          <div className="links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              github ↗
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              linkedin ↗
            </a>
            <a href={`mailto:${profile.email}`}>email ↗</a>
            <a href={profile.resume} download>
              résumé.pdf ↓
            </a>
          </div>
        ),
      },
    ];
  } else if (id === "experience") {
    blocks = [
      {
        command: "git log --work",
        body: (
          <div className="career-tree">
            {experience.map((e) => (
              <section key={e.company}>
                <span className="dim">{e.period}</span>
                <h2>{e.company}</h2>
                <p className="accent">{e.role}</p>
                <p>{e.description}</p>
              </section>
            ))}
          </div>
        ),
      },
      {
        command: "cat education.txt",
        body: (
          <>
            <p>
              {education.degree}
              <br />
              {education.school} · {education.date}
            </p>
            <a href={profile.resume} download>
              ↓ download résumé.pdf
            </a>
          </>
        ),
      },
    ];
  } else if (id === "more") {
    blocks = [
      {
        command: "ls projects/",
        body: (
          <>
            {["professional", "public"].map((kind) => (
              <section className="archive-section" key={kind}>
                <h2>~/projects/{kind}/</h2>
                <div className="archive">
                  {projects
                    .filter((p) => !p.featured && p.kind === kind)
                    .map((p) => (
                      <button key={p.id} onClick={() => onNavigate(p.id)}>
                        <img src={`/previews/${p.id}-0.svg`} alt="" />
                        <strong>{p.name}</strong>
                        <span>{p.summary}</span>
                      </button>
                    ))}
                </div>
              </section>
            ))}
          </>
        ),
      },
      {
        command: "open github",
        body: (
          <a
            href={`${profile.github}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
          >
            ↗ explore public repositories
          </a>
        ),
      },
    ];
  } else if (id === "stack") {
    blocks = [
      {
        command: "git --languages",
        body: (
          <>
            <p className="dim">
              Primary languages · non-fork public repositories
            </p>
            {Object.entries(github.languages)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => (
                <div className="language" key={name}>
                  <span>{name}</span>
                  <span
                    className="language-bar"
                    style={{ width: `${(count / 24) * 65}%` }}
                  />
                  <span>{count}</span>
                </div>
              ))}
          </>
        ),
      },
      {
        command: "cat stack.txt",
        body: (
          <div className="skill-groups">
            {Object.entries(skills).map(([group, items]) => (
              <section key={group}>
                <h2>{group}/</h2>
                <p>{items.join(" · ")}</p>
              </section>
            ))}
          </div>
        ),
      },
      {
        command: "git log --graph",
        body: (
          <>
            <p>
              Public GitHub activity{" "}
              <span className="dim">· {github.fetchedAt.slice(0, 10)}</span>
            </p>
            <div className="contribution-calendar">
              {github.contributions.map((day, i) => (
                <span
                  key={i}
                  data-level={day.level}
                  title={`${day.date}: ${day.count ?? "activity"} contributions`}
                />
              ))}
            </div>
            <a href={profile.github} target="_blank" rel="noreferrer">
              ↗ github.com/aziztoba
            </a>
          </>
        ),
      },
    ];
  } else if (id === "themes") {
    blocks = [
      {
        command: "git log --graph themes/",
        body: (
          <>
            <p className="dim">28 colorschemes · select to apply</p>
            <div className="theme-archive">
              {themes.map((t, index) => (
                <button
                  key={t.id}
                  aria-label={t.name}
                  data-label={`${String(index + 1).padStart(2, "0")} · colorscheme`}
                  aria-pressed={t.id === theme.id}
                  onClick={() => setTheme(t.id)}
                  style={{ background: t.bg, color: t.fg }}
                >
                  <div className="theme-mini">
                    <span style={{ color: t.accent }}>
                      ╭─ aziztoba ─────────╮
                    </span>
                    <span>│ ░░ &gt; whoami │</span>
                    <span style={{ color: t.keyword }}>│ ▒▒ AI engineer │</span>
                    <span>╰──────────────────╯</span>
                  </div>
                  <span className="theme-name">{t.name}</span>
                  <span className="palette">
                    {t.colors.slice(0, 8).map((c, i) => (
                      <i key={i} style={{ background: c }} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </>
        ),
      },
    ];
  }
  const commands = blocks.map((b) => b.command).join("|");
  useEffect(() => {
    if (reduced) {
      setProgress({ block: 999, chars: 999 });
      onTyping(false);
      return;
    }
    let cancelled = false,
      timer: ReturnType<typeof setTimeout>,
      block = 0,
      chars = 0;
    const rows = commands.split("|");
    setProgress({ block, chars });
    onTyping(true);
    const tick = () => {
      if (cancelled) return;
      if (block >= rows.length) {
        onTyping(false);
        return;
      }
      if (chars < rows[block].length) {
        chars++;
        setProgress({ block, chars });
        timer = setTimeout(tick, 18 + Math.random() * 16);
      } else {
        block++;
        chars = 0;
        setProgress({ block, chars });
        timer = setTimeout(tick, 260);
      }
    };
    timer = setTimeout(tick, 170);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [commands, reduced, onTyping]);
  return (
    <>
      {id === "about" && (
        <div className="blueprint">
          <ProceduralCanvas kind="blueprint" />
        </div>
      )}
      {blocks.map(
        (block, i) =>
          i <= progress.block && (
            <section className="terminal-block" key={`${id}-${block.command}`}>
              <div className="prompt">
                <span>❯</span>{" "}
                {block.command.slice(
                  0,
                  i < progress.block ? undefined : progress.chars,
                )}
                {i === progress.block && <b className="cursor" />}
              </div>
              {i < progress.block && (
                <Output reduced={reduced}>{block.body}</Output>
              )}
            </section>
          ),
      )}
      {progress.block >= blocks.length && (
        <div className="prompt">
          <span>❯</span> <b className="cursor" />
        </div>
      )}
    </>
  );
}
