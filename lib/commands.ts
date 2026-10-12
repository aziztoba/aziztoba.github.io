import { projects, entries } from "../data/profile.ts";
import { themes, normalize } from "./themes.ts";
export type CommandAction =
  | { type: "navigate"; id: string }
  | { type: "theme"; id: string }
  | { type: "exit" }
  | { type: "message"; message: string };
export function resolveCommand(
  text: string,
  currentId: string,
  themeId: string,
): CommandAction {
  const [verb, ...rest] = text.trim().split(/\s+/);
  const arg = rest.join(" ");
  const message = (message: string): CommandAction => ({
    type: "message",
    message,
  });
  const find = (name: string) => {
    const key = normalize(name);
    if (["", "whoami", "about", "home", "readmemd"].includes(key))
      return "about";
    if (["git", "gitlog", "log"].includes(key)) return "stack";
    return [...entries, ...projects].find(
      (p) =>
        normalize(p.id) === key || ("label" in p && normalize(p.label) === key),
    )?.id;
  };
  const palette = (name: string): CommandAction => {
    const key = normalize(name),
      exact = themes.find((t) => t.id === key),
      matches = exact ? [exact] : themes.filter((t) => t.id.startsWith(key));
    if (matches.length === 1) return { type: "theme", id: matches[0].id };
    return message(
      matches.length
        ? `E185: ${matches
            .slice(0, 4)
            .map((t) => t.id)
            .join(" · ")}`
        : `E185: Cannot find color scheme '${name}'`,
    );
  };
  if (!verb) return message("");
  if (/^(q(a|all)?!?|wq|x)$/.test(verb)) return { type: "exit" };
  if (["theme", "colo", "colorscheme"].includes(verb))
    return arg
      ? palette(arg)
      : verb === "theme"
        ? { type: "navigate", id: "themes" }
        : message(themeId);
  if (["e", "edit", "cd"].includes(verb)) {
    const id =
      arg === ".."
        ? projects.find((p) => p.id === currentId)?.parent || "about"
        : find(arg);
    return id
      ? { type: "navigate", id }
      : message(`E484: Can't open file ${arg}`);
  }
  if (!arg) {
    const id = find(verb);
    if (id) return { type: "navigate", id };
    if (themes.some((t) => t.id.startsWith(normalize(verb))))
      return palette(verb);
  }
  return message(`E492: Not an editor command: ${text.trim()}`);
}
