import { Button, Group, Modal, Text, type ModalProps } from "@mantine/core";

/**
 * Confirm dialog on top of Mantine Modal.
 * Pass any Modal prop (size, centered, overlayProps, …) plus button copy.
 */
export type ConfirmDialogProps = Omit<ModalProps, "onClose"> & {
  cancelLabel: string;
  confirmLabel: string;
  confirmColor?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Reusable confirm dialog. Callers set title, body, button labels, and Modal options.
 */
export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    children,
    cancelLabel,
    confirmLabel,
    confirmColor = "red",
    onCancel,
    onConfirm,
    centered = true,
    ...modalProps
  } = props;

  return (
    <Modal {...modalProps} centered={centered} onClose={onCancel}>
      {typeof children === "string" ? (
        <Text size="sm" mb="md">
          {children}
        </Text>
      ) : (
        children
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button color={confirmColor} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
