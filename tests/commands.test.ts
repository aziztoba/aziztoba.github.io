import assert from "node:assert/strict";
import { test } from "node:test";

const module = await import("../lib/commands.ts").catch(() => null);
test("command resolver exists", () =>
  assert.ok(module?.resolveCommand, "Command resolver not implemented"));
test("editor commands preserve navigation and errors", () => {
  assert.ok(module);
  const run = module.resolveCommand;
  const message = (text: string) => {
    const action = run(text, "about", "blackmoney");
    assert.equal(action.type, "message");
    return action.message;
  };
  assert.deepEqual(run("e stack", "about", "blackmoney"), {
    type: "navigate",
    id: "stack",
  });
  assert.deepEqual(run("whoami", "stack", "blackmoney"), {
    type: "navigate",
    id: "about",
  });
  assert.deepEqual(run("cd ..", "MediatorFromScratch", "blackmoney"), {
    type: "navigate",
    id: "more",
  });
  assert.deepEqual(run("q!", "about", "blackmoney"), { type: "exit" });
  assert.deepEqual(run("theme", "about", "blackmoney"), {
    type: "navigate",
    id: "themes",
  });
  assert.equal(message("help"), "E492: Not an editor command: help");
  assert.equal(message("e nowhere"), "E484: Can't open file nowhere");
});
test("theme names resolve only when unambiguous", () => {
  assert.ok(module);
  const run = module.resolveCommand;
  const message = (text: string) => {
    const action = run(text, "about", "blackmoney");
    assert.equal(action.type, "message");
    return action.message;
  };
  assert.deepEqual(run("colorscheme whitegold", "about", "blackmoney"), {
    type: "theme",
    id: "whitegold",
  });
  assert.match(message("colo black"), /^E185:/);
  assert.match(message("colo nonexistent"), /Cannot find/);
  assert.deepEqual(run("colorscheme", "about", "blackmoney"), {
    type: "message",
    message: "blackmoney",
  });
});
