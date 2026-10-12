import palettes from "../data/themes.json" with { type: "json" };
export const themes = palettes;
export type Theme = (typeof themes)[number];
export const defaultTheme = themes.find((t) => t.id === "blackmoney")!;
export const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");
