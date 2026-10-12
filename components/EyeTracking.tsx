"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "./ThemeProvider";

export function EyeTracking() {
  const ref = useRef<SVGSVGElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const svg = ref.current;
    const eye = document.querySelector(".editor-eye canvas");
    const buffer = document.querySelector(".buffer");
    if (!svg || !eye || !buffer) return;
    const lines = svg.querySelectorAll("line");
    const boxes = svg.querySelectorAll("rect");
    const pointer = (pointerRef.current ??= {
      x: innerWidth / 2,
      y: innerHeight / 2,
    });
    let frame = 0,
      last = 0;
    function draw() {
      if (document.hidden) return;
      const origin = eye!.getBoundingClientRect();
      if (!origin.width || document.querySelector("dialog[open]")) {
        svg!.style.visibility = "hidden";
        return;
      }
      svg!.style.visibility = "visible";
      // Keep the ray origin on the pupil drawn by ProceduralCanvas.
      const x =
        origin.x + origin.width * 0.5 + (pointer.x / innerWidth - 0.5) * 18;
      const y =
        origin.y + origin.height * 0.36 + (pointer.y / innerHeight - 0.5) * 12;
      const bounds = buffer!.getBoundingClientRect();
      const cursor = buffer!.querySelector(".cursor")?.getBoundingClientRect();
      const ghost = cursor
        ? {
            x: Math.max(
              bounds.left,
              Math.min(bounds.right, cursor.x + cursor.width / 2),
            ),
            y: Math.max(
              bounds.top + 7,
              Math.min(bounds.bottom - 7, cursor.y + cursor.height / 2),
            ),
          }
        : { x: bounds.left + 7, y: bounds.top + 20 };
      const command = document.querySelector<HTMLInputElement>(".cmd input");
      if (command) {
        const rect = command.getBoundingClientRect();
        ghost.x =
          rect.left + Math.min(rect.width - 4, command.value.length * 7.2 + 4);
        ghost.y = rect.top + rect.height / 2;
      }
      [pointer, ghost].forEach((target, index) => {
        for (const [name, value] of Object.entries({
          x1: x,
          y1: y,
          x2: target.x,
          y2: target.y,
        }))
          lines[index].setAttribute(name, String(value));
        boxes[index].setAttribute("x", String(target.x - 11));
        boxes[index].setAttribute("y", String(target.y - 6.5));
      });
    }
    function schedule() {
      if (reduced) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      }
    }
    function move(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      schedule();
    }
    function tick(now: number) {
      if (now - last > 33) {
        draw();
        last = now;
      }
      frame = requestAnimationFrame(tick);
    }
    const observer = new MutationObserver(schedule);
    observer.observe(buffer, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.addEventListener("pointermove", move);
    window.addEventListener("resize", schedule);
    document.addEventListener("scroll", schedule, true);
    document.addEventListener("input", schedule);
    document.addEventListener("keydown", schedule);
    document.addEventListener("click", schedule);
    draw();
    if (!reduced) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("scroll", schedule, true);
      document.removeEventListener("input", schedule);
      document.removeEventListener("keydown", schedule);
      document.removeEventListener("click", schedule);
    };
  }, [reduced]);
  return (
    <svg
      ref={ref}
      className="eye-tracking"
      aria-hidden="true"
      style={{ visibility: "hidden" }}
    >
      <line />
      <line />
      <rect width="22" height="13" />
      <rect width="22" height="13" />
    </svg>
  );
}
