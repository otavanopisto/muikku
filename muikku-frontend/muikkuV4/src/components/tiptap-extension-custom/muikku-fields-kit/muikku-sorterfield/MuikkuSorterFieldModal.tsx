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
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type {
  MuikkuSorterFieldContent,
  MuikkuSorterFieldItem,
  MuikkuSorterFieldOrientation,
} from "./MuikkuSorterFieldExtension";
import { createRandomMuikkuFieldName } from "../helpers";

const ORIENTATION_OPTIONS = [
  { value: "vertical", label: "Pysty" },
  { value: "horizontal", label: "Vaaka" },
] satisfies { value: MuikkuSorterFieldOrientation; label: string }[];

/**
 * Generates a random item ID.
 * @returns The random item ID.
 */
function randomItemId(): string {
  // CKEditor used Math.random().toString(36).substr(2, 5)
  return Math.random().toString(36).slice(2, 7);
}

/**
 * The Muikku sorter field modal component.
 * @param props - The props for the Muikku sorter field modal component.
 * @returns The Muikku sorter field modal component.
 */
export function MuikkuSorterFieldModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;
  const isEditing = !!editor?.isActive("muikkuSorterField");

  const [orientation, setOrientation] =
    useState<MuikkuSorterFieldOrientation>("vertical");
  const [capitalize, setCapitalize] = useState(false);
  const [items, setItems] = useState<MuikkuSorterFieldItem[]>([]);

  const canSave = useMemo(() => !!editor?.isEditable, [editor]);

  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("muikkuSorterField")) {
      const attrs = editor.getAttributes("muikkuSorterField") as {
        content?: MuikkuSorterFieldContent;
      };
      const c = attrs.content ?? null;

      setOrientation(
        c?.orientation === "horizontal" ? "horizontal" : "vertical"
      );
      setCapitalize(!!c?.capitalize);

      const nextItems = Array.isArray(c?.items)
        ? c.items.map((it) => ({
            id: it.id,
            name: it.name ?? "",
          }))
        : [];

      setItems(nextItems);
    } else {
      setOrientation("vertical");
      setCapitalize(false);
      setItems([]);
    }
  }, [opened, editor]);

  const addItem = () => {
    let id = randomItemId();
    const used = new Set(items.map((i) => i.id));
    while (!id || used.has(id)) id = randomItemId();

    setItems((prev) => [...prev, { id, name: "" }]);
  };

  const updateItem = (id: string, name: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, name } : it)));
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const moveItem = (idx: number, dir: -1 | 1) => {
    setItems((prev) => {
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
      editor.getAttributes("muikkuSorterField") as {
        content?: MuikkuSorterFieldContent;
      }
    ).content;

    const content: MuikkuSorterFieldContent = {
      name: prev?.name?.trim() ?? createRandomMuikkuFieldName(),
      orientation,
      capitalize,
      items: items.map((it) => ({ id: it.id, name: it.name })),
    };

    const ok = isEditing
      ? editor.commands.updateMuikkuSorterField(content)
      : editor.commands.setMuikkuSorterField(content);

    if (ok) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="JÄRJESTELYKENTÄN OMINAISUUDET"
      size="lg"
      centered
    >
      <Stack gap="sm">
        <Select
          label="Suunta"
          data={ORIENTATION_OPTIONS}
          value={orientation}
          onChange={(v) =>
            setOrientation((v as MuikkuSorterFieldOrientation) ?? "vertical")
          }
        />

        <Checkbox
          checked={capitalize}
          onChange={(e) => setCapitalize(e.currentTarget.checked)}
          label="Ensimmäinen termi isolla alkukirjaimella"
        />

        <Group justify="space-between">
          <div style={{ fontWeight: 600 }}>Termit</div>
          <Button variant="light" onClick={addItem}>
            +
          </Button>
        </Group>

        {items.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Ei termejä.</div>
        ) : (
          items.map((it, idx) => (
            <Group key={it.id} align="flex-end" grow wrap="nowrap">
              <TextInput
                value={it.name}
                onChange={(e) => updateItem(it.id, e.currentTarget.value)}
                placeholder={`JÄ${idx + 1}`}
              />

              <Group gap="xs" wrap="nowrap">
                <Button
                  variant="default"
                  onClick={() => moveItem(idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="default"
                  onClick={() => moveItem(idx, 1)}
                  disabled={idx === items.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="default"
                  onClick={() => removeItem(it.id)}
                  title="Poista termi"
                >
                  🗑
                </Button>
              </Group>
            </Group>
          ))
        )}
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

export default MuikkuSorterFieldModal;
