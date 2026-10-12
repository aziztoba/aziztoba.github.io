"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/profile";
import { useReducedMotion } from "./ThemeProvider";
export const galleryEvent = "portfolio-gallery";
const filenames = ["overview.svg", "workflow.svg", "engineering.svg"];
export function Gallery({ project }: { project: Project }) {
  const [shot, setShot] = useState(0),
    [large, setLarge] = useState(false),
    [paused, setPaused] = useState(false);
  const hold = useRef(0),
    reduced = useReducedMotion(),
    zoom = useRef<HTMLButtonElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    video = useRef<HTMLVideoElement>(null);
  const isVideo = project.id === "voice-agent" && shot === 2;
  const filename = isVideo ? "workflow-study.mp4" : filenames[shot];
  const [loading, setLoading] = useState(false);
  function toggle() {
    if (isVideo && video.current) {
      if (video.current.paused)
        void video.current.play().catch(() => setPaused(true));
      else video.current.pause();
    } else setPaused((p) => !p);
  }
  const step = (n: number) => {
    hold.current = Date.now() + 8000;
    setShot((s) => (s + n + 3) % 3);
  };
  useEffect(() => {
    const event = (e: Event) => {
      const action = (e as CustomEvent).detail;
      if (action === "zoom") setLarge(true);
      else if (action === "toggle") toggle();
      else if (typeof action === "number") {
        hold.current = Date.now() + 8000;
        setShot((s) => (s + action + 3) % 3);
      }
    };
    window.addEventListener(galleryEvent, event);
    return () => window.removeEventListener(galleryEvent, event);
  }, [isVideo]);
  useEffect(() => {
    if (reduced || paused || large || isVideo) return;
    const timer = setInterval(() => {
      if (Date.now() > hold.current && !document.hidden)
        setShot((s) => (s + 1) % 3);
    }, 3800);
    return () => clearInterval(timer);
  }, [reduced, paused, large, isVideo]);
  useEffect(() => {
    if (large) dialog.current?.showModal();
  }, [large]);
  function close() {
    setLarge(false);
    requestAnimationFrame(() => zoom.current?.focus());
  }
  return (
    <>
      <figure className="gallery">
        <figcaption>
          <span>{filename}</span>
          <span>{shot + 1}/3</span>
          <span className="shot-hint">←→ shot</span>
        </figcaption>
        <div className="frame">
          {isVideo ? (
            <video
              ref={video}
              src="/previews/voice-agent-study.mp4"
              poster="/previews/voice-agent-2.svg"
              controls
              playsInline
              muted
              loop
              preload="none"
              aria-label="Original voice workflow animation"
              onLoadStart={() => setLoading(true)}
              onCanPlay={() => setLoading(false)}
            />
          ) : (
            <img
              src={`/previews/${project.id}-${shot}.svg`}
              alt={`${project.name} — ${filename} (original technical illustration)`}
            />
          )}
          {isVideo && loading && (
            <span className="video-loading">loading film…</span>
          )}
          <button
            ref={zoom}
            className="zoom-button"
            aria-label="View large"
            onClick={() => setLarge(true)}
          >
            ⛶
          </button>
          {!isVideo && (
            <button
              className="play-button"
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "▷" : "Ⅱ"}
            </button>
          )}
          {!isVideo && (
            <div
              className="slide-progress"
              key={shot}
              style={{ animationPlayState: paused ? "paused" : "running" }}
            />
          )}
        </div>
        <div className="gallery-controls">
          <span className="dim">illustrative study · no private data</span>
          <div>
            {filenames.map((_, i) => (
              <button
                key={i}
                aria-label={`Shot ${i + 1} of 3`}
                aria-pressed={shot === i}
                onClick={() => {
                  hold.current = Date.now() + 8000;
                  setShot(i);
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </figure>
      {large && (
        <dialog
          ref={dialog}
          className="lightbox"
          aria-label={`${project.name} enlarged preview`}
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === dialog.current) close();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "ArrowRight") {
              e.preventDefault();
              step(1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              step(-1);
            }
          }}
        >
          <button
            className="lightbox-close"
            onClick={close}
            aria-label="Close preview"
          >
            esc ×
          </button>
          {isVideo ? (
            <video
              src="/previews/voice-agent-study.mp4"
              controls
              playsInline
              muted
              loop
              preload="metadata"
              aria-label="Enlarged voice workflow animation"
            />
          ) : (
            <img
              src={`/previews/${project.id}-${shot}.svg`}
              alt={`${project.name} — original technical illustration`}
            />
          )}
          <div className="lightbox-caption">
            <span>
              {project.name} · shots {shot + 1}/3 · {filename} · 920×560
            </span>
            <span>
              <button aria-label="Previous image" onClick={() => step(-1)}>
                ←
              </button>
              <button aria-label="Next image" onClick={() => step(1)}>
                →
              </button>{" "}
              shot · esc
            </span>
          </div>
        </dialog>
      )}
    </>
  );
}
