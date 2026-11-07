/**
 * Runs one measurement command with hard limits. Separate from
 * performance-bench.ts so `scripts/checks/performance.ts` can test the
 * cleanup without a browser.
 */
import { execFileSync, spawn } from "node:child_process";

/** A Lighthouse report is a few MB; more than this is a broken run. */
export const MAX_OUTPUT = 64 * 2 ** 20;

export interface Limits {
  cwd: string;
  timeout: number;
  env?: NodeJS.ProcessEnv;
  /**
   * A string in the command line of every process the command may leave
   * behind in another process group. chrome-launcher starts Chrome that way.
   */
  marker?: string;
  /** How long TERM gets before KILL. chrome-launcher cleans up on TERM. */
  grace?: number;
}

/** Match a complete argument, so a PID ending in 12 cannot also match 123. */
export const markerPattern = (marker: string) =>
  `(^|[[:space:]])${marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([[:space:]]|$)`;

export const isNoMatch = (error: unknown): boolean =>
  error !== null &&
  typeof error === "object" &&
  "status" in error &&
  error.status === 1 &&
  (!("stderr" in error) || String(error.stderr).trim() === "");

/** Kills only processes with the complete marker argument. */
export const killMarked = (marker: string, signal = "KILL") => {
  try {
    execFileSync("pkill", [`-${signal}`, "-f", "--", markerPattern(marker)]);
  } catch (error) {
    if (!isNoMatch(error)) throw error;
  }
};

/**
 * Runs `cmd` in its own process group. A timeout, too much output, a missing
 * binary or a non-zero exit all reject. On a timeout the group gets TERM,
 * then KILL after `grace`; marked processes get the same.
 */
export const run = (
  cmd: string,
  args: string[],
  { cwd, timeout, env = process.env, marker, grace = 5000 }: Limits,
) =>
  new Promise<string>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, env, detached: true });
    const signal = (name: "TERM" | "KILL") => {
      try {
        if (child.pid) process.kill(-child.pid, `SIG${name}`);
      } catch {}
      if (marker) killMarked(marker, name);
    };
    let settled = false;
    const stop = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      let cleanupError: unknown;
      try {
        signal("TERM");
      } catch (failure) {
        cleanupError = failure;
      }
      setTimeout(() => {
        try {
          signal("KILL");
        } catch (failure) {
          cleanupError = failure;
        }
        reject(cleanupError ?? error);
      }, grace);
    };
    let stdout = "";
    let stderr = "";
    let outputBytes = 0;
    child.stdout.on("data", (chunk: Buffer) => {
      if (settled) return;
      outputBytes += chunk.length;
      if (outputBytes > MAX_OUTPUT)
        stop(new Error(`${cmd}: output over ${MAX_OUTPUT} bytes`));
      else stdout += chunk;
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = (stderr + chunk).slice(-4000);
    });
    child.on("error", stop);
    const timer = setTimeout(
      () => stop(new Error(`timed out after ${timeout} ms: ${cmd} ${args[0]}`)),
      timeout,
    );
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        if (marker) killMarked(marker);
      } catch (error) {
        reject(error);
        return;
      }
      if (code === 0) resolve(stdout);
      else {
        reject(new Error(`${cmd} exited ${code}: ${stderr}`));
      }
    });
  });
