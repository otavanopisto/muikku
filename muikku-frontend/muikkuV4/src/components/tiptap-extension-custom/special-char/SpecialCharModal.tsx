"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Group, Modal, Stack, Text, UnstyledButton } from "@mantine/core";
import type { Editor } from "@tiptap/react";

import {
  SPECIAL_CHARACTERS,
  SPECIAL_CHARACTERS_COLUMNS,
  type SpecialCharacter,
} from "./specialCharSet";

/**
 * Hoisted so every memoized cell shares the same style reference.
 * Mutating this object would defeat memoization, so keep it `as const`.
 */
const CELL_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 28,
  border: "1px solid transparent",
  borderRadius: 2,
  fontSize: 14,
  lineHeight: 1,
  cursor: "pointer",
};

/**
 * Props for an individual cell in the special character grid.
 */
interface SpecialCharCellProps {
  character: SpecialCharacter;
  index: number;
  registerRef: (index: number, el: HTMLButtonElement | null) => void;
  onInsert: (char: string) => void;
  onHover: (c: SpecialCharacter) => void;
  onKeyNavigate: (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => void;
}

/**
 * A single cell in the special character grid. Memoized so that hover state
 * changes in the parent do not re-render the entire grid.
 */
const SpecialCharCell = memo((props: SpecialCharCellProps) => {
  const { character, index, registerRef, onInsert, onHover, onKeyNavigate } =
    props;

  return (
    <UnstyledButton
      ref={(el) => registerRef(index, el)}
      role="gridcell"
      aria-label={character.label}
      title={character.label}
      onMouseEnter={() => onHover(character)}
      onFocus={() => onHover(character)}
      onMouseDown={(e) => {
        // Keep editor selection when clicking.
        e.preventDefault();
        onInsert(character.char);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onInsert(character.char);
          return;
        }
        onKeyNavigate(e, index);
      }}
      style={CELL_STYLE}
    >
      {character.char}
    </UnstyledButton>
  );
});

/**
 * Props for the SpecialCharModal component.
 */
export interface SpecialCharModalProps {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
  /**
   * Optional override for the character set rendered in the grid.
   * Defaults to the CKEditor 4 parity list from `specialCharSet`.
   */
  characters?: SpecialCharacter[];
  /**
   * Optional override for the number of grid columns.
   * @default 17
   */
  columns?: number;
}

/**
 * SpecialCharModal renders a grid of special characters and inserts the
 * selected character into the editor.
 */
export function SpecialCharModal(props: SpecialCharModalProps) {
  const {
    editor,
    opened,
    onClose,
    characters = SPECIAL_CHARACTERS,
    columns = SPECIAL_CHARACTERS_COLUMNS,
  } = props;

  const [hovered, setHovered] = useState<SpecialCharacter | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset preview state when the modal opens.
  useEffect(() => {
    if (opened) {
      setHovered(characters[0] ?? null);
    }
  }, [opened, characters]);

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 2,
    }),
    [columns]
  );

  /**
   * Register a cell ref. Stable identity so memoized cells don't re-render.
   * @param index - The index of the cell.
   * @param el - The element to register.
   */
  const registerRef = useCallback(
    (index: number, el: HTMLButtonElement | null) => {
      cellRefs.current[index] = el;
    },
    []
  );

  /**
   * Update the preview pane to the hovered/focused character.
   * @param c - The character to hover.
   */
  const handleHover = useCallback((c: SpecialCharacter) => {
    setHovered(c);
  }, []);

  /**
   * Insert the given character into the editor and close the modal.
   */
  const handleInsert = useCallback(
    (char: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(char).run();
      onClose();
    },
    [editor, onClose]
  );

  /**
   * Move focus within the grid in response to arrow / Home / End keys.
   * The newly focused cell will update `hovered` via its own `onFocus`.
   */
  const handleKeyNavigate = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = Math.min(index + 1, characters.length - 1);
          break;
        case "ArrowLeft":
          nextIndex = Math.max(index - 1, 0);
          break;
        case "ArrowDown":
          nextIndex = Math.min(index + columns, characters.length - 1);
          break;
        case "ArrowUp":
          nextIndex = Math.max(index - columns, 0);
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = characters.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null && nextIndex !== index) {
        e.preventDefault();
        cellRefs.current[nextIndex]?.focus();
      }
    },
    [characters, columns]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="VALITSE ERIKOISMERKKI"
      size="lg"
      centered
      trapFocus
      returnFocus
    >
      <Group align="flex-start" wrap="nowrap" gap="md">
        <Box style={{ flex: 1 }}>
          <div role="grid" aria-label="Special characters" style={gridStyle}>
            {characters.map((c, i) => (
              <SpecialCharCell
                key={c.char}
                character={c}
                index={i}
                registerRef={registerRef}
                onInsert={handleInsert}
                onHover={handleHover}
                onKeyNavigate={handleKeyNavigate}
              />
            ))}
          </div>
        </Box>

        <Stack gap={6} align="center" style={{ width: 96, flexShrink: 0 }}>
          <Box
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              border: "1px solid var(--mantine-color-gray-4)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              lineHeight: 1,
              background: "var(--mantine-color-white)",
            }}
          >
            {hovered?.char ?? ""}
          </Box>
          <Box
            style={{
              width: 64,
              minHeight: 32,
              border: "1px solid var(--mantine-color-gray-4)",
              borderRadius: 4,
              padding: "4px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              background: "var(--mantine-color-white)",
            }}
          >
            {hovered?.char ?? ""}
          </Box>
          <Text
            size="xs"
            c="dimmed"
            ta="center"
            style={{ width: "100%", wordBreak: "break-word" }}
          >
            {hovered?.label ?? ""}
          </Text>
        </Stack>
      </Group>
    </Modal>
  );
}

export default SpecialCharModal;
