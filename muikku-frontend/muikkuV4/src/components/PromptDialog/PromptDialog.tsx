import styles from "./PromptDialog.module.css";
import { useTranslation } from "react-i18next";
import { Modal, Text, Button, Group } from "@mantine/core";

/**
 * PromptDialogProps interface
 * @property title - The title of the dialog
 * @property description - The description of the dialog
 * @property onConfirm - The function to call when the user confirms the dialog
 * @property onCancel - The function to call when the user cancels the dialog
 * @property opened - Whether the dialog is opened
 * @property onClose - The function to call when the dialog is closed
 */
interface PromptDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  opened: boolean;
  onClose: () => void;
}

/**
 * PromptDialog component
 * @param props - PromptDialogProps
 * @returns PromptDialog component
 */
export default function PromptDialog(props: PromptDialogProps) {
  const { title, description, onConfirm, onCancel, opened, onClose } = props;
  const { t } = useTranslation("common");
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text>{description}</Text>
      <Group>
        <Button onClick={onCancel}>{t("actions.cancel")}</Button>
        <Button onClick={onConfirm}>{t("actions.confirm")}</Button>
      </Group>
    </Modal>
  );
}
