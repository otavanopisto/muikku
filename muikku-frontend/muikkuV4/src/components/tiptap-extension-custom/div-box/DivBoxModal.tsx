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

import type { DivBoxAttrs } from "./DivBoxExtension";
import { stylesSet, type StyleDefinition } from "./helper";

const DIR_OPTIONS = [
  { value: "", label: "Ei asetettu" },
  { value: "ltr", label: "ltr" },
  { value: "rtl", label: "rtl" },
];

/**
 * Find the style definition by name.
 * @param name - The name to find.
 * @returns The style definition or null.
 */
function findStyleDefinitionByName(name: string): StyleDefinition | null {
  return stylesSet.find((s) => s.name === name) ?? null;
}

/**
 * The DivBoxModal component.
 * @param props - The props for the DivBoxModal component.
 * @returns The DivBoxModal component.
 */
export function DivBoxModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;

  const [tab, setTab] = useState<string | null>("general");

  const [styleName, setStyleName] = useState<string | null>(null);
  const [extraClass, setExtraClass] = useState("");

  const [id, setId] = useState("");
  const [lang, setLang] = useState("");
  const [styleAttr, setStyleAttr] = useState("");
  const [title, setTitle] = useState("");
  const [dir, setDir] = useState("");

  const styleSelectData = useMemo(
    () => [
      { value: "", label: "Ei asetettu" },
      ...stylesSet.map((s) => ({ value: s.name, label: s.name })),
    ],
    []
  );

  useEffect(() => {
    if (!opened || !editor) return;
    const a = editor.getAttributes("divBox") as Partial<DivBoxAttrs>;

    const preset = findStyleDefinitionByName(a["data-style"] ?? "");
    setStyleName(preset?.name ?? null);
    setExtraClass(a.class ?? "");

    setId(a.id ?? "");
    setLang(a.lang ?? "");
    setStyleAttr(a.style ?? "");
    setTitle(a.title ?? "");
    setDir(a.dir ?? "");
  }, [opened, editor]);

  const handleOk = () => {
    if (!editor) return;

    editor.commands.updateDivBox({
      id: id.trim() ? id.trim() : null,
      lang: lang.trim() ? lang.trim() : null,
      style: styleAttr.trim() ? styleAttr.trim() : null,
      title: title.trim() ? title.trim() : null,
      dir: dir === "ltr" || dir === "rtl" ? dir : null,
      "data-style": styleName ?? null,
      class: extraClass.trim() ? extraClass.trim() : null,
    });

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
                onChange={(e) => setId(e.currentTarget.value)}
              />
              <TextInput
                label="Kielikoodi"
                value={lang}
                onChange={(e) => setLang(e.currentTarget.value)}
              />
            </Group>

            <TextInput
              label="Tyyli (inline)"
              value={styleAttr}
              onChange={(e) => setStyleAttr(e.currentTarget.value)}
            />
            <TextInput
              label="Avustava otsikko"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />

            <Select
              label="Kielen suunta"
              data={DIR_OPTIONS}
              value={dir}
              onChange={(v) => setDir(v ?? "")}
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

export default DivBoxModal;
