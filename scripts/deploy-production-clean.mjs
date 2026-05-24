import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const isWindows = process.platform === "win32";
const npxCommand = isWindows ? "npx.cmd" : "npx";
const nodeCommand = isWindows ? "node" : process.execPath;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    stdio: "inherit",
    shell: isWindows,
    env: process.env,
  });

  if (result.error) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}`);
  }
}

function output(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: isWindows,
  });

  if (result.error) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.stdout || `exit code ${result.status}`}`);
  }

  return result.stdout.trim();
}

const shortHead = output("git", ["rev-parse", "--short", "HEAD"]);
const deployBase = process.env.NOIRVEN_DEPLOY_BASE || path.parse(root).root || os.tmpdir();
const deployPath = process.env.NOIRVEN_DEPLOY_PATH || path.join(deployBase, `noirven-deploy-${shortHead}`);
const projectFile = path.join(root, ".vercel", "project.json");

if (!existsSync(projectFile)) {
  throw new Error(`Missing Vercel project binding: ${projectFile}`);
}

if (existsSync(deployPath)) {
  if (!path.basename(deployPath).startsWith("noirven-deploy-")) {
    throw new Error(`Refusing to remove unexpected deploy path: ${deployPath}`);
  }

  const removeResult = spawnSync("git", ["worktree", "remove", "--force", deployPath], { cwd: root, stdio: "inherit", shell: false });
  if (removeResult.status !== 0 && existsSync(deployPath)) {
    rmSync(deployPath, { recursive: true, force: true });
  }
}

try {
  run("git", ["worktree", "add", "--detach", deployPath, "HEAD"]);
  mkdirSync(path.join(deployPath, ".vercel"), { recursive: true });
  copyFileSync(projectFile, path.join(deployPath, ".vercel", "project.json"));
  run(npxCommand, ["vercel", "--prod", "--yes"], { cwd: deployPath });
  run(nodeCommand, ["scripts/verify-production-launch.mjs"], { cwd: deployPath });
} finally {
  const removeResult = spawnSync("git", ["worktree", "remove", "--force", deployPath], { cwd: root, stdio: "inherit", shell: false });
  if (removeResult.status !== 0 && existsSync(deployPath) && path.basename(deployPath).startsWith("noirven-deploy-")) {
    try {
      rmSync(deployPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 1000 });
    } catch (error) {
      console.warn(`Warning: deployment succeeded, but temporary worktree cleanup failed: ${error.message}`);
      console.warn(`Remove manually when no process is using it: ${deployPath}`);
    }
  }
}
