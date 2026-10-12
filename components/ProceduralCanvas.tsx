"use client";
import { useEffect, useRef } from "react";
import { useTheme, useReducedMotion } from "./ThemeProvider";
import github from "../data/github.json";
type Kind = "desk" | "eye" | "tree" | "blueprint";
const random = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function ProceduralCanvas({
  kind,
  active = false,
}: {
  kind: Kind;
  active?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0,
      last = 0,
      width = 0,
      height = 0,
      pressed = 0;
    const started = performance.now();
    const pointer = pointerRef.current;
    let visible = true;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      width = r.width;
      height = r.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };
    const move = (e: PointerEvent) => {
      pointer.x = e.clientX / innerWidth;
      pointer.y = e.clientY / innerHeight;
      if (reduced) draw(0);
    };
    const key = () => {
      pressed = performance.now();
    };
    const visibility = () => {
      visible = !document.hidden;
    };
    function line(points: number[][], alpha = 0.5, color = theme.fg) {
      ctx!.strokeStyle = color;
      ctx!.globalAlpha = alpha;
      ctx!.lineWidth = 0.55;
      ctx!.beginPath();
      points.forEach(([x, y], i) =>
        i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y),
      );
      ctx!.stroke();
    }
    function text(
      value: string,
      x: number,
      y: number,
      size = 8,
      alpha = 0.7,
      color = theme.fg,
    ) {
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = color;
      ctx!.font = `${size}px "Plex Mono", monospace`;
      ctx!.fillText(value, x, y);
    }
    function draw(now: number) {
      if (!ctx || !width) return;
      const time = reduced ? 0 : now * 0.001;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      if (kind === "desk") {
        const scale = Math.min(1, width / 580);
        ctx.save();
        ctx.translate(width / 2, height - 10);
        ctx.scale(scale, scale);
        const rows = [
          "esc ` 1 2 3 4 5 6 7 8 9 0 - =   ←",
          "q w e r t y u i o p [ ] \\",
          "a s d f g h j k l ;   ↩",
          "⇧  z x c v b n m , . /  ⇧",
        ];
        rows.forEach((r, i) => text(r, -181 + i * 17, -163 + i * 26, 12, 0.15));
        const tap =
          now - pressed < 180
            ? Math.sin(((now - pressed) / 180) * Math.PI) * 9
            : Math.sin(time * 2.4) * 2;
        for (const side of [-1, 1]) {
          const x = side * 63 - 42;
          line(
            [
              [x, -114],
              [x + 84, -114],
              [x + 84, -5],
              [x, -5],
              [x, -114],
            ],
            0.35,
          );
          const wrist = [x + 47, -11];
          const tips: number[][] = [];
          for (let f = 0; f < 4; f++) {
            const fx = x + 9 + f * 21,
              fy = -111 + (f === 0 ? 8 : 0) + (f % 2 ? tap : -tap * 0.5);
            const joints = [
              [fx, fy],
              [fx + side * 1, fy + 14],
              [fx + side * 3, fy + 28],
              [fx + side * 7, -70],
            ];
            tips.push(joints[3]);
            line([...joints, wrist], 0.7);
            joints.forEach((p) => {
              ctx!.globalAlpha = 0.8;
              ctx!.fillStyle = theme.fg;
              ctx!.fillRect(p[0], p[1], 1.5, 1.5);
            });
          }
          line(tips, 0.65);
          line([wrist, [x + 72, -27], [x + 77, -56]], 0.6);
          text(
            `['hand:${side < 0 ? "l" : "r"}'] ${(pointer.x * 0.2 + 0.4).toFixed(6)}`,
            x - 4,
            -121,
            7,
            0.7,
          );
        }
        line(
          [
            [-60, -58],
            [60, -58],
          ],
          0.3,
        );
        ctx.restore();
      } else if (kind === "eye") {
        const cx = width * 0.5 + (pointer.x - 0.5) * 18,
          cy = height * 0.36 + (pointer.y - 0.5) * 12;
        const blink = !reduced && Math.sin(time * 0.63) > 0.989 ? 0.13 : 1;
        const chars = ".:;|/01 <> ~ _";
        for (let row = 0; row < 26; row++)
          for (let col = 0; col < 43; col++) {
            const x = col * 4.2,
              y = row * 4.3,
              dx = (x - width * 0.5) / (width * 0.49),
              dy = (y - height * 0.3) / (height * 0.26);
            if (dx * dx + dy * dy < 1) {
              const inEye =
                Math.pow((x - cx) / 27, 2) +
                  Math.pow((y - cy) / (12 * blink), 2) <
                1;
              const pupil = Math.hypot(x - cx, y - cy / blink) < 5;
              text(
                pupil
                  ? " "
                  : chars[Math.floor(random(col + row * 43) * chars.length)],
                x,
                y,
                4.5,
                inEye ? 0.82 : 0.2,
              );
            }
          }
        line(
          [
            [cx - 26, cy],
            [cx - 12, cy - 9 * blink],
            [cx + 12, cy - 9 * blink],
            [cx + 26, cy],
            [cx + 12, cy + 9 * blink],
            [cx - 12, cy + 9 * blink],
            [cx - 26, cy],
          ],
          0.55,
        );
        text(`['pupil:u'] ${pointer.x.toFixed(7)}`, 8, height * 0.74, 7, 0.65);
        text(pointer.y.toFixed(7), 8, height * 0.74 + 10, 7, 0.65);
        text(active ? "focused" : "tracking", 8, height * 0.74 + 20, 7, 0.6);
      } else if (kind === "tree") {
        const x = width - 39;
        let prev = [x, height];
        for (
          let n = 0;
          n < 600 * (reduced ? 1 : Math.min(1, (now - started) / 1700));
          n++
        ) {
          const y = height - (n * height) / 600,
            xx = x + Math.sin(n * 0.0204) * 15;
          line([prev, [xx, y]], 0.68);
          prev = [xx, y];
          const cluster = Math.pow(Math.max(0, Math.sin(n * 0.0482)), 4);
          if (cluster > 0.06) {
            const end = [
              xx - 15 - random(n) * 95 * cluster,
              y - random(n + 3) * 60,
            ];
            const joint = [xx - 10, y - 10];
            line([[xx, y], joint, end], 0.4 + random(n) * 0.4);
            if (n % 2 === 0)
              line(
                [
                  end,
                  [end[0] + random(n + 8) * 35, end[1] - 12 - random(n) * 35],
                ],
                0.28,
              );
            ctx.fillStyle = theme.fg;
            ctx.globalAlpha = 0.6;
            ctx.fillRect(end[0], end[1], 1.3, 1.3);
          }
        }
        text(github.fetchedAt.slice(0, 10), width - 95, height - 7, 8, 0.6);
      } else {
        const w = width,
          h = height;
        line(
          [
            [0.5, 0.5],
            [w - 0.5, 0.5],
            [w - 0.5, h - 0.5],
            [0.5, h - 0.5],
            [0.5, 0.5],
          ],
          0.7,
        );
        text("AT  systems, measured", 20, 20, 10, 0.9);
        text("profile / engineering study", 40, 31, 8, 0.6);
        const compact = w < 400;
        const left = compact ? w - 10 : w * 0.6;
        for (let i = 0; i < 46; i++) {
          const points = [];
          for (let x = 20; x < left; x += 4) {
            const u = (x - 20) / (left - 20);
            const ridge =
              Math.exp(-Math.pow((u - 0.36) / 0.13, 2)) *
                Math.sin(i * 0.064 + 1) *
                39 +
              Math.exp(-Math.pow((u - 0.75) / 0.19, 2)) * 25;
            points.push([
              x,
              65 +
                i * ((h - 95) / 46) -
                ridge +
                Math.sin(u * 42 + i * 0.18) * 2,
            ]);
          }
          line(points, 0.25 + i * 0.004);
        }
        const root = [left * 0.26, h - 30];
        for (
          let i = 0;
          i < 74 * (reduced ? 1 : Math.min(1, (now - started) / 1700));
          i++
        ) {
          const upper = i < 32;
          const end = [
            upper
              ? left * (0.28 + random(i) * 0.11)
              : left * (0.52 + random(i) * 0.35),
            upper ? 50 + random(i + 3) * 45 : 65 + random(i + 3) * (h - 120),
          ];
          const points = [];
          for (let j = 0; j <= 24; j++) {
            const u = j / 24,
              bend = u * u;
            points.push([
              root[0] +
                (end[0] - root[0]) * bend +
                Math.sin(u * 12 + i * 0.08) * u * 5,
              root[1] +
                (end[1] - root[1]) * u +
                Math.sin(u * 18 + i * 0.12) * u * 3,
            ]);
          }
          line(points, 0.3 + random(i) * 0.35);
        }
        line(
          [
            [20, h * 0.51],
            [left - 4, h * 0.51],
          ],
          0.55,
        );
        text("A", 20, h * 0.49, 8);
        text("A", left - 10, h * 0.49, 8);
        text("context · execution · observation", 35, h - 12, 8, 0.6);
        if (!compact) {
          const rx = left + 12,
            rw = w - rx - 12;
          text("section A—A", rx, 23, 9);
          line(
            [
              [rx, 31],
              [w - 12, 31],
              [w - 12, 79],
              [rx, 79],
              [rx, 31],
            ],
            0.55,
          );
          const graph = [];
          for (let x = 0; x < rw; x += 3)
            graph.push([
              rx + x,
              74 -
                Math.max(0, Math.sin((x / rw) * Math.PI * 2 - 0.3)) * 32 -
                Math.sin(x * 0.2) * 2,
            ]);
          line(graph, 0.85);
          text("working across the stack", rx, 94, 8, 0.7);
          [
            "LLM systems",
            "agent workflows",
            "model inference",
            "production APIs",
            "distributed services",
          ].forEach((v, i) => {
            text(v, rx, 115 + i * 16, 9, 0.7);
            line(
              [
                [rx, 119 + i * 16],
                [w - 12, 119 + i * 16],
              ],
              0.23,
            );
          });
          line(
            [
              [rx, h - 63],
              [w - 12, h - 63],
              [w - 12, h - 20],
              [rx, h - 20],
              [rx, h - 63],
            ],
            0.55,
          );
          text("Abdulaziz Toba", rx + 7, h - 50, 9);
          text("AI ENGINEER", rx + 7, h - 33, 9, 0.55);
        }
        for (let i = 1; i < 7; i++) text(String(i), (i * w) / 7, h - 5, 7, 0.4);
      }
      ctx.globalAlpha = 1;
    }
    function tick(now: number) {
      if (visible && now - last > 33) {
        draw(now);
        last = now;
      }
      frame = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    document.fonts.ready.then(() => {
      if (canvas.isConnected) draw(0);
    });
    window.addEventListener("pointermove", move);
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    if (!reduced) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [kind, theme, reduced, active]);
  return (
    <canvas
      ref={ref}
      className={`procedural canvas-${kind}`}
      aria-hidden="true"
    />
  );
}
