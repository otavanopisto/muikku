import { HtmlValidate, StaticConfigLoader } from "html-validate";

export type MemoFieldContentFormat = "plain" | "html";

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

/** Root tags CKEditor writes for memo answers (post-migration detection only). */
const CKE_ROOT_TAGS = new Set([
  "p",
  "h3",
  "h4",
  "div",
  "ul",
  "ol",
  "blockquote",
  "table",
  "figure",
  "pre",
  "br",
]);

/**
 * True when the stored value looks like a CKEditor HTML fragment,
 * not student prose that happens to contain < or >.
 * @param value value
 */
function looksLikeRichContentFragment(value: string): boolean {
  const trimmed = (value ?? "").trim();
  if (!trimmed.startsWith("<")) return false;
  const match = trimmed.match(/^<([a-z][a-z0-9]*)/i);
  if (!match || !CKE_ROOT_TAGS.has(match[1].toLowerCase())) {
    return false;
  }
  const doc = new DOMParser().parseFromString(trimmed, "text/html");
  const children = Array.from(doc.body.childNodes);
  // CKEditor roots are elements. Bare text after </ul>/<p>/… ⇒ legacy typed HTML.
  const hasNonWhitespaceTextNode = children.some(
    (node) =>
      node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== ""
  );
  if (hasNonWhitespaceTextNode) {
    return false; // treat as plain
  }
  // Require at least one element child.
  return children.some((node) => node.nodeType === Node.ELEMENT_NODE);
}

/**
 * Classify stored memo answer for conversion to CKEditor.
 * @param value stored answer
 */
export function getMemoFieldContentFormatSync(
  value: string
): MemoFieldContentFormat {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "plain";
  }

  // No raw newlines but starts like CKEditor output => saved after lazy migration.
  if (looksLikeRichContentFragment(trimmed)) {
    return "html";
  }
  return "plain";
}

/**
 * Classify snapshot / memo value.
 * Default plain unless the value looks like CKEditor HTML.
 * @param value value
 */
export async function getMemoFieldContentFormat(
  value: string
): Promise<MemoFieldContentFormat> {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "plain";
  }

  // Prose with tags in the middle (script, <a>, 2 < 3, <esimerkki>) stays plain.
  if (
    !(
      looksLikeRichContentFragment(trimmed) &&
      (value.includes("&lt;") || value.includes("<br />"))
    )
  ) {
    return "plain";
  }

  const htmlvalidate = getValidator();
  const report = await htmlvalidate.validateString(
    wrapAsHtmlDocument(trimmed),
    "snapshot.html"
  );

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

  // Looks like a fragment. If validator is unhappy, still treat as html so
  // real CKEditor answers are not escaped into visible tags.
  if (report.valid) {
    return "html";
  }

  return "html";
}

/**
 * Synchronous guess. Returns "plain" when this cannot be CKEditor HTML.
 * Returns null when async validation should run.
 * @param value value
 */
export function guessMemoFieldContentFormatSync(
  value: string
): MemoFieldContentFormat | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed || !looksLikeRichContentFragment(trimmed)) {
    return "plain";
  }
  return null;
}
