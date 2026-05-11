"use client";

import { useCallback, useEffect, useState } from "react";
import { Group, Modal, Stack, Text } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { Input } from "@/components/tiptap-ui-primitive/input";
import { Button } from "@/components/tiptap-ui-primitive/button";

/**
 * The Muikku anchor modal props interface.
 */
export interface MuikkuAnchorModalProps {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}

/**
 * Normalize the value of the name.
 * @param v - The value to normalize.
 * @returns The normalized value.
 */
function normalize(v: string) {
  return v.trim();
}

/**
 * The Muikku anchor modal component.
 * @param props - The props for the Muikku anchor modal.
 * @returns The Muikku anchor modal component.
 */
export function MuikkuAnchorModal(props: MuikkuAnchorModalProps) {
  const { editor, opened, onClose } = props;

  const [name, setName] = useState("");

  const isAnchorActive =
    !!editor?.isActive("anchor") || !!editor?.isActive("anchorPlaceholder");

  /**
   * Hydrates the anchor modal from the selection.
   */
  const hydrateFromSelection = useCallback(() => {
    if (!editor) return;

    // Mark case
    if (editor.isActive("anchor")) {
      const attrs = editor.getAttributes("anchor") as {
        id?: string;
        name?: string;
      };
      setName(String(attrs.name ?? attrs.id ?? ""));
      return;
    }

    // Placeholder node case
    if (editor.isActive("anchorPlaceholder")) {
      const attrs = editor.getAttributes("anchorPlaceholder") as {
        id?: string;
        name?: string;
      };
      setName(String(attrs.name ?? attrs.id ?? ""));
      return;
    }

    // New anchor
    setName("");
  }, [editor]);

  // Hydrates the anchor modal from the selection when the modal is opened
  useEffect(() => {
    if (!opened) return;
    hydrateFromSelection();
  }, [opened, hydrateFromSelection]);

  // Checks if the anchor modal can be applied
  const canApply = !!editor?.isEditable && !!normalize(name);

  /**
   * Applies the anchor modal.
   */
  const apply = useCallback(() => {
    if (!editor) return;

    const v = normalize(name);
    if (!v) return;

    const attrs = { id: v, name: v };

    // If editing existing anchor placeholder node:
    if (editor.isActive("anchorPlaceholder")) {
      // update attrs on the selected node
      editor.chain().focus().updateAttributes("anchorPlaceholder", attrs).run();
      onClose();
      return;
    }

    // If selection is empty => insert placeholder node (empty anchor)
    if (editor.state.selection.empty) {
      editor.commands.insertMuikkuAnchorPlaceholder(attrs);
      onClose();
      return;
    }

    // Otherwise wrap selection with anchor mark
    editor.commands.setMuikkuAnchor(attrs);
    onClose();
  }, [editor, name, onClose]);

  /**
   * Removes the anchor.
   */
  const remove = useCallback(() => {
    if (!editor) return;
    editor.commands.unsetMuikkuAnchor();
    onClose();
  }, [editor, onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="ANKKURIN OMINAISUUDET"
      centered
      trapFocus
      returnFocus
    >
      <Stack gap="md">
        <div>
          <Text size="sm" fw={600}>
            Nimi
          </Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
          />
        </div>

        <Group justify="space-between">
          <Group>
            <Button
              type="button"
              variant="primary"
              onClick={apply}
              disabled={!canApply}
              showTooltip={false}
            >
              OK
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              showTooltip={false}
            >
              PERUUTA
            </Button>
          </Group>

          <Button
            type="button"
            variant="ghost"
            onClick={remove}
            disabled={!isAnchorActive}
            tooltip="Remove anchor"
          >
            Remove
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
