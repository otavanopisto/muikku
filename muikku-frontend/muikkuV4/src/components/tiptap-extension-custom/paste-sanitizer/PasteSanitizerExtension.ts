"use client";

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export type ClassPolicy =
  | { mode: "drop-all" }
  | { mode: "allowlist"; allow: string[] };

export type StylePolicy =
  | { mode: "drop-all" }
  | { mode: "allowlist"; allow: string[] };

/**
 * PasteSanitizerOptions
 */
export interface PasteSanitizerOptions {
  /**
   * Global allowlist of attributes to keep.
   * Anything not listed here is removed.
   *
   * Supports:
   * - exact names: ["href", "src"]
   * - wildcard: "data-*"
   *
   * Default: [] (strip everything)
   */
  allowedAttributes: string[];

  /**
   * Policy for the "class" attribute.
   * Default: drop-all
   */
  classPolicy: ClassPolicy;

  /**
   * Policy for the "style" attribute.
   * Default: drop-all
   */
  stylePolicy: StylePolicy;
}

/**
 * Normalize the attribute name.
 * @param name - The attribute name to normalize.
 * @returns The normalized attribute name.
 */
function normalizeAttrName(name: string) {
  return name.trim().toLowerCase();
}

/**
 * Compile the allowed attributes.
 * @param list - The list of allowed attributes.
 * @returns The compiled allowed attributes.
 */
function compileAllowedAttributes(list: string[]) {
  // Create a set of exact attributes.
  const exact = new Set<string>();
  let allowDataStar = false;

  // Iterate over the list of allowed attributes and add them to the set.
  for (const raw of list) {
    const n = normalizeAttrName(raw);
    if (!n) continue;
    if (n === "data-*") allowDataStar = true;
    else exact.add(n);
  }

  // Return the compiled allowed attributes.
  return { exact, allowDataStar };
}

/**
 * Check if the attribute is allowed.
 * @param name - The attribute name to check.
 * @param compiled - The compiled allowed attributes.
 * @returns True if the attribute is allowed, false otherwise.
 */
function isAllowedAttr(
  name: string,
  compiled: { exact: Set<string>; allowDataStar: boolean }
) {
  const n = normalizeAttrName(name);
  if (compiled.exact.has(n)) return true;
  if (compiled.allowDataStar && n.startsWith("data-")) return true;
  return false;
}

/**
 * Sanitize the class.
 * @param value - The value to sanitize.
 * @param policy - The policy to use.
 * @returns The sanitized class or null.
 */
function sanitizeClass(value: string, policy: ClassPolicy): string | null {
  // If the policy is to drop all, return null.
  if (policy.mode === "drop-all") return null;

  // Create a set of allowed classes.
  const allowed = new Set(policy.allow.map((x) => x.trim()).filter(Boolean));

  // Split the value into tokens and filter out the tokens that are not in the allowed set.
  const kept = value
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => allowed.has(t));

  // If there are any kept classes, join them with a space and return the result.
  return kept.length ? kept.join(" ") : null;
}

/**
 * Sanitize the style.
 * @param value - The value to sanitize.
 * @param policy - The policy to use.
 * @returns The sanitized style or null.
 */
function sanitizeStyle(value: string, policy: StylePolicy): string | null {
  // If the policy is to drop all, return null.
  if (policy.mode === "drop-all") return null;

  // Create a set of allowed styles.
  const allowed = new Set(
    policy.allow.map((x) => x.trim().toLowerCase()).filter(Boolean)
  );

  // Split the value into declarations and filter out the declarations that are not in the allowed set.
  const kept: string[] = [];

  for (const decl of value.split(";")) {
    // Trim the declaration and skip if it is empty.
    const d = decl.trim();
    if (!d) continue;

    // Get the index of the colon.
    const idx = d.indexOf(":");
    // Skip if the colon is not found.
    if (idx < 0) continue;

    const prop = d.slice(0, idx).trim().toLowerCase();
    const val = d.slice(idx + 1).trim();

    // Skip if the property or value is empty.
    if (!prop || !val) continue;
    // Skip if the property is not in the allowed set.
    if (!allowed.has(prop)) continue;

    kept.push(`${prop}: ${val}`);
  }

  return kept.length ? kept.join("; ") : null;
}

/**
 * Strips/filters attributes from pasted HTML.
 * Intended as a strict policy; schema parsing will then decide what survives.
 */
export const PasteSanitizerExtension = Extension.create<PasteSanitizerOptions>({
  name: "pasteSanitizer",

  addOptions() {
    return {
      allowedAttributes: [],
      classPolicy: { mode: "drop-all" },
      stylePolicy: { mode: "drop-all" },
    };
  },

  addProseMirrorPlugins() {
    const key = new PluginKey("pasteSanitizer");

    return [
      new Plugin({
        key,
        props: {
          transformPastedHTML: (html: string) => {
            try {
              const compiledAllowed = compileAllowedAttributes(
                this.options.allowedAttributes ?? []
              );

              const doc = new DOMParser().parseFromString(html, "text/html");

              doc.querySelectorAll("*").forEach((el) => {
                // 1) Drop everything not in allowedAttributes
                for (const { name } of Array.from(el.attributes)) {
                  if (!isAllowedAttr(name, compiledAllowed)) {
                    el.removeAttribute(name);
                  }
                }

                // 2) Apply class policy (only if class survived allowlist)
                if (el.hasAttribute("class")) {
                  const next = sanitizeClass(
                    el.getAttribute("class") ?? "",
                    this.options.classPolicy
                  );
                  if (!next) el.removeAttribute("class");
                  else el.setAttribute("class", next);
                }

                // 3) Apply style policy (only if style survived allowlist)
                if (el.hasAttribute("style")) {
                  const next = sanitizeStyle(
                    el.getAttribute("style") ?? "",
                    this.options.stylePolicy
                  );
                  if (!next) el.removeAttribute("style");
                  else el.setAttribute("style", next);
                }
              });

              return doc.body.innerHTML;
            } catch {
              return html;
            }
          },
        },
      }),
    ];
  },
});

export default PasteSanitizerExtension;
