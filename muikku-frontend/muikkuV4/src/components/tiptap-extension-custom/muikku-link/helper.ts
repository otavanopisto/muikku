import type { Editor } from "@tiptap/core";

export type AnchorOption = { value: string; source: "mark" | "placeholder" };

/**
 * Collect unique anchor ids/names from MuikkuAnchorExtension (mark + placeholder node).
 * @param editor - The editor to use.
 * @returns The anchor options.
 */
export function collectAnchorOptions(editor: Editor | null): AnchorOption[] {
  if (!editor) return [];
  const { doc, schema } = editor.state;
  const anchorMark = schema.marks.anchor;
  const placeholderNode = schema.nodes.anchorPlaceholder;
  const seen = new Set<string>();
  const out: AnchorOption[] = [];
  doc.descendants((node) => {
    // 1) Empty anchors: placeholder node attrs
    if (placeholderNode && node.type === placeholderNode) {
      const v = String(node.attrs?.name ?? node.attrs?.id ?? "").trim();
      if (v && !seen.has(v)) {
        seen.add(v);
        out.push({ value: v, source: "placeholder" });
      }
      return;
    }
    // 2) Anchors with text: mark attrs on text nodes
    if (anchorMark && node.isText) {
      const m = anchorMark.isInSet(node.marks);
      if (!m) return;
      const v = String(m.attrs?.name ?? m.attrs?.id ?? "").trim();
      if (v && !seen.has(v)) {
        seen.add(v);
        out.push({ value: v, source: "mark" });
      }
    }
  });
  // Optional: sort for stable UI
  out.sort((a, b) =>
    a.value.localeCompare(b.value, undefined, { sensitivity: "base" })
  );
  return out;
}
