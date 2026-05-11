"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Tabs, Group, Stack, Text, Checkbox } from "@mantine/core";
import type { Editor } from "@tiptap/react";

import { Input } from "@/components/tiptap-ui-primitive/input";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { sanitizeUrl } from "@/lib/tiptap-utils";
import type { MuikkuLinkAttrs } from "./MuikkuLinkExtension";
import { collectAnchorOptions, type AnchorOption } from "./helper";

type LinkType = "url" | "anchor" | "email" | "phone";

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

  const [type, setType] = useState<LinkType>("url");

  // Type-specific fields
  const [displayText, setDisplayText] = useState("");
  const [url, setUrl] = useState("");
  const [anchor, setAnchor] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phone, setPhone] = useState("");

  // Shared attrs (“Lisäominaisuudet”)
  const [id, setId] = useState("");
  const [dir, setDir] = useState("");
  const [accesskey, setAccesskey] = useState("");
  const [tabindex, setTabindex] = useState("");
  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("");
  const [style, setStyle] = useState("");
  const [rel, setRel] = useState("");
  const [target, setTarget] = useState("");
  const [forceDownload, setForceDownload] = useState(false);

  const isLinkActive = !!editor?.isActive("link");

  /**
   * Reset the link settings from the selection.
   */
  const resetFromSelection = useCallback(() => {
    if (!editor) return;

    const attrs = editor.getAttributes("link") as MuikkuLinkAttrs;
    const href = String(attrs.href ?? "");

    // DisplayText: if selection is not empty, we can show selected text.
    const { from, to, empty } = editor.state.selection;
    const selectedText = empty
      ? ""
      : editor.state.doc.textBetween(from, to, " ");
    setDisplayText(selectedText);

    // Shared attrs
    setId(attrs.id ?? "");
    setDir(attrs.dir ?? "");
    setAccesskey(attrs.accesskey ?? "");
    setTabindex(attrs.tabindex ?? "");
    setTitle(attrs.title ?? "");
    setClassName(attrs.class ?? "");
    setStyle(attrs.style ?? "");
    setRel(attrs.rel ?? "");
    setTarget(attrs.target ?? "");
    setForceDownload(attrs.download !== null && attrs.download !== undefined);

    // Type + type fields
    const nextType = href ? detectType(href) : "url";
    setType(nextType);

    if (nextType === "email") {
      const p = parseMailto(href);
      setEmail(p.email);
      setEmailSubject(p.subject);
      setEmailBody(p.body);
      setUrl("");
      setPhone("");
      setAnchor("");
      return;
    }

    if (nextType === "phone") {
      setPhone(parseTel(href));
      setUrl("");
      setEmail("");
      setEmailSubject("");
      setEmailBody("");
      setAnchor("");
      return;
    }

    if (nextType === "anchor") {
      setAnchor(parseAnchor(href));
      setUrl("");
      setEmail("");
      setEmailSubject("");
      setEmailBody("");
      setPhone("");
      return;
    }

    // url
    setUrl(href);
    setEmail("");
    setEmailSubject("");
    setEmailBody("");
    setPhone("");
    setAnchor("");
  }, [editor]);

  // Resets the link settings from the selection when the modal is opened
  useEffect(() => {
    if (!opened) return;
    resetFromSelection();
  }, [opened, resetFromSelection]);

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

  const computedHref = useMemo(() => {
    if (type === "email") return buildMailto(email, emailSubject, emailBody);
    if (type === "phone") return buildTel(phone);
    if (type === "anchor") return buildAnchor(anchor);

    // URL: sanitize (but keep it as-is if empty)
    const raw = url.trim();
    if (!raw) return "";
    return sanitizeUrl(raw, window.location.href);
  }, [type, url, anchor, email, emailSubject, emailBody, phone]);

  const computedAttrs = useMemo<MuikkuLinkAttrs>(() => {
    const attrs: MuikkuLinkAttrs = {
      href: computedHref || null,
      id: emptyToNull(id),
      dir: emptyToNull(dir),
      accesskey: emptyToNull(accesskey),
      tabindex: emptyToNull(tabindex),
      title: emptyToNull(title),
      class: emptyToNull(className),
      style: emptyToNull(style),
      rel: emptyToNull(rel),
      target: emptyToNull(target),
      download: forceDownload ? "" : null,
    };

    return attrs;
  }, [
    computedHref,
    id,
    dir,
    accesskey,
    tabindex,
    title,
    className,
    style,
    rel,
    target,
    forceDownload,
  ]);

  const canApply = !!editor?.isEditable && !!computedHref.trim();

  /**
   * Apply the link settings.
   */
  const apply = useCallback(() => {
    if (!editor) return;
    if (!computedHref.trim()) return;

    const { empty } = editor.state.selection;

    // If empty selection, insert display text (or fallback) and mark it.
    if (empty) {
      const text =
        displayText.trim() ||
        (type === "url"
          ? computedHref
          : type === "anchor"
          ? `#${anchor.trim()}`
          : type === "email"
          ? email.trim()
          : phone.trim());

      if (!text.trim()) return;

      editor.commands.insertMuikkuLink({
        text,
        ...computedAttrs,
      });

      onClose();
      return;
    }

    editor.commands.setMuikkuLink(computedAttrs);

    onClose();
  }, [
    editor,
    computedHref,
    computedAttrs,
    onClose,
    displayText,
    type,
    anchor,
    email,
    phone,
  ]);

  /**
   * Remove the link.
   */
  const remove = useCallback(() => {
    if (!editor) return;
    editor.commands.unsetMuikkuLink();
    onClose();
  }, [editor, onClose]);

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
                  value={displayText}
                  onChange={(e) => setDisplayText(e.target.value)}
                  placeholder="Text shown for the link"
                />
              </div>

              <div>
                <Text size="sm" fw={600}>
                  Linkkityyppi
                </Text>
                <select
                  className="tiptap-input"
                  value={type}
                  onChange={(e) => setType(e.target.value as LinkType)}
                >
                  <option value="url">Osoite</option>
                  <option value="anchor">Ankkuri tässä sivussa</option>
                  <option value="email">Sähköposti</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              {type === "url" && (
                <div>
                  <Text size="sm" fw={600}>
                    Osoite
                  </Text>
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              )}

              {type === "anchor" && (
                <div>
                  <Text size="sm" fw={600}>
                    Ankkuri tässä sivussa
                  </Text>
                  <select
                    className="tiptap-input"
                    value={anchor}
                    onChange={(e) => setAnchor(e.target.value)}
                  >
                    <option value="">{"<ei asetettu>"}</option>
                    {anchorOptions.map((opt) => (
                      <option
                        key={`${opt.source}:${opt.value}`}
                        value={opt.value}
                      >
                        {opt.value}
                      </option>
                    ))}
                  </select>
                  <Text size="xs" c="dimmed" mt={6}>
                    Voit myös kirjoittaa ankkurin nimen käsin.
                  </Text>
                  <Input
                    value={anchor}
                    onChange={(e) => setAnchor(e.target.value)}
                    placeholder="Anchor in the page"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
              )}

              {type === "email" && (
                <>
                  <div>
                    <Text size="sm" fw={600}>
                      Sähköpostiosoite
                    </Text>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Text size="sm" fw={600}>
                      Aihe
                    </Text>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <Text size="sm" fw={600}>
                      Viesti
                    </Text>
                    <Input
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Body"
                    />
                  </div>
                </>
              )}

              {type === "phone" && (
                <div>
                  <Text size="sm" fw={600}>
                    Phone number
                  </Text>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  <Input value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Kielen suunta
                  </Text>
                  <select
                    className="tiptap-input"
                    value={dir}
                    onChange={(e) => setDir(e.target.value)}
                  >
                    <option value="">{"<ei asetettu>"}</option>
                    <option value="ltr">ltr</option>
                    <option value="rtl">rtl</option>
                    <option value="auto">auto</option>
                  </select>
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Pikanäppäin
                  </Text>
                  <Input
                    value={accesskey}
                    onChange={(e) => setAccesskey(e.target.value)}
                  />
                </div>
              </Group>

              <Group grow align="flex-start">
                <div>
                  <Text size="sm" fw={600}>
                    Tabulaattori indeksi
                  </Text>
                  <Input
                    value={tabindex}
                    onChange={(e) => setTabindex(e.target.value)}
                  />
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Avustava otsikko
                  </Text>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Text size="sm" fw={600}>
                    Suhde (rel)
                  </Text>
                  <Input value={rel} onChange={(e) => setRel(e.target.value)} />
                </div>
              </Group>

              <Group grow align="flex-start">
                <div>
                  <Text size="sm" fw={600}>
                    Kohde (target)
                  </Text>
                  <select
                    className="tiptap-input"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  >
                    <option value="">{"<ei asetettu>"}</option>
                    <option value="_self">_self</option>
                    <option value="_blank">_blank</option>
                    <option value="_parent">_parent</option>
                    <option value="_top">_top</option>
                  </select>
                </div>

                <div>
                  <Text size="sm" fw={600}>
                    Tyyliluokat (class)
                  </Text>
                  <Input
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
              </Group>

              <div>
                <Text size="sm" fw={600}>
                  Tyyli (style)
                </Text>
                <Input
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </div>

              <Checkbox
                checked={forceDownload}
                onChange={(e) => setForceDownload(e.currentTarget.checked)}
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
              onClick={apply}
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
            onClick={remove}
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
