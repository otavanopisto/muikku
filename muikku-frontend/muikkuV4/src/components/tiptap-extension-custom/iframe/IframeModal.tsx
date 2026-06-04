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

type IframeFormState = {
  // General
  src: string;
  width: string;
  height: string;
  alignment: IframeAlignment;
  showScrollbars: boolean;
  showBorder: boolean;
  name: string;
  assistTitle: string;
  longDescUrl: string;
  // Advanced
  id: string;
  styleAttr: string;
  className: string;
};

// Default form state for the iframe.
const DEFAULT_FORM: IframeFormState = {
  src: "",
  width: "500",
  height: "200",
  alignment: "unset",
  showScrollbars: true,
  showBorder: false,
  name: "",
  assistTitle: "",
  longDescUrl: "",
  id: "",
  styleAttr: "",
  className: "",
};

/**
 * The formFromAttrs function.
 * @param a - The attributes of the iframe.
 * @returns The form state for the iframe.
 */
function formFromAttrs(a: IframeAttrs): IframeFormState {
  return {
    ...DEFAULT_FORM,
    src: a.src ?? "",
    width: a.width ?? "",
    height: a.height ?? "",
    alignment: a.alignment ?? "unset",
    showScrollbars: (a.scrolling ?? "yes") !== "no",
    showBorder: (a.frameborder ?? "0") !== "0",
    id: a.id ?? "",
    styleAttr: a.style ?? "",
    className: a.class ?? "",
    name: a.title ?? "",
    assistTitle: a.title ?? "",
    // longDescUrl: a.longdesc ?? "", // if you decide to support it
  };
}

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
  const [form, setForm] = useState<IframeFormState>(DEFAULT_FORM);

  /**
   * The setField function.
   * @param key - The key of the field to set.
   * @param value - The value of the field to set.
   */
  const setField = <K extends keyof IframeFormState>(
    key: K,
    value: IframeFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * The handleText function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleText =
    (key: Extract<keyof IframeFormState, string>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.value);
    };

  /**
   * The handleCheck function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleCheck =
    (key: Extract<keyof IframeFormState, string>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.checked);
    };

  /**
   * The handleAlignmentChange function.
   * @param v - The value of the alignment.
   */
  const handleAlignmentChange = (v: string | null) => {
    setField("alignment", (v as IframeAlignment) ?? "unset");
  };

  useEffect(() => {
    if (!opened || !editor) return;
    if (editor.isActive("iframe")) {
      const a = editor.getAttributes("iframe") as IframeAttrs;
      setForm(formFromAttrs(a));
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [opened, editor]);

  /**
   * The handleOk function.
   */
  const handleOk = () => {
    if (!editor) return;
    const attrs: IframeAttrs = {
      src: form.src.trim(),
      width: form.width.trim() || null,
      height: form.height.trim() || null,
      alignment: form.alignment,
      scrolling: form.showScrollbars ? "yes" : "no",
      frameborder: form.showBorder ? "1" : "0",
      id: form.id.trim() || null,
      class: form.className.trim() || null,
      style: form.styleAttr.trim() || null,
      title: (form.assistTitle || form.name).trim() || null,
      // longdesc: form.longDescUrl.trim() || null,
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
              value={form.src}
              onChange={handleText("src")}
            />

            <Group grow>
              <TextInput
                label="Leveys"
                value={form.width}
                onChange={handleText("width")}
              />
              <TextInput
                label="Korkeus"
                value={form.height}
                onChange={handleText("height")}
              />
              <Select
                label="Kohdistus"
                data={ALIGN_OPTIONS}
                value={form.alignment}
                onChange={handleAlignmentChange}
              />
            </Group>

            <Group>
              <Checkbox
                checked={form.showScrollbars}
                onChange={handleCheck("showScrollbars")}
                label="Näytä vierityspalkit"
              />
              <Checkbox
                checked={form.showBorder}
                onChange={handleCheck("showBorder")}
                label="Näytä kehyksen reunat"
              />
            </Group>

            <Group grow>
              <TextInput
                label="Nimi"
                value={form.name}
                onChange={handleText("name")}
              />
              <TextInput
                label="Avustava otsikko"
                value={form.assistTitle}
                onChange={handleText("assistTitle")}
              />
            </Group>

            <TextInput
              label="Pitkän kuvauksen URL"
              value={form.longDescUrl}
              onChange={handleText("longDescUrl")}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="advanced" pt="md">
          <Stack gap="sm">
            <TextInput
              label="Tunniste"
              value={form.id}
              onChange={handleText("id")}
            />

            <Group grow>
              <TextInput
                label="Tyyli"
                value={form.styleAttr}
                onChange={handleText("styleAttr")}
              />
              <TextInput
                label="Tyylitiedoston luokat"
                value={form.className}
                onChange={handleText("className")}
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
