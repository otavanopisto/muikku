"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  Stack,
  Group,
  Select,
  Checkbox,
  TextInput,
  Textarea,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type {
  MuikkuSelectionFieldContent,
  MuikkuSelectionListType,
  MuikkuSelectionOption,
} from "./MuikkuSelectFieldExtension";
import { createRandomMuikkuFieldName } from "../helpers";

const OPEN_EVENT = "muikku:open-muikku-selectionfield-modal";

const TYPE_OPTIONS = [
  { value: "dropdown", label: "Alaspudotusvalikko" },
  { value: "list", label: "Lista" },
  { value: "radio-horizontal", label: "Radionapit (vaakasuora)" },
  { value: "radio-vertical", label: "Radionapit (pystysuora)" },
  { value: "checkbox-horizontal", label: "Valintaruudut (vaakasuora)" },
  { value: "checkbox-vertical", label: "Valintaruudut (pystysuora)" },
] satisfies { value: MuikkuSelectionListType; label: string }[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Gets the next free numeric name.
 * @param used - The used names.
 * @returns The next free numeric name.
 */
function nextFreeNumericName(used: Set<string>): string {
  let i = 1;
  while (used.has(String(i))) i++;
  return String(i);
}

/**
 * Normalizes the options.
 * @param v - The value to normalize.
 * @returns The normalized options.
 */
function normalizeOptions(v: unknown): MuikkuSelectionOption[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (!isRecord(x)) return { name: "", text: "", correct: false };
      const name = typeof x.name === "string" ? x.name : "";
      const text = typeof x.text === "string" ? x.text : "";
      const correct = typeof x.correct === "boolean" ? x.correct : false;
      return { name, text, correct };
    })
    .filter((o) => o.name);
}

/**
 * The Muikku selection field modal component.
 * @param props - The props for the Muikku selection field modal component.
 * @returns The Muikku selection field modal component.
 */
export function MuikkuSelectFieldModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;

  const isEditing = !!editor?.isActive("muikkuSelectionField");

  const [listType, setListType] = useState<MuikkuSelectionListType>("dropdown");
  const [options, setOptions] = useState<MuikkuSelectionOption[]>([]);
  const [explanation, setExplanation] = useState("");

  const canSave = useMemo(() => !!editor?.isEditable, [editor]);

  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("muikkuSelectionField")) {
      const attrs = editor.getAttributes("muikkuSelectionField") as {
        content?: MuikkuSelectionFieldContent;
      };
      const c = attrs.content ?? null;

      setListType(c?.listType ?? "dropdown");
      setOptions(normalizeOptions(c?.options));
      setExplanation(c?.explanation ?? "");
    } else {
      setListType("dropdown");
      setOptions([]);
      setExplanation("");
    }
  }, [opened, editor]);

  // Allow placeholder to open the modal via event
  useEffect(() => {
    const handler = () => {
      // noop here; button owns listener typically, but keeping consistent is fine
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  const addOption = () => {
    const used = new Set(options.map((o) => o.name));
    const name = nextFreeNumericName(used);
    setOptions((prev) => [...prev, { name, text: "", correct: false }]);
  };

  const updateOption = (
    name: string,
    patch: Partial<MuikkuSelectionOption>
  ) => {
    setOptions((prev) =>
      prev.map((o) => (o.name === name ? { ...o, ...patch } : o))
    );
  };

  const removeOption = (name: string) => {
    setOptions((prev) => prev.filter((o) => o.name !== name));
  };

  const moveOption = (idx: number, dir: -1 | 1) => {
    setOptions((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return next;
    });
  };

  const handleOk = () => {
    if (!editor || !canSave) return;

    const prev = (
      editor.getAttributes("muikkuSelectionField") as {
        content?: MuikkuSelectionFieldContent;
      }
    ).content;

    const content: MuikkuSelectionFieldContent = {
      name: prev?.name?.trim() ?? createRandomMuikkuFieldName(),
      listType,
      explanation,
      options: options.map((o) => ({
        name: o.name,
        text: o.text,
        correct: !!o.correct,
      })),
    };

    const ok = isEditing
      ? editor.commands.updateMuikkuSelectionField(content)
      : editor.commands.setMuikkuSelectionField(content);

    if (ok) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="VALINTAKENTÄN OMINAISUUDET"
      size="lg"
      centered
    >
      <Stack gap="sm">
        <Select
          label="Tyyppi"
          data={TYPE_OPTIONS}
          value={listType}
          onChange={(v) =>
            setListType((v as MuikkuSelectionListType) ?? "dropdown")
          }
        />

        <Group justify="space-between" align="center">
          <div style={{ fontWeight: 600 }}>Valinnat</div>
          <Button variant="light" onClick={addOption}>
            +
          </Button>
        </Group>

        {options.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Ei valintoja.</div>
        ) : (
          options.map((o, idx) => (
            <Group key={o.name} align="flex-end" grow wrap="nowrap">
              <TextInput
                value={o.text}
                onChange={(e) =>
                  updateOption(o.name, { text: e.currentTarget.value })
                }
                placeholder={`Vaihtoehto ${o.name}`}
              />

              <Checkbox
                checked={!!o.correct}
                onChange={(e) =>
                  updateOption(o.name, { correct: e.currentTarget.checked })
                }
                aria-label="Oikea vastaus"
              />

              <Group gap="xs" wrap="nowrap">
                <Button
                  variant="default"
                  onClick={() => moveOption(idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="default"
                  onClick={() => moveOption(idx, 1)}
                  disabled={idx === options.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="default"
                  onClick={() => removeOption(o.name)}
                  title="Poista valinta"
                >
                  🗑
                </Button>
              </Group>
            </Group>
          ))
        )}

        <Textarea
          label="Selitys"
          minRows={6}
          value={explanation}
          onChange={(e) => setExplanation(e.currentTarget.value)}
        />
      </Stack>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          PERUUTA
        </Button>
        <Button onClick={handleOk} disabled={!canSave}>
          OK
        </Button>
      </Group>
    </Modal>
  );
}

export default MuikkuSelectFieldModal;
