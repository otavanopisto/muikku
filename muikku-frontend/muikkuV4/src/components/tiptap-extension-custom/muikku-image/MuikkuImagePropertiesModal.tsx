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

  // Main fields
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [ratio, setRatio] = useState<number | null>(null);

  const [align, setAlign] = useState<Align>(null);
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [captionText, setCaptionText] = useState("");

  // Metadata fields
  const [dataSource, setDataSource] = useState("");
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [dataAuthor, setDataAuthor] = useState("");
  const [dataAuthorUrl, setDataAuthorUrl] = useState("");
  const [dataLicense, setDataLicense] = useState("");
  const [dataLicenseUrl, setDataLicenseUrl] = useState("");

  // Load current node attrs when opening
  useEffect(() => {
    if (!opened || !editor) return;

    const kind = getActiveKind(editor);
    // If no image node is selected, reset the fields to defaults.
    if (!kind) {
      // If nothing selected, reset to defaults
      setSrc("");
      setAlt("");
      setWidth("");
      setHeight("");
      setAlign(null);
      setCaptionEnabled(false);
      setCaptionText("");
      setDataSource("");
      setDataSourceUrl("");
      setDataAuthor("");
      setDataAuthorUrl("");
      setDataLicense("");
      setDataLicenseUrl("");
      setRatio(null);
      return;
    }

    // Get the active image node by kind (image or imageFigure).
    const info =
      kind === "imageFigure"
        ? findActiveImageNode(editor, "imageFigure")
        : findActiveImageNode(editor, "image");

    // Get the attributes of the active image node.
    const a = info?.attrs ?? (editor.getAttributes(kind) as ImageAttrs);

    // Set the source, alt, width, height, align, caption enabled, caption text, data source, data source url, data author, data author url, data license, and data license url.
    setSrc(toText(a.src));
    setAlt(toText(a.alt));
    setWidth(toNumOrEmpty(a.width));
    setHeight(toNumOrEmpty(a.height));
    setAlign((a.align ?? null) as Align);

    const isFig = kind === "imageFigure";
    setCaptionEnabled(isFig);
    setCaptionText(isFig ? info?.captionText ?? "" : "");

    setDataSource(toText(a.dataSource));
    setDataSourceUrl(toText(a.dataSourceUrl));
    setDataAuthor(toText(a.dataAuthor));
    setDataAuthorUrl(toText(a.dataAuthorUrl));
    setDataLicense(toText(a.dataLicense));
    setDataLicenseUrl(toText(a.dataLicenseUrl));

    // Compute ratio if width/height exist
    const w = parsePositiveInt(toNumOrEmpty(a.width));
    const h = parsePositiveInt(toNumOrEmpty(a.height));
    setRatio(w && h ? h / w : null);
  }, [opened, editor]);

  /**
   * Handles the width change event.
   * @param next - The next width.
   */
  const handleWidthChange = (next: string) => {
    setWidth(next);
    if (!lockRatio) return;

    const w = parsePositiveInt(next);
    if (!w) return;

    // Prefer stored ratio; if missing but height is filled, compute it
    const hNow = parsePositiveInt(height);
    const r = ratio ?? (w && hNow ? hNow / w : null);
    if (!r) return;

    setRatio(r);
    setHeight(String(Math.round(w * r)));
  };

  /**
   * Handles the height change event.
   * @param next - The next height.
   */
  const handleHeightChange = (next: string) => {
    setHeight(next);
    if (!lockRatio) return;

    const h = parsePositiveInt(next);
    if (!h) return;

    // Prefer stored ratio; if missing but width is filled, compute it
    const wNow = parsePositiveInt(width);
    const r = ratio ?? (wNow && h ? h / wNow : null);
    if (!r) return;

    setRatio(r);
    setWidth(String(Math.round(h / r)));
  };

  /**
   * Handles the OK button click event.
   */
  const handleOk = () => {
    if (!editor || !canSave) return;

    const kind = getActiveKind(editor);

    const w = parsePositiveInt(width);
    const h = parsePositiveInt(height);

    const nextAttrs: ImageAttrs = {
      src: src.trim() || null,
      alt: alt.trim() || null,
      width: w ?? null,
      height: h ?? null,
      align,
      dataSource: dataSource.trim() || null,
      dataSourceUrl: dataSourceUrl.trim() || null,
      dataAuthor: dataAuthor.trim() || null,
      dataAuthorUrl: dataAuthorUrl.trim() || null,
      dataLicense: dataLicense.trim() || null,
      dataLicenseUrl: dataLicenseUrl.trim() || null,
    };

    // CREATE mode: no active image node selected
    if (!kind) {
      // Optional: require URL
      if (!nextAttrs.src) return;

      if (captionEnabled) {
        // Prefer your command if available
        const chain = editor.chain().focus();

        if (typeof chain.setImageFigure === "function") {
          const ok = chain
            .setImageFigure(nextAttrs, captionText.trim() || undefined)
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
            content: captionText.trim()
              ? [{ type: "text", text: captionText.trim() }]
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
    if (captionEnabled) {
      if (kind === "image") {
        // Convert selected image -> imageFigure with captionText
        const ok = editor
          .chain()
          .focus()
          .addImageCaption(captionText.trim() || undefined)
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

      const text = captionText.trim();
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
                value={src}
                onChange={(e) => setSrc(e.currentTarget.value)}
              />

              <TextInput
                label="Vaihtoehtoinen teksti"
                value={alt}
                onChange={(e) => setAlt(e.currentTarget.value)}
              />

              <Group grow align="flex-end">
                <TextInput
                  label="Leveys"
                  value={width}
                  onChange={(e) => handleWidthChange(e.currentTarget.value)}
                  placeholder="px"
                />
                <TextInput
                  label="Korkeus"
                  value={height}
                  onChange={(e) => handleHeightChange(e.currentTarget.value)}
                  placeholder="px"
                />
              </Group>

              <Checkbox
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.currentTarget.checked)}
                label="Säilytä kuvasuhde"
              />

              <div style={{ fontWeight: 600, marginTop: 6 }}>Kohdistus</div>
              <Radio.Group
                value={align ?? "none"}
                onChange={(v) => setAlign(v === "none" ? null : (v as Align))}
              >
                <Group>
                  <Radio value="none" label="Ei asetettu" />
                  <Radio value="left" label="Vasemmalle" />
                  <Radio value="center" label="Keskelle" />
                  <Radio value="right" label="Oikealle" />
                </Group>
              </Radio.Group>

              <Checkbox
                checked={captionEnabled}
                onChange={(e) => setCaptionEnabled(e.currentTarget.checked)}
                label="Kuva kuvatekstillä"
              />

              {captionEnabled ? (
                <TextInput
                  label="Kuvateksti"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.currentTarget.value)}
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
                  value={dataSource}
                  onChange={(e) => setDataSource(e.currentTarget.value)}
                />
                <TextInput
                  label="Lähteen URL-osoite"
                  value={dataSourceUrl}
                  onChange={(e) => setDataSourceUrl(e.currentTarget.value)}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Tekijä"
                  value={dataAuthor}
                  onChange={(e) => setDataAuthor(e.currentTarget.value)}
                />
                <TextInput
                  label="Tekijän URL-osoite"
                  value={dataAuthorUrl}
                  onChange={(e) => setDataAuthorUrl(e.currentTarget.value)}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Lisenssi"
                  value={dataLicense}
                  onChange={(e) => setDataLicense(e.currentTarget.value)}
                />
                <TextInput
                  label="Lisenssin URL-osoite"
                  value={dataLicenseUrl}
                  onChange={(e) => setDataLicenseUrl(e.currentTarget.value)}
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
