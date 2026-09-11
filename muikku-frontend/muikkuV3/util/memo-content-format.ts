export type MemoFieldContentFormat = "plain" | "html";

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
