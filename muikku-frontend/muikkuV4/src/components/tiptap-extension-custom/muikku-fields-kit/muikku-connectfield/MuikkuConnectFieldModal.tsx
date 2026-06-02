"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Stack, Group, TextInput } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type {
  MuikkuConnectFieldContent,
  MuikkuConnectFieldPair,
} from "./MuikkuConnectFieldExtension";
import { uniqueId } from "lodash";

/**
 * The Muikku connect field modal component.
 * @param props - The props for the Muikku connect field modal component.
 * @returns The Muikku connect field modal component.
 */
export function MuikkuConnectFieldModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;

  const isEditing = !!editor?.isActive("muikkuConnectField");
  const [pairs, setPairs] = useState<MuikkuConnectFieldPair[]>([]);

  // Hydrate the state from the editor.
  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("muikkuConnectField")) {
      const attrs = editor.getAttributes("muikkuConnectField") as {
        content?: MuikkuConnectFieldContent;
      };
      const c = attrs.content ?? null;

      const lefts = Array.isArray(c?.fields) ? c.fields : [];
      const rights = Array.isArray(c?.counterparts) ? c.counterparts : [];

      // Because the extension always normalizes content to sequential connections,
      // we can reconstruct pairs by index safely.
      const nextPairs = lefts.map((l, i) => ({
        id: uniqueId("pair-"),
        left: l?.text ?? "",
        right: rights[i]?.text ?? "",
      }));

      setPairs(nextPairs);
    } else {
      setPairs([]);
    }
  }, [opened, editor]);

  /**
   * The addPair function.
   */
  const addPair = () =>
    setPairs((p) => [...p, { id: uniqueId("pair-"), left: "", right: "" }]);

  /**
   * The updatePair function.
   * @param idx - The index of the pair to update.
   * @param next - The next pair.
   */
  const updatePair = (idx: number, next: Partial<MuikkuConnectFieldPair>) => {
    setPairs((prev) => prev.map((p, i) => (i === idx ? { ...p, ...next } : p)));
  };

  /**
   * The removePair function.
   * @param idx - The index of the pair to remove.
   */
  const removePair = (idx: number) =>
    setPairs((prev) => prev.filter((_, i) => i !== idx));

  /**
   * The movePair function.
   * @param idx - The index of the pair to move.
   * @param dir - The direction to move the pair.
   */
  const movePair = (idx: number, dir: -1 | 1) => {
    setPairs((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return next;
    });
  };

  /**
   * The handleOk function.
   */
  const handleOk = () => {
    if (!editor?.isEditable) return;

    const ok = isEditing
      ? editor.commands.updateMuikkuConnectField(pairs)
      : editor.commands.setMuikkuConnectField(pairs);

    if (ok) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="YHDISTELYKENTÄN OMINAISUUDET"
      size="lg"
      centered
    >
      <Stack gap="sm">
        <Group justify="space-between">
          <div style={{ fontWeight: 600 }}>Vastinparit</div>
          <Button variant="light" onClick={addPair}>
            +
          </Button>
        </Group>

        {pairs.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Ei vastinpareja.</div>
        ) : (
          pairs.map((pair, idx) => (
            <Group key={pair.id} align="flex-end" grow wrap="nowrap">
              <TextInput
                value={pair.left}
                onChange={(e) =>
                  updatePair(idx, { left: e.currentTarget.value })
                }
                placeholder={`Vastin_${idx + 1}`}
              />
              <TextInput
                value={pair.right}
                onChange={(e) =>
                  updatePair(idx, { right: e.currentTarget.value })
                }
                placeholder={`pari_${idx + 1}`}
              />

              <Group gap="xs" wrap="nowrap">
                <Button
                  variant="default"
                  onClick={() => movePair(idx, -1)}
                  disabled={idx === 0}
                  title="Ylös"
                >
                  ↑
                </Button>
                <Button
                  variant="default"
                  onClick={() => movePair(idx, 1)}
                  disabled={idx === pairs.length - 1}
                  title="Alas"
                >
                  ↓
                </Button>
                <Button
                  variant="default"
                  onClick={() => removePair(idx)}
                  title="Poista"
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
        <Button onClick={handleOk}>OK</Button>
      </Group>
    </Modal>
  );
}
