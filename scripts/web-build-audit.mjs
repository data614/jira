#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const turboBinary = join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "turbo.cmd" : "turbo"
);

function fail(message, detail) {
  console.error(`\n\x1b[31mError:\x1b[0m ${message}`);
  if (detail) {
    console.error(detail);
  }
  process.exit(1);
}

let turboConfig;
try {
  const turboJson = readFileSync(join(repoRoot, "turbo.json"), "utf8");
  turboConfig = JSON.parse(turboJson);
} catch (error) {
  fail("Unable to read turbo.json", error instanceof Error ? error.message : error);
}

const turboEnv = {
  ...process.env,
  TURBO_TELEMETRY_DISABLED: "1",
  TURBO_DISABLE_UPDATE_CHECK: "1",
};

const turboResult = spawnSync(
  turboBinary,
  ["run", "build", "--filter=web", "--dry-run=json", "--no-color"],
  {
    cwd: repoRoot,
    encoding: "utf8",
    env: turboEnv,
  }
);

if (turboResult.error) {
  fail("Failed to launch the turborepo CLI", turboResult.error.message);
}

if (turboResult.status !== 0) {
  fail("Turborepo dry-run command did not complete successfully", turboResult.stderr || turboResult.stdout);
}

const stdout = turboResult.stdout.trim();
const jsonStartIndex = stdout.indexOf("{");
if (jsonStartIndex === -1) {
  fail("Dry-run output did not include JSON data", stdout);
}

let dryRun;
try {
  dryRun = JSON.parse(stdout.slice(jsonStartIndex));
} catch (error) {
  fail("Unable to parse Turborepo dry-run JSON", error instanceof Error ? error.message : error);
}

if (!Array.isArray(dryRun.tasks)) {
  fail("Dry-run JSON did not contain the expected tasks array");
}

const taskKey = (pkg, task) => `${pkg}#${task}`;
const packageTaskMap = new Map();
for (const pkgTask of dryRun.tasks) {
  packageTaskMap.set(taskKey(pkgTask.package, pkgTask.task), pkgTask);
}

const webTask = packageTaskMap.get(taskKey("web", "build"));
if (!webTask) {
  fail("Unable to locate the web workspace build task in the dry-run data");
}

const dependencyTasks = (webTask.dependencies || [])
  .map((dependency) => {
    const [pkg, task = "build"] = dependency.split("#");
    const detail = packageTaskMap.get(taskKey(pkg, task));
    return {
      package: pkg,
      task,
      detail,
    };
  })
  .sort((a, b) => a.package.localeCompare(b.package));

const dedupe = (value, index, array) => array.indexOf(value) === index;
const dependencyPackages = dependencyTasks
  .map((dependency) => dependency.package)
  .filter(dedupe);

const summary = {
  command: webTask.command,
  directory: webTask.directory,
  outputs: webTask.outputs,
  dependencyCount: dependencyPackages.length,
  dependencyPackages,
  framework: webTask.framework,
};

const formatList = (items, indentation = 2) => {
  const indent = " ".repeat(indentation);
  return items.map((item) => `${indent}- ${item}`).join("\n");
};

console.log("\nTurborepo build audit for the \"web\" workspace");
console.log("=".repeat(64));
console.log(`Command executed: ${summary.command}`);
console.log(`Workspace directory: ${summary.directory}`);
console.log(`Framework detected: ${summary.framework}`);
console.log(`Output directories: ${summary.outputs.join(", ") || "(none)"}`);
console.log("\nDependent workspace build tasks:");
console.log(formatList(summary.dependencyPackages));

if (dependencyTasks.length) {
  console.log("\nDetailed dependency task information:");
  for (const dependency of dependencyTasks) {
    const header = `${dependency.package}#${dependency.task}`;
    console.log(`\n- ${header}`);
    if (!dependency.detail) {
      console.log("    (No detailed information available in dry-run output)");
      continue;
    }
    const detail = dependency.detail;
    const rawCommand = detail.command;
    const command = rawCommand && rawCommand !== "<NONEXISTENT>" ? rawCommand : "(not declared)";
    console.log(`    Command: ${command}`);
    if (detail.outputs && detail.outputs.length) {
      console.log(`    Outputs: ${detail.outputs.join(", ")}`);
    } else {
      console.log("    Outputs: (none declared)");
    }
    if (detail.directory) {
      console.log(`    Directory: ${detail.directory}`);
    }
  }
}

const globalEnv = Array.isArray(turboConfig.globalEnv) ? turboConfig.globalEnv : [];
if (globalEnv.length) {
  console.log("\nGlobal environment variables required during builds:");
  console.log(formatList(globalEnv));
}

console.log("\nTo run a full build locally, execute:\n  yarn turbo run build --filter=web\n");
console.log("The dry-run completes without executing builds, making it safe for continuous monitoring.");
