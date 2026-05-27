#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const repos = {
  root: {
    label: "root",
    cwd: root,
    branch: "main",
    sync: null,
  },
  client: {
    label: "client",
    cwd: path.join(root, "buddy-client"),
    branch: "develop",
    sync: "/mnt/e/buddy/buddy-client/tools/sync-windows-to-wsl.sh",
    sourceDir: "/mnt/e/buddy/buddy-client",
    check:
      "cd /home/openclaw/.openclaw/workspace-cipher/buddy-client && " +
      "test -d .tmp && echo tmp_exists || echo tmp_absent; " +
      "test -d docs && echo docs_exists || echo docs_absent",
  },
  server: {
    label: "server",
    cwd: path.join(root, "buddy-server"),
    branch: "develop",
    sync: "/mnt/e/buddy/buddy-server/tools/sync-windows-to-wsl.sh",
    sourceDir: "/mnt/e/buddy/buddy-server",
    check: "curl --max-time 5 -sS http://localhost:3000/",
  },
};

const args = new Set(process.argv.slice(2));

function usage() {
  console.log(`Buddy release/sync helper

Usage:
  node tools/release-sync.mjs --repo client --status
  node tools/release-sync.mjs --repo client --push --sync
  node tools/release-sync.mjs --repo server --push --sync
  node tools/release-sync.mjs --repo root --push

Options:
  --repo <root|client|server>  Repository to operate on.
  --status                     Show branch/status and latest commit.
  --push                       Push the repo's current branch.
  --sync                       Run the repo's existing WSL sync script.
  --check                      Run the repo's post-sync check.
  --all                        Alias for --status --push --sync --check.

Notes:
  This tool coordinates the release flow only. It reuses existing sync scripts:
  - buddy-client/tools/sync-windows-to-wsl.sh
  - buddy-server/tools/sync-windows-to-wsl.sh
  Windows is the development/editing workspace. Runtime maintenance and final
  smoke checks happen inside WSL, which is configured with mirrored networking.
  Canonical repos live under E:\\buddy\\buddy-client and E:\\buddy\\buddy-server.
  Do not use old backup folders such as E:\\buddy-client or E:\\buddy-server.
  It does not stage, commit, reset, or modify business code.
  Run one repo/action at a time. Parallel WSL commands can fail with Wsl/Service errors.
`);
}

function argValue(name) {
  const argv = process.argv.slice(2);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : "";
}

function run(command, options = {}) {
  console.log(`\n$ ${command}`);
  const result = spawnSync(command, {
    cwd: options.cwd || root,
    shell: true,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}: ${command}`);
  }
}

function runText(command, cwd) {
  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || command).trim());
  }
  return result.stdout.trim();
}

function requireRepo(name) {
  const repo = repos[name];
  if (!repo) {
    usage();
    throw new Error(`Unknown repo: ${name || "(missing)"}`);
  }
  if (!existsSync(repo.cwd)) {
    throw new Error(`Repo path does not exist: ${repo.cwd}`);
  }
  return repo;
}

function status(repo) {
  console.log(`\n== ${repo.label} status ==`);
  run("git status -sb", { cwd: repo.cwd });
  run("git log --oneline -1", { cwd: repo.cwd });
}

function ensureBranch(repo) {
  const branch = runText("git branch --show-current", repo.cwd);
  if (branch !== repo.branch) {
    throw new Error(`${repo.label} is on ${branch}, expected ${repo.branch}`);
  }
}

function push(repo) {
  ensureBranch(repo);
  run(`git push origin ${repo.branch}`, { cwd: repo.cwd });
}

function sync(repo) {
  if (!repo.sync) {
    console.log(`\n== ${repo.label} has no WSL sync script ==`);
    return;
  }
  const env = repo.sourceDir ? `SOURCE_DIR=${repo.sourceDir} ` : "";
  run(`wsl.exe -d Ubuntu-24.04 -- sh -lc "${env}sh ${repo.sync}"`, { cwd: repo.cwd });
}

function check(repo) {
  if (!repo.check) {
    console.log(`\n== ${repo.label} has no post-sync check ==`);
    return;
  }
  run(`wsl.exe -d Ubuntu-24.04 -- sh -lc "${repo.check}"`, { cwd: repo.cwd });
}

async function main() {
  if (args.has("--help") || args.has("-h")) {
    usage();
    return;
  }

  const repo = requireRepo(argValue("--repo"));
  const all = args.has("--all");
  const doStatus = all || args.has("--status");
  const doPush = all || args.has("--push");
  const doSync = all || args.has("--sync");
  const doCheck = all || args.has("--check");

  if (!doStatus && !doPush && !doSync && !doCheck) {
    usage();
    throw new Error("Choose at least one action.");
  }

  console.log(`Buddy release/sync helper: ${repo.label}`);
  console.log(`Path: ${repo.cwd}`);
  console.log(`Expected branch: ${repo.branch}`);
  if (doSync || doCheck) {
    console.log("WSL note: run this helper serially; do not launch parallel WSL checks.");
  }

  if (doStatus) status(repo);
  if (doPush) push(repo);
  if (doSync) sync(repo);
  if (doCheck) check(repo);

  console.log(`\nDone.`);
}

main().catch((error) => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
