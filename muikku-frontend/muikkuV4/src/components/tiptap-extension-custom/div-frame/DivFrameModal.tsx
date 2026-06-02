"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Modal,
  Tabs,
  Button,
  Stack,
  TextInput,
  Select,
  Group,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";

import { stylesSet, type StyleDefinition } from "../style-set/helper";
import { buildDivFrameAttrs, type DivFrameAttrs } from "./DivFrameExtension";

export type DivFrameModalProps = {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
};

const DIR_OPTIONS = [
  { value: "", label: "Ei asetettu" },
  { value: "ltr", label: "ltr" },
  { value: "rtl", label: "rtl" },
];

/**
 * Find the style definition by class.
 * @param cls - The class to find.
 * @returns The style definition or null.
 */
function findStyleDefinitionByClass(
  cls: string | null | undefined
): StyleDefinition | null {
  if (!cls) return null;
  return (
    stylesSet.find((s) => {
      const c = s.attributes.class;
      return typeof c === "string" && cls.split(/\s+/).includes(c);
    }) ?? null
  );
}

/**
 * Find the style definition by name.
 * @param name - The name to find.
 * @returns The style definition or null.
 */
function findStyleDefinitionByName(name: string): StyleDefinition | null {
  return stylesSet.find((s) => s.name === name) ?? null;
}

/**
 * The DivFrameModal component.
 * @param editor - The editor.
 * @param opened - Whether the modal is opened.
 * @param onClose - The function to call when the modal is closed.
 * @returns The DivFrameModal component.
 */
export function DivFrameModal({ editor, opened, onClose }: DivFrameModalProps) {
  const [tab, setTab] = useState<string | null>("general");

  const [styleName, setStyleName] = useState<string | null>(null);
  const [extraClass, setExtraClass] = useState("");
  const [id, setId] = useState("");
  const [lang, setLang] = useState("");
  const [styleAttr, setStyleAttr] = useState("");
  const [title, setTitle] = useState("");
  const [dir, setDir] = useState<string>("");

  const styleSelectData = useMemo(
    () => [
      { value: "", label: "Ei asetettu" },
      ...stylesSet.map((s) => ({ value: s.name, label: s.name })),
    ],
    []
  );

  useEffect(() => {
    if (!opened || !editor) return;

    const found = editor.isActive("divFrame");
    if (found) {
      const a = editor.getAttributes("divFrame") as DivFrameAttrs;
      const preset = findStyleDefinitionByClass(a.class);
      setStyleName(preset?.name ?? null);
      setExtraClass(""); // optional: strip preset classes from display
      setId(a.id ?? "");
      setLang(a.lang ?? "");
      setStyleAttr(a.style ?? "");
      setTitle(a.title ?? "");
      setDir(a.dir ?? "");
    } else {
      setStyleName(null);
      setExtraClass("");
      setId("");
      setLang("");
      setStyleAttr("");
      setTitle("");
      setDir("");
    }
  }, [opened, editor]);

  const handleOk = () => {
    if (!editor) return;

    const preset =
      styleName && styleName.length > 0
        ? stylesSet.find((s) => s.name === styleName)
        : undefined;

    const attrs = buildDivFrameAttrs({
      presetAttributes: preset?.attributes ?? null,
      extraClass: extraClass || null,
      id: id || null,
      lang: lang || null,
      style: styleAttr || null,
      title: title || null,
      dir: dir || null,
    });

    editor.chain().focus().setDivFrame(attrs).run();
    onClose();
  };

  /**
   * Handle the selection of a style set.
   * @param v - The value of the selected style set.
   */
  const handleSelectStyleSet = (v: string | null) => {
    setStyleName(v?.length ? v : null);
    // Find selected style definition and overwrite extra class with the class of the selected style definition
    const style = findStyleDefinitionByName(v ?? "");
    const updatedExtraClass =
      typeof style?.attributes?.class === "string"
        ? style.attributes.class
        : "";
    setExtraClass(updatedExtraClass);
  };

  /**
   * Handle the selection of extra classes.
   * @param v - The value of the selected extra classes.
   */
  const handleSelectExtraClass = (e: ChangeEvent<HTMLInputElement>) => {
    setExtraClass(e.currentTarget.value);
  };

  /**
   * Handle the selection of an id.
   * @param e - The event object.
   */
  const handleSelectId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.currentTarget.value);
  };

  /**
   * Handle the selection of a language.
   * @param e - The event object.
   */
  const handleSelectLang = (e: ChangeEvent<HTMLInputElement>) => {
    setLang(e.currentTarget.value);
  };

  /**
   * Handle the selection of a style attribute.
   * @param e - The event object.
   */
  const handleSelectStyleAttr = (e: ChangeEvent<HTMLInputElement>) => {
    setStyleAttr(e.currentTarget.value);
  };

  /**
   * Handle the selection of a title.
   * @param e - The event object.
   */
  const handleSelectTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  /**
   * Handle the selection of a direction.
   * @param v - The value of the selected direction.
   */
  const handleSelectDir = (v: string | null) => {
    setDir(v ?? "");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Div-kehikko"
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
            <Select
              label="Tyyli"
              data={styleSelectData}
              value={styleName ?? ""}
              onChange={handleSelectStyleSet}
              clearable
            />
            <TextInput
              label="Tyyliluokat"
              description="Lisäluokat (välilyönnillä erotettu)"
              value={extraClass}
              onChange={handleSelectExtraClass}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="advanced" pt="md">
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Tunniste"
                value={id}
                onChange={handleSelectId}
              />
              <TextInput
                label="Kielikoodi"
                value={lang}
                onChange={handleSelectLang}
              />
            </Group>
            <TextInput
              label="Tyyli (inline)"
              value={styleAttr}
              onChange={handleSelectStyleAttr}
            />
            <TextInput
              label="Avustava otsikko"
              value={title}
              onChange={handleSelectTitle}
            />
            <Select
              label="Kielen suunta"
              data={DIR_OPTIONS}
              value={dir}
              onChange={handleSelectDir}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Peruuta
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </Group>
    </Modal>
  );
}
