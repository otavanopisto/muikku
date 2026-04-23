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

  const [rows, setRows] = useState("");
  const [maxWords, setMaxWords] = useState("");
  const [maxChars, setMaxChars] = useState("");
  const [example, setExample] = useState("");
  const [richedit, setRichedit] = useState(false);

  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("muikkuMemoField")) {
      const attrs = editor.getAttributes("muikkuMemoField") as {
        content?: MuikkuMemoFieldContent;
      };
      const c = attrs.content ?? null;

      setRows((c?.rows ?? "").toString());
      setMaxWords((c?.maxWords ?? "").toString());
      setMaxChars((c?.maxChars ?? "").toString());
      setExample(c?.example ?? "");
      setRichedit(!!c?.richedit);
    } else {
      setRows("");
      setMaxWords("");
      setMaxChars("");
      setExample("");
      setRichedit(false);
    }
  }, [opened, editor]);

  const handleOk = () => {
    if (!editor?.isEditable) return;

    const prev = (
      editor.getAttributes("muikkuMemoField") as {
        content?: MuikkuMemoFieldContent;
      }
    ).content;

    const content: MuikkuMemoFieldContent = {
      name: prev?.name?.trim() ?? createRandomMuikkuFieldName(),
      rows: rows.trim(),
      maxWords: maxWords.trim(),
      maxChars: maxChars.trim(),
      example,
      richedit: !!richedit,
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
          value={rows}
          onChange={(e) => setRows(e.currentTarget.value)}
        />

        <Group grow>
          <TextInput
            label="Sanaraja"
            value={maxWords}
            onChange={(e) => setMaxWords(e.currentTarget.value)}
          />
          <TextInput
            label="Merkkiraja"
            value={maxChars}
            onChange={(e) => setMaxChars(e.currentTarget.value)}
          />
        </Group>

        <Textarea
          label="Mallivastaus"
          minRows={8}
          value={example}
          onChange={(e) => setExample(e.currentTarget.value)}
        />

        <Checkbox
          checked={richedit}
          onChange={(e) => setRichedit(e.currentTarget.checked)}
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

export default MuikkuMemoFieldModal;
