"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Stack,
  TextInput,
  Textarea,
  Group,
  Checkbox,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type { MuikkuMemoFieldContent } from "./MuikkuMemoFieldExtension";
import { createRandomMuikkuFieldName } from "../helpers";

type MemoFormState = {
  rows: string;
  maxWords: string;
  maxChars: string;
  example: string;
  richedit: boolean;
};

// The default form state.
const DEFAULT_FORM: MemoFormState = {
  rows: "",
  maxWords: "",
  maxChars: "",
  example: "",
  richedit: false,
};

/**
 * The Muikku memo field modal component.
 * @param props - The props for the Muikku memo field modal component.
 * @returns The Muikku memo field modal component.
 */
export function MuikkuMemoFieldModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;
  const isEditing = !!editor?.isActive("muikkuMemoField");

  const [form, setForm] = useState<MemoFormState>(DEFAULT_FORM);

  /**
   * The setField function.
   * @param key - The key of the field to set.
   * @param value - The value of the field to set.
   */
  const setField = <K extends keyof MemoFormState>(
    key: K,
    value: MemoFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /**
   * The handleText function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleText =
    (
      key: keyof Pick<
        MemoFormState,
        "rows" | "maxWords" | "maxChars" | "example"
      >
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setField(key, e.currentTarget.value);
    };

  /**
   * The handleCheck function.
   * @param key - The key of the field to set.
   * @param e - The change event.
   */
  const handleCheck =
    (key: keyof Pick<MemoFormState, "richedit">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(key, e.currentTarget.checked);
    };

  // Hydrates the form from the attributes of the memo field.
  useEffect(() => {
    if (!opened || !editor) return;
    if (editor.isActive("muikkuMemoField")) {
      const attrs = editor.getAttributes("muikkuMemoField") as {
        content?: MuikkuMemoFieldContent;
      };
      const c = attrs.content ?? null;
      setForm({
        rows: (c?.rows ?? "").toString(),
        maxWords: (c?.maxWords ?? "").toString(),
        maxChars: (c?.maxChars ?? "").toString(),
        example: c?.example ?? "",
        richedit: !!c?.richedit,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [opened, editor]);

  /**
   * The handleOk function.
   */
  const handleOk = () => {
    if (!editor?.isEditable) return;

    const prev = (
      editor.getAttributes("muikkuMemoField") as {
        content?: MuikkuMemoFieldContent;
      }
    ).content;

    const content: MuikkuMemoFieldContent = {
      name: prev?.name?.trim() ?? createRandomMuikkuFieldName(),
      rows: form.rows.trim(),
      maxWords: form.maxWords.trim(),
      maxChars: form.maxChars.trim(),
      example: form.example,
      richedit: !!form.richedit,
    };

    const ok = isEditing
      ? editor.commands.updateMuikkuMemoField(content)
      : editor.commands.setMuikkuMemoField(content);

    if (ok) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="MUISTIOKENTÄN ASETUKSET"
      size="lg"
      centered
    >
      <Stack gap="sm">
        <TextInput
          label="Rivejä"
          value={form.rows}
          onChange={handleText("rows")}
        />

        <Group grow>
          <TextInput
            label="Sanaraja"
            value={form.maxWords}
            onChange={handleText("maxWords")}
          />
          <TextInput
            label="Merkkiraja"
            value={form.maxChars}
            onChange={handleText("maxChars")}
          />
        </Group>

        <Textarea
          label="Mallivastaus"
          minRows={8}
          value={form.example}
          onChange={handleText("example")}
        />

        <Checkbox
          checked={form.richedit}
          onChange={handleCheck("richedit")}
          label="Käytä tekstieditoria"
        />
      </Stack>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          PERUUTA
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </Group>
    </Modal>
  );
}
