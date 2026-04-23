import { Plugin, PluginKey } from "@tiptap/pm/state";
import { mergeAttributes } from "@tiptap/core";

export const MUUKKU_FIELD_NAME_RE = /muikku-field-[a-zA-Z0-9]{24}/g;
export const MUUKKU_PARAM_MIME_JSON = "application/json";

/**
 * Generates a random string from the given alphabet.
 * @param alphabet - The alphabet to use for the random string.
 * @param n - The length of the random string.
 * @returns The random string.
 */
function randomFromAlphabet(alphabet: string, n: number): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(n);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < n; i++) out += alphabet[bytes[i] % alphabet.length];
    return out;
  }

  let out = "";
  for (let i = 0; i < n; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

/**
 * Creates a random Muikku field name.
 * @returns The random Muikku field name.
 */
export function createRandomMuikkuFieldName(): string {
  const nameLength = 24;
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return `muikku-field-${randomFromAlphabet(alphabet, nameLength)}`;
}

/**
 * Safely parses a JSON string.
 * @param value - The JSON string to parse.
 * @returns The parsed JSON or null if the string is not valid JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function safeParseJson(value: string | null): unknown | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Reads the content of a Muikku object parameter.
 * @param el - The element to read the content from.
 * @returns The content of the Muikku object parameter or null if the parameter is not found.
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function readMuikkuObjectContentParam(el: HTMLElement): unknown | null {
  const param = el.querySelector('param[name="content"]');
  return safeParseJson(param?.getAttribute("value") ?? null);
}

/**
 * Renders a Muikku object tag.
 * @param props - The props for the Muikku object tag.
 * @returns The Muikku object tag.
 */
export function renderMuikkuObjectTag(props: {
  objectType: string;
  htmlAttributes?: Record<string, unknown>;
  content: unknown;
}) {
  const { objectType, htmlAttributes, content } = props;

  return [
    "object",
    mergeAttributes(htmlAttributes ?? {}, { type: objectType }),
    ["param", { name: "type", value: MUUKKU_PARAM_MIME_JSON }],
    ["param", { name: "content", value: JSON.stringify(content ?? {}) }],
  ] as const;
}

/**
 * Creates a plugin to ensure unique Muikku field names when pasting.
 * @returns The plugin to ensure unique Muikku field names when pasting.
 */
export function createMuikkuPasteNameUniqPlugin() {
  return new Plugin({
    key: new PluginKey("muikkuFieldsPasteUniq"),
    props: {
      transformPastedHTML: (html) => {
        const names: Record<string, string> = {};
        return html.replace(MUUKKU_FIELD_NAME_RE, (matched) => {
          if (!names[matched]) names[matched] = createRandomMuikkuFieldName();
          return names[matched];
        });
      },
    },
  });
}
