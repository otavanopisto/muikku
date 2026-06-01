"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Radio,
  Stack,
  Tabs,
  TextInput,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";

type ImageKind = "image" | "imageFigure";

type Align = "left" | "center" | "right" | null;

type ImageAttrs = {
  src?: string | null;
  alt?: string | null;
  title?: string | null;
  width?: string | number | null;
  height?: string | number | null;
  align?: Align;
  dataSource?: string | null;
  dataSourceUrl?: string | null;
  dataAuthor?: string | null;
  dataAuthorUrl?: string | null;
  dataLicense?: string | null;
  dataLicenseUrl?: string | null;
  class?: string | null;
};

type ImageFormState = {
  // Main
  src: string;
  alt: string;
  width: string;
  height: string;
  lockRatio: boolean;
  ratio: number | null;
  align: Align;
  captionEnabled: boolean;
  captionText: string;
  // Meta
  dataSource: string;
  dataSourceUrl: string;
  dataAuthor: string;
  dataAuthorUrl: string;
  dataLicense: string;
  dataLicenseUrl: string;
};

// The default form state.
const DEFAULT_FORM: ImageFormState = {
  src: "",
  alt: "",
  width: "",
  height: "",
  lockRatio: true,
  ratio: null,
  align: null,
  captionEnabled: false,
  captionText: "",
  dataSource: "",
  dataSourceUrl: "",
  dataAuthor: "",
  dataAuthorUrl: "",
  dataLicense: "",
  dataLicenseUrl: "",
};

/**
 * The formFromEditor function.
 * @param editor - The editor to get the form state from.
 * @returns The form state for the editor.
 */
function formFromEditor(editor: Editor): ImageFormState {
  const kind = getActiveKind(editor);
  if (!kind) {
    return { ...DEFAULT_FORM };
  }
  const info =
    kind === "imageFigure"
      ? findActiveImageNode(editor, "imageFigure")
      : findActiveImageNode(editor, "image");
  const a = info?.attrs ?? (editor.getAttributes(kind) as ImageAttrs);
  const width = toNumOrEmpty(a.width);
  const height = toNumOrEmpty(a.height);
  const w = parsePositiveInt(width);
  const h = parsePositiveInt(height);
  const isFig = kind === "imageFigure";
  return {
    ...DEFAULT_FORM,
    src: toText(a.src),
    alt: toText(a.alt),
    width,
    height,
    align: (a.align ?? null) as Align,
    captionEnabled: isFig,
    captionText: isFig ? info?.captionText ?? "" : "",
    dataSource: toText(a.dataSource),
    dataSourceUrl: toText(a.dataSourceUrl),
    dataAuthor: toText(a.dataAuthor),
    dataAuthorUrl: toText(a.dataAuthorUrl),
    dataLicense: toText(a.dataLicense),
    dataLicenseUrl: toText(a.dataLicenseUrl),
    ratio: w && h ? h / w : null,
  };
}

/**
 * Converts a value to text.
 * @param v - The value to convert to text.
 * @returns The text representation of the value.
 */
function toText(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : "";
}

/**
 * Converts a value to a number.
 * @param v - The value to convert to a number.
 * @returns The number representation of the value.
 */
function toNumOrEmpty(v: unknown): string {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? String(Math.round(n)) : "";
}

/**
 * Parses a string to a positive integer.
 * @param s - The string to parse.
 * @returns The positive integer representation of the string.
 */
function parsePositiveInt(s: string): number | null {
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  const i = Math.round(n);
  return i > 0 ? i : null;
}

/**
 * Finds the active image-like node (image or imageFigure) and its document position.
 * Works when selection is on the node OR inside imageFigure caption.
 */
function findActiveImageNode(
  editor: Editor,
  typeName: ImageKind
): { pos: number; attrs: ImageAttrs; captionText?: string } | null {
  const { state } = editor;
  const sel = state.selection;

  // Direct NodeSelection
  if (sel instanceof NodeSelection && sel.node.type.name === typeName) {
    const captionText =
      typeName === "imageFigure" ? sel.node.textContent ?? "" : undefined;
    return { pos: sel.from, attrs: sel.node.attrs as ImageAttrs, captionText };
  }

  // Walk up from selection (caption text case)
  const $from = sel.$from;
  // Walk up from deepest node to the root node.
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth);
    // If the founded node is the target type, return the position and attributes.
    if (node.type.name === typeName) {
      // Get start position of the node for transactions.
      const pos = $from.before(depth);
      // If the node is an imageFigure, get the caption text.
      const captionText =
        typeName === "imageFigure" ? node.textContent ?? "" : undefined;
      return { pos, attrs: node.attrs as ImageAttrs, captionText };
    }
  }

  return null;
}

/**
 * Gets the active kind of image node.
 * @param editor - The editor to get the active kind from.
 * @returns The active kind of image node.
 */
function getActiveKind(editor: Editor | null): ImageKind | null {
  if (!editor) return null;
  if (editor.isActive("imageFigure")) return "imageFigure";
  if (editor.isActive("image")) return "image";
  return null;
}

/**
 * The modal for editing image properties.
 * @param props - The properties for the modal.
 * @param props.editor - The editor to edit the image properties.
 * @param props.opened - Whether the modal is opened.
 * @param props.onClose - The function to call when the modal is closed.
 */
export function MuikkuImagePropertiesModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;

  const canSave = useMemo(() => !!editor?.isEditable, [editor]);
  const [tab, setTab] = useState<string | null>("main");

  const [form, setForm] = useState<ImageFormState>(DEFAULT_FORM);

  // Hydrates the form from the editor.
  useEffect(() => {
    if (!opened || !editor) return;
    setForm(formFromEditor(editor));
  }, [opened, editor]);

  /**
   * The setField function.
   * @param key - The key of the field to set.
   * @param value - The value of the field to set.
   */
  const setField = <K extends keyof ImageFormState>(
    key: K,
    value: ImageFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * The handleText function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleText =
    (
      key: keyof Pick<
        ImageFormState,
        | "src"
        | "alt"
        | "captionText"
        | "dataSource"
        | "dataSourceUrl"
        | "dataAuthor"
        | "dataAuthorUrl"
        | "dataLicense"
        | "dataLicenseUrl"
      >
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.value);
    };

  /**
   * The handleCheck function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleCheck =
    (key: keyof Pick<ImageFormState, "lockRatio" | "captionEnabled">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.checked);
    };

  /**
   * The handleAlignChange function.
   * @param v - The value of the alignment.
   */
  const handleAlignChange = (v: string) => {
    setField("align", v === "none" ? null : (v as Align));
  };

  /**
   * Handles the width change event.
   * @param e - The change event.
   */
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.currentTarget.value;
    setForm((prev) => {
      const updated: ImageFormState = { ...prev, width: next };
      if (!prev.lockRatio) return updated;
      const w = parsePositiveInt(next);
      if (!w) return updated;
      const hNow = parsePositiveInt(prev.height);
      const r = prev.ratio ?? (w && hNow ? hNow / w : null);
      if (!r) return updated;
      updated.ratio = r;
      updated.height = String(Math.round(w * r));
      return updated;
    });
  };

  /**
   * Handles the height change event.
   * @param next - The next height.
   */
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.currentTarget.value;
    setForm((prev) => {
      const updated: ImageFormState = { ...prev, height: next };
      if (!prev.lockRatio) return updated;
      const h = parsePositiveInt(next);
      if (!h) return updated;
      const wNow = parsePositiveInt(prev.width);
      const r = prev.ratio ?? (wNow && h ? h / wNow : null);
      if (!r) return updated;
      updated.ratio = r;
      updated.width = String(Math.round(h / r));
      return updated;
    });
  };

  /**
   * Handles the OK button click event.
   */
  const handleOk = () => {
    if (!editor || !canSave) return;

    const kind = getActiveKind(editor);

    const w = parsePositiveInt(form.width);
    const h = parsePositiveInt(form.height);

    const nextAttrs: ImageAttrs = {
      src: form.src.trim() || null,
      alt: form.alt.trim() || null,
      width: w ?? null,
      height: h ?? null,
      align: form.align,
      dataSource: form.dataSource.trim() || null,
      dataSourceUrl: form.dataSourceUrl.trim() || null,
      dataAuthor: form.dataAuthor.trim() || null,
      dataAuthorUrl: form.dataAuthorUrl.trim() || null,
      dataLicense: form.dataLicense.trim() || null,
      dataLicenseUrl: form.dataLicenseUrl.trim() || null,
    };

    // CREATE mode: no active image node selected
    if (!kind) {
      // Optional: require URL
      if (!nextAttrs.src) return;

      if (form.captionEnabled) {
        // Prefer your command if available
        const chain = editor.chain().focus();

        if (typeof chain.setImageFigure === "function") {
          const ok = chain
            .setImageFigure(nextAttrs, form.captionText.trim() || undefined)
            .run();
          if (ok) onClose();
          return;
        }

        // Fallback: insert imageFigure node directly
        const ok = editor
          .chain()
          .focus()
          .insertContent({
            type: "imageFigure",
            attrs: { class: "image", ...nextAttrs },
            content: form.captionText.trim()
              ? [{ type: "text", text: form.captionText.trim() }]
              : [],
          })
          .run();

        if (ok) onClose();
        return;
      }

      // Plain image insert
      const ok = editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: nextAttrs,
        })
        .run();

      if (ok) onClose();
      return;
    }

    // EDIT mode: existing image/imageFigure is active

    // Caption toggling / caption text requires replacing the node for imageFigure content
    if (form.captionEnabled) {
      if (kind === "image") {
        // Convert selected image -> imageFigure with captionText
        const ok = editor
          .chain()
          .focus()
          .addImageCaption(form.captionText.trim() || undefined)
          .run();

        if (!ok) return;

        // Now update attrs on the new imageFigure
        editor.commands.updateAttributes("imageFigure", nextAttrs);
        onClose();
        return;
      }

      // kind === imageFigure: update attrs + caption text
      const info = findActiveImageNode(editor, "imageFigure");
      if (!info) return;

      const { state, view } = editor;
      const nodeType = state.schema.nodes.imageFigure;
      if (!nodeType) return;

      const text = form.captionText.trim();
      const content = text ? state.schema.text(text) : null;

      const newNode = nodeType.create(
        { ...info.attrs, ...nextAttrs },
        content ? [content] : []
      );

      const currentNode = state.doc.nodeAt(info.pos);
      if (!currentNode) return;

      const tr = state.tr.replaceWith(
        info.pos,
        info.pos + currentNode.nodeSize,
        newNode
      );

      view.dispatch(tr);
      view.focus();
      onClose();
      return;
    }

    // caption disabled
    if (kind === "imageFigure") {
      // Convert imageFigure -> image
      const ok = editor.chain().focus().removeImageCaption().run();
      if (!ok) return;

      // Update attrs on the new image
      editor.commands.updateAttributes("image", nextAttrs);
      onClose();
      return;
    }

    // kind === image
    editor.commands.updateAttributes("image", nextAttrs);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="KUVAN OMINAISUUDET"
      size="lg"
      centered
    >
      <>
        <Tabs value={tab} onChange={setTab}>
          <Tabs.List>
            <Tabs.Tab value="main">Kuvan tiedot</Tabs.Tab>
            <Tabs.Tab value="meta">Lisätiedot</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="main" pt="md">
            <Stack gap="sm">
              <TextInput
                label="Osoite"
                value={form.src}
                onChange={handleText("src")}
              />

              <TextInput
                label="Vaihtoehtoinen teksti"
                value={form.alt}
                onChange={handleText("alt")}
              />

              <Group grow align="flex-end">
                <TextInput
                  label="Leveys"
                  value={form.width}
                  onChange={handleWidthChange}
                  placeholder="px"
                />
                <TextInput
                  label="Korkeus"
                  value={form.height}
                  onChange={handleHeightChange}
                  placeholder="px"
                />
              </Group>

              <Checkbox
                checked={form.lockRatio}
                onChange={handleCheck("lockRatio")}
                label="Säilytä kuvasuhde"
              />

              <div style={{ fontWeight: 600, marginTop: 6 }}>Kohdistus</div>
              <Radio.Group
                value={form.align ?? "none"}
                onChange={handleAlignChange}
              >
                <Group>
                  <Radio value="none" label="Ei asetettu" />
                  <Radio value="left" label="Vasemmalle" />
                  <Radio value="center" label="Keskelle" />
                  <Radio value="right" label="Oikealle" />
                </Group>
              </Radio.Group>

              <Checkbox
                checked={form.captionEnabled}
                onChange={handleCheck("captionEnabled")}
                label="Kuva kuvatekstillä"
              />

              {form.captionEnabled ? (
                <TextInput
                  label="Kuvateksti"
                  value={form.captionText}
                  onChange={handleText("captionText")}
                  placeholder="Kirjoita kuvateksti…"
                />
              ) : null}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="meta" pt="md">
            <Stack gap="sm">
              <Group grow>
                <TextInput
                  label="Lähde"
                  value={form.dataSource}
                  onChange={handleText("dataSource")}
                />
                <TextInput
                  label="Lähteen URL-osoite"
                  value={form.dataSourceUrl}
                  onChange={handleText("dataSourceUrl")}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Tekijä"
                  value={form.dataAuthor}
                  onChange={handleText("dataAuthor")}
                />
                <TextInput
                  label="Tekijän URL-osoite"
                  value={form.dataAuthorUrl}
                  onChange={handleText("dataAuthorUrl")}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Lisenssi"
                  value={form.dataLicense}
                  onChange={handleText("dataLicense")}
                />
                <TextInput
                  label="Lisenssin URL-osoite"
                  value={form.dataLicenseUrl}
                  onChange={handleText("dataLicenseUrl")}
                />
              </Group>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            PERUUTA
          </Button>
          <Button onClick={handleOk} disabled={!canSave || !editor}>
            OK
          </Button>
        </Group>
      </>
    </Modal>
  );
}
