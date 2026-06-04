"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Tabs,
  Group,
  Stack,
  Text,
  Checkbox,
  Select,
  type ComboboxItem,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";

import { Input } from "@/components/tiptap-ui-primitive/input";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { sanitizeUrl } from "@/lib/tiptap-utils";
import type { MuikkuLinkAttrs } from "./MuikkuLinkExtension";
import { collectAnchorOptions, type AnchorOption } from "./helper";

type LinkType = "url" | "anchor" | "email" | "phone";

type LinkFormState = {
  // Basic
  type: LinkType;
  displayText: string;
  url: string;
  anchor: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  // Advanced attrs
  id: string;
  dir: string;
  accesskey: string;
  tabindex: string;
  title: string;
  className: string;
  style: string;
  rel: string;
  target: string;
  forceDownload: boolean;
};

// The default form state.
const DEFAULT_FORM: LinkFormState = {
  type: "url",
  displayText: "",
  url: "",
  anchor: "",
  email: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  id: "",
  dir: "",
  accesskey: "",
  tabindex: "",
  title: "",
  className: "",
  style: "",
  rel: "",
  target: "",
  forceDownload: false,
};

/**
 * The formFromSelection function.
 * @param editor - The editor to get the form state from.
 * @returns The form state for the selection.
 */
function formFromSelection(editor: Editor): LinkFormState {
  const attrs = editor.getAttributes("link") as MuikkuLinkAttrs;
  const href = String(attrs.href ?? "");

  const { from, to, empty } = editor.state.selection;
  const selectedText = empty ? "" : editor.state.doc.textBetween(from, to, " ");

  const base: LinkFormState = {
    ...DEFAULT_FORM,
    displayText: selectedText,

    id: attrs.id ?? "",
    dir: attrs.dir ?? "",
    accesskey: attrs.accesskey ?? "",
    tabindex: attrs.tabindex ?? "",
    title: attrs.title ?? "",
    className: attrs.class ?? "",
    style: attrs.style ?? "",
    rel: attrs.rel ?? "",
    target: attrs.target ?? "",
    forceDownload: attrs.download !== null && attrs.download !== undefined,
  };

  const nextType: LinkType = href ? detectType(href) : "url";
  base.type = nextType;

  if (nextType === "email") {
    const p = parseMailto(href);
    return {
      ...base,
      email: p.email,
      emailSubject: p.subject,
      emailBody: p.body,
    };
  }

  if (nextType === "phone") {
    return { ...base, phone: parseTel(href) };
  }

  if (nextType === "anchor") {
    return { ...base, anchor: parseAnchor(href) };
  }

  // url
  return { ...base, url: href };
}

/**
 * Detect the type of the link.
 * @param href - The href to detect the type of.
 * @returns The type of the link.
 */
function detectType(href: string): LinkType {
  const h = href.trim();
  if (h.startsWith("mailto:")) return "email";
  if (h.startsWith("tel:")) return "phone";
  if (h.startsWith("#")) return "anchor";
  return "url";
}

/**
 * Parse the mailto link.
 * @param href - The href to parse.
 * @returns The parsed mailto link.
 */
function parseMailto(href: string) {
  // mailto:user@x?subject=...&body=...
  const raw = href.replace(/^mailto:/i, "");
  const [addrPart, queryPart] = raw.split("?");
  const qp = new URLSearchParams(queryPart ?? "");
  return {
    email: decodeURIComponent(addrPart ?? ""),
    subject: qp.get("subject") ?? "",
    body: qp.get("body") ?? "",
  };
}

/**
 * Build the mailto link.
 * @param email - The email to build the link for.
 * @param subject - The subject to build the link for.
 * @param body - The body to build the link for.
 * @returns The built mailto link.
 */
function buildMailto(email: string, subject: string, body: string) {
  const addr = (email ?? "").trim();
  const qp = new URLSearchParams();
  if (subject.trim()) qp.set("subject", subject.trim());
  if (body.trim()) qp.set("body", body.trim());
  const qs = qp.toString();
  return `mailto:${encodeURIComponent(addr)}${qs ? `?${qs}` : ""}`;
}

/**
 * Parse the tel link.
 * @param href - The href to parse.
 * @returns The parsed tel link.
 */
function parseTel(href: string) {
  return href.replace(/^tel:/i, "").trim();
}

/**
 * Build the tel link.
 * @param phone - The phone to build the link for.
 * @returns The built tel link.
 */
function buildTel(phone: string) {
  // Keep +, digits; remove spaces and common separators
  const cleaned = (phone ?? "").trim().replace(/[()\s-]+/g, "");
  return `tel:${cleaned}`;
}

/**
 * Parse the anchor link.
 * @param href - The href to parse.
 * @returns The parsed anchor link.
 */
function parseAnchor(href: string) {
  return href.replace(/^#/, "");
}

/**
 * Build the anchor link.
 * @param anchor - The anchor to build the link for.
 * @returns The built anchor link.
 */
function buildAnchor(anchor: string) {
  const cleaned = (anchor ?? "").trim();
  return `#${cleaned}`;
}

/**
 * Convert an empty string to null.
 * @param v - The string to convert.
 * @returns The converted string.
 */
function emptyToNull(v: string): string | null {
  const t = v.trim();
  return t ? t : null;
}

/**
 * MuikkuLinkSettingsModalProps
 * @param editor - The editor to use.
 * @param opened - Whether the modal is opened.
 * @param onClose - The function to call when the modal is closed.
 */
export interface MuikkuLinkSettingsModalProps {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}

/**
 * MuikkuLinkSettingsModal
 * @param props - The props for the MuikkuLinkSettingsModal.
 * @returns The MuikkuLinkSettingsModal.
 */
export function MuikkuLinkSettingsModal(props: MuikkuLinkSettingsModalProps) {
  const { editor, opened, onClose } = props;

  // Anchor options collected from the editor
  const [anchorOptions, setAnchorOptions] = useState<AnchorOption[]>([]);
  const [form, setForm] = useState<LinkFormState>(DEFAULT_FORM);

  const isLinkActive = !!editor?.isActive("link");

  // Hydrates the form from the selection when the modal is opened
  useEffect(() => {
    if (!opened || !editor) return;
    setForm(formFromSelection(editor));
  }, [opened, editor]);

  // Collects the anchor options when the modal is opened
  useEffect(() => {
    if (!opened) return;
    setAnchorOptions(collectAnchorOptions(editor));
  }, [opened, editor]);

  // Sets up a listener to refresh the anchor options when the document changes (anchors added/removed)
  useEffect(() => {
    if (!opened || !editor) return;
    const refresh = () => setAnchorOptions(collectAnchorOptions(editor));
    editor.on("update", refresh);
    return () => {
      editor.off("update", refresh);
    };
  }, [opened, editor]);

  /**
   * The setField function.
   * @param key - The key of the field to set.
   * @param value - The value of the field to set.
   */
  const setField = <K extends keyof LinkFormState>(
    key: K,
    value: LinkFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * The handleText function.
   * @param key - The key of the field to set.
   * @returns The handleText function.
   */
  const handleText =
    (key: keyof Omit<LinkFormState, "forceDownload" | "type">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.value);
    };

  /**
   * The handleForceDownloadChange function.
   * @param e - The change event.
   */
  const handleCheck =
    (key: keyof Pick<LinkFormState, "forceDownload">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.checked);
    };

  /**
   * The handleAnchorChange function.
   * @param e - The change event.
   */
  const handleAnchorChange = (value: string | null, _option: ComboboxItem) => {
    setField("anchor", value ?? "");
  };

  /**
   * The handleTypeChange function.
   * @param e - The change event.
   */
  const handleTypeChange = (value: string | null, _option: ComboboxItem) => {
    setField("type", value as LinkType);
  };

  /**
   * The handleDirChange function.
   * @param e - The change event.
   */
  const handleDirChange = (value: string | null, _option: ComboboxItem) => {
    setField("dir", value ?? "");
  };

  /**
   * The handleTargetChange function.
   * @param e - The change event.
   */
  const handleTargetChange = (value: string | null, _option: ComboboxItem) => {
    setField("target", value ?? "");
  };

  /**
   * Apply the link settings.
   */
  const handleApplyClick = () => {
    if (!editor) return;
    if (!computedHref.trim()) return;
    const { empty } = editor.state.selection;
    if (empty) {
      const text =
        form.displayText.trim() ||
        (form.type === "url"
          ? computedHref
          : form.type === "anchor"
          ? `#${form.anchor.trim()}`
          : form.type === "email"
          ? form.email.trim()
          : form.phone.trim());
      if (!text.trim()) return;
      editor.commands.insertMuikkuLink({ text, ...computedAttrs });
      onClose();
      return;
    }
    editor.commands.setMuikkuLink(computedAttrs);
    onClose();
  };

  /**
   * Remove the link.
   */
  const handleRemoveClick = () => {
    if (!editor) return;
    editor.commands.unsetMuikkuLink();
    onClose();
  };

  const computedHref = (() => {
    if (form.type === "email")
      return buildMailto(form.email, form.emailSubject, form.emailBody);
    if (form.type === "phone") return buildTel(form.phone);
    if (form.type === "anchor") return buildAnchor(form.anchor);
    const raw = form.url.trim();
    if (!raw) return "";
    return sanitizeUrl(raw, window.location.href);
  })();

  const computedAttrs: MuikkuLinkAttrs = {
    href: computedHref || null,
    id: emptyToNull(form.id),
    dir: emptyToNull(form.dir),
    accesskey: emptyToNull(form.accesskey),
    tabindex: emptyToNull(form.tabindex),
    title: emptyToNull(form.title),
    class: emptyToNull(form.className),
    style: emptyToNull(form.style),
    rel: emptyToNull(form.rel),
    target: emptyToNull(form.target),
    download: form.forceDownload ? "" : null,
  };

  const canApply = !!editor?.isEditable && !!computedHref.trim();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="LINKKI"
      centered
      size="lg"
      trapFocus
      returnFocus
    >
      <Stack gap="md">
        <Tabs defaultValue="basic">
          <Tabs.List>
            <Tabs.Tab value="basic">Linkin tiedot</Tabs.Tab>
            <Tabs.Tab value="advanced">Lisäominaisuudet</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic" pt="md">
            <Stack gap="sm">
              <div>
                <Text size="sm" fw={600}>
                  Display Text
                </Text>
                <Input
                  value={form.displayText}
                  onChange={handleText("displayText")}
                  placeholder="Text shown for the link"
                />
              </div>

              <div>
                <Select
                  label="Linkkityyppi"
                  data={[
                    { value: "url", label: "Osoite" },
                    { value: "anchor", label: "Ankkuri tässä sivussa" },
                    { value: "email", label: "Sähköposti" },
                    { value: "phone", label: "Phone" },
                  ]}
                  value={form.type}
                  onChange={handleTypeChange}
                />
              </div>

              {form.type === "url" && (
                <div>
                  <Text size="sm" fw={600}>
                    Osoite
                  </Text>
                  <Input
                    type="url"
                    value={form.url}
                    onChange={handleText("url")}
                    placeholder="https://example.com"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              )}

              {form.type === "anchor" && (
                <div>
                  <Select
                    label="Ankkuri tässä sivussa"
                    placeholder="<ei asetettu>"
                    data={[
                      { value: "", label: "<ei asetettu>" },
                      ...anchorOptions.map((opt) => ({
                        value: opt.value,
                        label: opt.value,
                      })),
                    ]}
                    value={form.anchor}
                    onChange={handleAnchorChange}
                    searchable
                  />
                  <Text size="xs" c="dimmed" mt={6}>
                    Voit myös kirjoittaa ankkurin nimen käsin.
                  </Text>
                  <Input
                    value={form.anchor}
                    onChange={handleText("anchor")}
                    placeholder="Anchor in the page"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              )}

              {form.type === "email" && (
                <>
                  <div>
                    <Text size="sm" fw={600}>
                      Sähköpostiosoite
                    </Text>
                    <Input
                      value={form.email}
                      onChange={handleText("email")}
                      placeholder="user@example.com"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Text size="sm" fw={600}>
                      Aihe
                    </Text>
                    <Input
                      value={form.emailSubject}
                      onChange={handleText("emailSubject")}
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <Text size="sm" fw={600}>
                      Viesti
                    </Text>
                    <Input
                      value={form.emailBody}
                      onChange={handleText("emailBody")}
                      placeholder="Body"
                    />
                  </div>
                </>
              )}

              {form.type === "phone" && (
                <div>
                  <Text size="sm" fw={600}>
                    Phone number
                  </Text>
                  <Input
                    value={form.phone}
                    onChange={handleText("phone")}
                    placeholder="+358401234567"
                    autoComplete="off"
                  />
                </div>
              )}

              <Text size="xs" c="dimmed">
                Resulting href: <code>{computedHref || "<empty>"}</code>
              </Text>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="advanced" pt="md">
            <Stack gap="sm">
              <Group grow align="flex-start">
                <div>
                  <Text size="sm" fw={600}>
                    Tunniste
                  </Text>
                  <Input value={form.id} onChange={handleText("id")} />
                </div>
                <div>
                  <Select
                    label="Kielen suunta"
                    placeholder="<ei asetettu>"
                    data={[
                      { value: "", label: "<ei asetettu>" },
                      { value: "ltr", label: "ltr" },
                      { value: "rtl", label: "rtl" },
                      { value: "auto", label: "auto" },
                    ]}
                    value={form.dir}
                    onChange={handleDirChange}
                  />
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Pikanäppäin
                  </Text>
                  <Input
                    value={form.accesskey}
                    onChange={handleText("accesskey")}
                  />
                </div>
              </Group>

              <Group grow align="flex-start">
                <div>
                  <Text size="sm" fw={600}>
                    Tabulaattori indeksi
                  </Text>
                  <Input
                    value={form.tabindex}
                    onChange={handleText("tabindex")}
                  />
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Avustava otsikko
                  </Text>
                  <Input value={form.title} onChange={handleText("title")} />
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Suhde (rel)
                  </Text>
                  <Input value={form.rel} onChange={handleText("rel")} />
                </div>
              </Group>

              <Group grow align="flex-start">
                <div>
                  <Select
                    label="Kohde (target)"
                    placeholder="<ei asetettu>"
                    data={[
                      { value: "", label: "<ei asetettu>" },
                      { value: "_self", label: "_self" },
                      { value: "_blank", label: "_blank" },
                      { value: "_parent", label: "_parent" },
                      { value: "_top", label: "_top" },
                    ]}
                    value={form.target}
                    onChange={handleTargetChange}
                  />
                </div>

                <div>
                  <Text size="sm" fw={600}>
                    Tyyliluokat (class)
                  </Text>
                  <Input
                    value={form.className}
                    onChange={handleText("className")}
                  />
                </div>
              </Group>

              <div>
                <Text size="sm" fw={600}>
                  Tyyli (style)
                </Text>
                <Input value={form.style} onChange={handleText("style")} />
              </div>

              <Checkbox
                checked={form.forceDownload}
                onChange={handleCheck("forceDownload")}
                label="Force Download"
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="space-between" mt="xs">
          <Group>
            <Button
              type="button"
              variant="primary"
              onClick={handleApplyClick}
              disabled={!canApply}
              tooltip="OK"
              showTooltip={false}
            >
              OK
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              tooltip="PERUUTA"
              showTooltip={false}
            >
              PERUUTA
            </Button>
          </Group>

          <Button
            type="button"
            variant="ghost"
            onClick={handleRemoveClick}
            disabled={!isLinkActive}
            tooltip="Remove link"
          >
            Remove
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
