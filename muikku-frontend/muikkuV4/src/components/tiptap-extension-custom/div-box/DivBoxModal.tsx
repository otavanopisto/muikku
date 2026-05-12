"use client";

import { useEffect, useState, type ChangeEvent } from "react";
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

const STYLE_SELECT_DATA = [
  { value: "", label: "Ei asetettu" },
  ...stylesSet.map((s) => ({ value: s.name, label: s.name })),
];

/**
 * Find the style definition by name.
 * @param name - The name to find.
 * @returns The style definition or null.
 */
function findStyleDefinitionByName(name: string): StyleDefinition | null {
  return stylesSet.find((s) => s.name === name) ?? null;
}

type DivBoxFormState = {
  styleName: string | null;
  extraClass: string;
  id: string;
  lang: string;
  styleAttr: string;
  title: string;
  dir: string;
};

// Default form state for the div box.
const DEFAULT_FORM: DivBoxFormState = {
  styleName: null,
  extraClass: "",
  id: "",
  lang: "",
  styleAttr: "",
  title: "",
  dir: "",
};

/**
 * The formFromAttrs function.
 * @param a - The attributes of the div box.
 * @returns The form state for the div box.
 */
function formFromAttrs(a: Partial<DivBoxAttrs>): DivBoxFormState {
  const preset = findStyleDefinitionByName(a["data-style"] ?? "");
  return {
    ...DEFAULT_FORM,
    styleName: preset?.name ?? null,
    extraClass: a.class ?? "",
    id: a.id ?? "",
    lang: a.lang ?? "",
    styleAttr: a.style ?? "",
    title: a.title ?? "",
    dir: a.dir ?? "",
  };
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

  const [form, setForm] = useState<DivBoxFormState>(DEFAULT_FORM);

  // Hydrates the form from the attributes of the div box.
  useEffect(() => {
    if (!opened || !editor) return;
    const a = editor.getAttributes("divBox") as Partial<DivBoxAttrs>;
    setForm(formFromAttrs(a));
  }, [opened, editor]);

  /**
   * The setField function.
   * @param key - The key of the field to set.
   * @param value - The value of the field to set.
   */
  const setField = <K extends keyof DivBoxFormState>(
    key: K,
    value: DivBoxFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * The handleText function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleText =
    (
      key: keyof Pick<
        DivBoxFormState,
        "extraClass" | "id" | "lang" | "styleAttr" | "title"
      >
    ) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.value);
    };

  /**
   * The handleDirChange function.
   * @param v - The value of the direction.
   */
  const handleDirChange = (v: string | null) => {
    setField("dir", v ?? "");
  };

  /**
   * The handleSelectStyleSet function.
   * @param v - The value of the selected style set.
   */
  const handleSelectStyleSet = (v: string | null) => {
    const nextStyleName = v?.length ? v : null;
    setField("styleName", nextStyleName);
    // Overwrite extra class from preset (same behavior as current code)
    const style = findStyleDefinitionByName(v ?? "");
    const updatedExtraClass =
      typeof style?.attributes?.class === "string"
        ? style.attributes.class
        : "";
    setField("extraClass", updatedExtraClass);
  };

  /**
   * The handleOk function.
   */
  const handleOk = () => {
    if (!editor) return;

    editor.commands.updateDivBox({
      id: form.id.trim() ? form.id.trim() : null,
      lang: form.lang.trim() ? form.lang.trim() : null,
      style: form.styleAttr.trim() ? form.styleAttr.trim() : null,
      title: form.title.trim() ? form.title.trim() : null,
      dir: form.dir === "ltr" || form.dir === "rtl" ? form.dir : null,
      "data-style": form.styleName ?? null,
      class: form.extraClass.trim() ? form.extraClass.trim() : null,
    });

    onClose();
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
              data={STYLE_SELECT_DATA}
              value={form.styleName ?? ""}
              onChange={handleSelectStyleSet}
              clearable
            />
            <TextInput
              label="Tyyliluokat"
              description="Lisäluokat (välilyönnillä erotettu)"
              value={form.extraClass}
              onChange={handleText("extraClass")}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="advanced" pt="md">
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Tunniste"
                value={form.id}
                onChange={handleText("id")}
              />
              <TextInput
                label="Kielikoodi"
                value={form.lang}
                onChange={handleText("lang")}
              />
            </Group>

            <TextInput
              label="Tyyli (inline)"
              value={form.styleAttr}
              onChange={handleText("styleAttr")}
            />
            <TextInput
              label="Avustava otsikko"
              value={form.title}
              onChange={handleText("title")}
            />

            <Select
              label="Kielen suunta"
              data={DIR_OPTIONS}
              value={form.dir}
              onChange={handleDirChange}
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
