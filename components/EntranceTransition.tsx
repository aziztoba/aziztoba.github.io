"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion, useTheme } from "./ThemeProvider";

const duration = 2800;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const random = (n: number) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export function EntranceTransition({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reduced) {
      onComplete();
      return;
    }
    let frame = 0;
    let width = innerWidth;
    let height = innerHeight;
    const started = performance.now();
    const eye = document
      .querySelector(".entrance-eye")
      ?.getBoundingClientRect();
    const origin = {
      x: eye?.width ? (eye.x + eye.width / 2) / width : 0.7,
      y: eye?.height ? (eye.y + eye.height * 0.36) / height : 0.42,
    };
    const codeBox = document
      .querySelector(".code-wall")
      ?.getBoundingClientRect();
    const lines = Array.from(
      document.querySelectorAll<HTMLElement>(".code-line code"),
    ).map((line) => {
      const box = line.getBoundingClientRect();
      const style = getComputedStyle(line);
      return {
        text: line.textContent || "",
        x: box.x,
        y: box.y + parseFloat(style.fontSize),
        font: style.font,
        size: parseFloat(style.fontSize),
      };
    });
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const elapsed = now - started;
      ctx.clearRect(0, 0, width, height);

      // Replace the visible code with dissolving glyphs before the eye expands.
      if (elapsed < 850 && codeBox) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = theme.bg;
        ctx.fillRect(codeBox.x, codeBox.y, codeBox.width, codeBox.height);
        const dissolve = clamp((elapsed - 380) / 420);
        const glyphs = "01<>/{}[]:;=+*#%";
        for (const [row, line] of lines.entries()) {
          ctx.font = line.font;
          const cell = ctx.measureText("M").width || line.size * 0.6;
          for (let col = 0; col < line.text.length; col++) {
            const seed = row * 151 + col;
            if (line.text[col] === " " || random(seed) < dissolve) continue;
            const flicker = random(seed + Math.floor(elapsed / 65));
            ctx.globalAlpha = (0.3 + flicker * 0.65) * (1 - dissolve * 0.6);
            ctx.fillStyle = theme.fg;
            ctx.fillText(
              flicker > 0.45
                ? glyphs[Math.floor(flicker * glyphs.length)]
                : line.text[col],
              line.x + col * cell,
              line.y,
            );
          }
        }
      }

      ctx.globalAlpha = clamp((elapsed - 600) / 220);
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);
      const progress = clamp((elapsed - 700) / 1900);
      if (elapsed > 700) {
        const travel = 1 - Math.pow(1 - clamp(progress / 0.65), 3);
        const cx = width * (origin.x + (0.5 - origin.x) * travel);
        const cy = height * (origin.y + (0.5 - origin.y) * travel);
        const size = Math.min(width, height);
        const cover = Math.hypot(width, height);
        const growth = clamp(progress / 0.16);
        const rush = Math.pow(clamp((progress - 0.8) / 0.2), 3);
        const radius =
          size * (0.23 + progress * 0.23) * (1 - Math.pow(1 - growth, 3)) +
          rush * cover;
        const glow = ctx.createRadialGradient(
          cx,
          cy,
          radius,
          cx,
          cy,
          radius + size * 0.23,
        );
        glow.addColorStop(0, theme.fg + "30");
        glow.addColorStop(1, theme.fg + "00");
        ctx.globalAlpha = clamp(progress * 10);
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        const count = Math.min(
          2800,
          Math.max(700, Math.round((width * height) / 480)),
        );
        ctx.strokeStyle = theme.fg;
        ctx.lineWidth = Math.max(0.65, size / 1050);
        for (let i = 0; i < count; i++) {
          const angle = random(i * 3) * Math.PI * 2;
          const distance =
            (random(i * 3 + 1) + progress * (0.22 + random(i) * 0.18)) % 1;
          const radial = radius + 5 + distance * distance * cover * 0.65;
          const length =
            ((6 + Math.pow(1 - distance, 2) * (12 + random(i * 3 + 2) * 36)) *
              size) /
            900;
          ctx.globalAlpha =
            clamp(progress * 8) * (0.22 + Math.pow(1 - distance, 2) * 0.6);
          ctx.beginPath();
          ctx.moveTo(
            cx + Math.cos(angle) * radial,
            cy + Math.sin(angle) * radial,
          );
          ctx.lineTo(
            cx + Math.cos(angle) * (radial + length),
            cy + Math.sin(angle) * (radial + length),
          );
          ctx.stroke();
        }
        for (const [extra, opacity] of [
          [12, 0.035],
          [7, 0.065],
          [2, 0.18],
          [0, 0.75],
        ]) {
          ctx.globalAlpha = opacity * clamp(progress * 10);
          ctx.lineWidth = extra || 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius + extra / 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (elapsed >= duration) onComplete();
      else frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete, reduced, theme]);

  return (
    <canvas ref={ref} className="entrance-transition" aria-hidden="true" />
  );
}
