import { realpathSync } from "fs";
import { resolve } from "path";

const appDirectory = realpathSync(process.cwd());

/**
 * Resolves the path to the given path segments.
 * @param pathSegments - The path segments to resolve.
 * @returns The resolved path.
 */
export default (...pathSegments: string[]): string =>
  resolve(appDirectory, ...pathSegments);
