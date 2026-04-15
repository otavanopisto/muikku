import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { MathfieldElement } from "mathlive";
import "mathlive";
import { Button, Group, Modal, Textarea } from "@mantine/core";

// Register the custom element
if (!customElements.get("math-field")) {
  customElements.define("math-field", MathfieldElement);
}

/**
 * unwrapDelimiters
 * @param s s
 * @returns { latex: string; mode: "inline" | "display" }
 */
function unwrapDelimiters(s: string): {
  latex: string;
  mode: "inline" | "display";
} {
  const t = s.trim();
  if (t.startsWith("\\(") && t.endsWith("\\)")) {
    return { latex: t.slice(2, -2).trim(), mode: "inline" };
  }
  if (t.startsWith("\\[") && t.endsWith("\\]")) {
    return { latex: t.slice(2, -2).trim(), mode: "display" };
  }
  if (t.startsWith("$$") && t.endsWith("$$")) {
    return { latex: t.slice(2, -2).trim(), mode: "display" };
  }
  return { latex: t, mode: "inline" };
}

/**
 * MathLiveComponent is a component that renders a math equation in a tiptap editor.
 * It uses the MathfieldElement from mathlive to render the equation.
 * It also handles the input and output of the equation.
 * @param node - The node that contains the latex code.
 * @param updateAttributes - The function to update the attributes of the node.
 * @param editor - The tiptap editor.
 * @returns A div with the math-field element.
 */
export const MathLiveComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const [open, setOpen] = useState(false);

  const formulaRef = useRef<HTMLElement & { render?: () => Promise<void> }>(
    null
  );

  /**
   * Open the properties dialog
   */
  const handleOpenPropertiesDialog = () => {
    setOpen(true);
  };

  /**
   * Close the properties dialog
   */
  const handleClosePropertiesDialog = () => {
    setOpen(false);
  };

  /**
   * Save the properties
   */
  const handleSave = (latex: string) => {
    updateAttributes({ latex });
    setOpen(false);
  };

  const unwrapped = unwrapDelimiters((node.attrs.latex as string).trim());

  useEffect(() => {
    const el = formulaRef.current;
    if (!el) return;
    if (el.textContent === unwrapped.latex) return;
    // Set the raw latex as text content (or keep children, but this is explicit)
    el.textContent = unwrapped.latex;
    // Ask MathLive to typeset again
    void el.render?.();
  }, [unwrapped.latex]);

  return (
    <NodeViewWrapper as="span" data-type="math-equation">
      <math-span ref={formulaRef} onClick={handleOpenPropertiesDialog} />

      <MathEquationDialog
        open={open}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        initialLatex={node.attrs.latex}
        onSave={handleSave}
        onClose={handleClosePropertiesDialog}
      />
    </NodeViewWrapper>
  );
};

/**
 * MathEquationDialogProps is the props for the MathEquationDialog component.
 */
interface MathEquationDialogProps {
  open: boolean;
  initialLatex: string;
  onSave: (latex: string) => void;
  onClose: () => void;
}

/**
 * MathEquationDialog is a dialog that allows the user to edit the latex code of a math equation.
 * @param open - Whether the dialog is open.
 * @param initialLatex - The initial latex code of the math equation.
 * @param onSave - The function to save the latex code.
 * @param onClose - The function to close the dialog.
 * @returns A dialog with a math-field element.
 */
const MathEquationDialog: React.FC<MathEquationDialogProps> = ({
  open,
  initialLatex,
  onSave,
  onClose,
}) => {
  //const mathFieldRef = useRef<MathfieldElement>(null);
  const [latex, setLatex] = useState(initialLatex);
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    onSave(latex);
  };

  /**
   * Handle the input change
   * @param evt - The event object.
   */
  const handleInputChange = (evt: React.FormEvent<MathfieldElement>) => {
    setLatex((evt.target as MathfieldElement).value);
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Math Equation Properties"
      centered
      size="lg"
    >
      {/* <Dialog.Title>Math Equation Properties</Dialog.Title> */}

      <Group mt="lg" justify="flex-start">
        <Button onClick={() => setEditMode((prev) => !prev)} variant="default">
          {editMode ? "Käytä latex-editoria" : "Muokkaa latex-koodia"}
        </Button>
      </Group>

      {editMode ? (
        <Textarea
          autosize
          value={latex}
          onChange={(evt) => setLatex(evt.target.value)}
          placeholder="Kirjoita latex-koodi tähän"
        />
      ) : (
        <math-field
          onInput={handleInputChange}
          virtual-keyboard-mode="manual"
          smart-mode="on"
          smart-fence="on"
          smart-superscript="on"
          smart-subscript="on"
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          {latex}
        </math-field>
      )}

      <Group mt="lg" justify="flex-end">
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="filled" color="green">
          Save
        </Button>
      </Group>
    </Modal>
  );
};
