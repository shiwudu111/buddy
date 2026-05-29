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
  node tools/release-sync.mjs --plan
  node tools/release-sync.mjs --repo client --status
  node tools/release-sync.mjs --repo client --push --sync
  node tools/release-sync.mjs --repo server --push --sync
  node tools/release-sync.mjs --repo root --push

Options:
  --plan                       Show release status and next commands for all repos.
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
    throw new Error(
      [
        `Command failed with exit code ${result.status}: ${command}`,
        `cwd: ${cwd}`,
        result.stderr?.trim(),
        result.stdout?.trim(),
      ]
        .filter(Boolean)
        .join("\n")
    );
  }
  return result.stdout.trim();
}

function runGitText(args, cwd) {
  const result = spawnSync("git", args, {
    cwd,
    shell: false,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `Command failed with exit code ${result.status}: git ${args.join(" ")}`,
        `cwd: ${cwd}`,
        result.error ? String(result.error) : "",
        result.stderr?.trim(),
        result.stdout?.trim(),
      ]
        .filter(Boolean)
        .join("\n")
    );
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

function getStatus(repo) {
  return runGitText(["status", "-sb"], repo.cwd);
}

function getStatusLine(statusText) {
  return statusText.split(/\r?\n/)[0] || "";
}

function getHead(repo) {
  return runGitText(["log", "--oneline", "-1"], repo.cwd);
}

function getBranch(repo) {
  return runGitText(["branch", "--show-current"], repo.cwd);
}

function printReleasePlan() {
  console.log("Buddy release plan");
  console.log("Windows workspace: E:\\buddy");
  console.log("WSL runtime: /home/openclaw/.openclaw/workspace-cipher");
  console.log("Run sync/check commands serially after commits and pushes.\n");

  let blocked = false;
  for (const repo of Object.values(repos)) {
    const branch = getBranch(repo);
    const statusText = getStatus(repo);
    const statusLine = getStatusLine(statusText);
    const head = getHead(repo);
    const branchOk = branch === repo.branch;
    const clean = statusText.split(/\r?\n/).length === 1;
    const synced = statusLine.includes(`...origin/${repo.branch}`) && !/[<>]/.test(statusLine);
    blocked = blocked || !branchOk || !clean || !synced;

    console.log(`== ${repo.label} ==`);
    console.log(`path: ${repo.cwd}`);
    console.log(`branch: ${branch} ${branchOk ? "(ok)" : `(expected ${repo.branch})`}`);
    console.log(`status: ${statusLine || "(empty)"}`);
    console.log(`head: ${head}`);
    console.log(`clean: ${clean ? "yes" : "no"}`);
    console.log(`remote: ${synced ? "aligned" : "check before release"}`);
    if (repo.sync) {
      console.log(`sync/check: node tools\\release-sync.mjs --repo ${repo.label} --sync --check`);
    } else {
      console.log("sync/check: n/a");
    }
    console.log("");
  }

  console.log("Suggested release order:");
  console.log("1. Run required tests: client tsc and/or server bun test.");
  console.log("2. Commit each dirty repo separately.");
  console.log("3. Push server/client develop and root main as applicable.");
  console.log("4. Run serial WSL sync/check for touched runtime repos.");
  console.log("5. Record result in docs/agent/HANDOFF.md.");
  console.log(`\nDecision: ${blocked ? "blocked or needs review" : "ready for release actions"}`);
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

  if (args.has("--plan")) {
    printReleasePlan();
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
