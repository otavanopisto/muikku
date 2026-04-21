"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Tabs,
  Button,
  Stack,
  TextInput,
  Select,
  Group,
  Checkbox,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type { IframeAlignment, IframeAttrs } from "./IframeExtension";

const ALIGN_OPTIONS = [
  { value: "unset", label: "<ei asetettu>" },
  { value: "left", label: "Tasaa vasemmat reunat" },
  { value: "center", label: "Align Center" },
  { value: "right", label: "Tasaa oikeat reunat" },
] satisfies { value: IframeAlignment; label: string }[];

/**
 * The IframeModal component.
 * @param props - The props for the IframeModal component.
 * @returns The IframeModal component.
 */
export function IframeModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;
  const isEditing = !!editor?.isActive("iframe");

  const [tab, setTab] = useState<string | null>("general");

  // General
  const [src, setSrc] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [alignment, setAlignment] = useState<IframeAlignment>("unset");
  const [showScrollbars, setShowScrollbars] = useState(true);
  const [showBorder, setShowBorder] = useState(false);
  const [name, setName] = useState(""); // maps to title for now
  const [assistTitle, setAssistTitle] = useState(""); // also title; keep separate if you later add aria-label
  const [longDescUrl, setLongDescUrl] = useState("");

  // Advanced
  const [id, setId] = useState("");
  const [styleAttr, setStyleAttr] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("iframe")) {
      const a = editor.getAttributes("iframe") as IframeAttrs;

      setSrc(a.src ?? "");
      setWidth(a.width ?? "");
      setHeight(a.height ?? "");
      setAlignment(a.alignment ?? "unset");

      setShowScrollbars((a.scrolling ?? "yes") !== "no");
      setShowBorder((a.frameborder ?? "0") !== "0");

      setId(a.id ?? "");
      setStyleAttr(a.style ?? "");
      setClassName(a.class ?? "");

      setName(a.title ?? "");
      setAssistTitle(a.title ?? "");
      //setLongDescUrl(a.longdesc ?? "");
    } else {
      setSrc("");
      setWidth("500");
      setHeight("200");
      setAlignment("unset");
      setShowScrollbars(true);
      setShowBorder(false);
      setId("");
      setStyleAttr("");
      setClassName("");
      setName("");
      setAssistTitle("");
      setLongDescUrl("");
    }
  }, [opened, editor]);

  const handleOk = () => {
    if (!editor) return;

    const attrs: IframeAttrs = {
      src: src.trim(),
      width: width.trim() || null,
      height: height.trim() || null,
      alignment: alignment,
      scrolling: showScrollbars ? "yes" : "no",
      frameborder: showBorder ? "1" : "0",
      id: id.trim() || null,
      class: className.trim() || null,
      style: styleAttr.trim() || null,
      // Keep “Name / Assist title / longdesc” minimal for v1:
      title: (assistTitle || name).trim() || null,
      // longdesc is legacy HTML; optional
      //longdesc: longDescUrl.trim() || null,
    };

    const ok = isEditing
      ? editor.commands.updateIframe(attrs)
      : editor.commands.setIframe(attrs);

    if (ok) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="IFRAME-KEHYKSEN OMINAISUUDET"
      size="lg"
      centered
    >
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="general">Yleinen</Tabs.Tab>
          <Tabs.Tab value="advanced">Lisäominaisuudet</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Stack gap="sm">
            <TextInput
              label="Osoite"
              value={src}
              onChange={(e) => setSrc(e.currentTarget.value)}
            />

            <Group grow>
              <TextInput
                label="Leveys"
                value={width}
                onChange={(e) => setWidth(e.currentTarget.value)}
              />
              <TextInput
                label="Korkeus"
                value={height}
                onChange={(e) => setHeight(e.currentTarget.value)}
              />
              <Select
                label="Kohdistus"
                data={ALIGN_OPTIONS}
                value={alignment}
                onChange={(v) =>
                  setAlignment((v as IframeAlignment) ?? "unset")
                }
              />
            </Group>

            <Group>
              <Checkbox
                checked={showScrollbars}
                onChange={(e) => setShowScrollbars(e.currentTarget.checked)}
                label="Näytä vierityspalkit"
              />
              <Checkbox
                checked={showBorder}
                onChange={(e) => setShowBorder(e.currentTarget.checked)}
                label="Näytä kehyksen reunat"
              />
            </Group>

            <Group grow>
              <TextInput
                label="Nimi"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
              <TextInput
                label="Avustava otsikko"
                value={assistTitle}
                onChange={(e) => setAssistTitle(e.currentTarget.value)}
              />
            </Group>

            <TextInput
              label="Pitkän kuvauksen URL"
              value={longDescUrl}
              onChange={(e) => setLongDescUrl(e.currentTarget.value)}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="advanced" pt="md">
          <Stack gap="sm">
            <TextInput
              label="Tunniste"
              value={id}
              onChange={(e) => setId(e.currentTarget.value)}
            />

            <Group grow>
              <TextInput
                label="Tyyli"
                value={styleAttr}
                onChange={(e) => setStyleAttr(e.currentTarget.value)}
              />
              <TextInput
                label="Tyylitiedoston luokat"
                value={className}
                onChange={(e) => setClassName(e.currentTarget.value)}
              />
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          PERUUTA
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </Group>
    </Modal>
  );
}

export default IframeModal;
