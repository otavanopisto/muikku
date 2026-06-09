import { HtmlValidate, StaticConfigLoader } from "html-validate";

export type MemoFieldContentFormat = "plain" | "html";

/** Rules that mean "this isn't a coherent HTML fragment" (tune after logging real reports). */
const PLAIN_TEXT_INDICATOR_RULES = new Set([
  "no-trailing-whitespace",
  "element-permitted-content",
  "text-content",
]);

let validator: HtmlValidate | null = null;

/**
 * Shared validator instance (browser build).
 */
function getValidator(): HtmlValidate {
  if (!validator) {
    const loader = new StaticConfigLoader({
      extends: ["html-validate:recommended"],
      elements: ["html5"],
      // Relax rules that CKEditor often triggers during the experiment:
      rules: {
        "no-inline-style": "off",
        "attribute-allowed-values": "off",
        "void-style": "off",
      },
    });
    validator = new HtmlValidate(loader);
  }
  return validator;
}

/**
 * Wrap stored value as a minimal document for validation.
 * @param value value
 * @returns string
 */
function wrapAsHtmlDocument(value: string): string {
  return `<!DOCTYPE html>
<html lang="fi">
<head><title>snapshot</title></head>
<body>${value}</body>
</html>`;
}

/**
 * Classify snapshot / memo value using HTML-validate.
 * Default plain when empty, no markup, or validation suggests prose.
 * @param value value
 */
export async function getMemoFieldContentFormat(
  value: string
): Promise<MemoFieldContentFormat> {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "plain";
  }

  // Fast path: no angle brackets at all
  if (!trimmed.includes("<")) {
    return "plain";
  }

  const htmlvalidate = getValidator();
  const report = await htmlvalidate.validateString(
    wrapAsHtmlDocument(trimmed),
    "snapshot.html"
  );

  // Log report in development
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[memoContentFormat]", {
      valid: report.valid,
      errors: report.results.map((r) =>
        r.messages
          .filter((m) => m.severity === 2)
          .map((m) => ({ ruleId: m.ruleId, message: m.message, line: m.line }))
      ),
    });
  }

  if (report.valid) {
    return "html";
  }

  const hasPlainIndicator = report.results.some((result) =>
    result.messages.some(
      (m) => m.severity === 2 && PLAIN_TEXT_INDICATOR_RULES.has(m.ruleId)
    )
  );

  // If invalid but no known "prose" rules, still treat as html
  if (!hasPlainIndicator && report.errorCount <= 2) {
    return "html";
  }

  return "plain";
}
