import { EmptyState } from "@mantine/core";

/**
 * EmptyProps - Empty props
 */
interface EmptyProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
/**
 * AnnouncementsEmpty - Announcements empty page
 */
export function Empty(props: EmptyProps) {
  const { title, description, actions } = props;
  return (
    <EmptyState mb="md" p="md">
      <EmptyState.Title>{title}</EmptyState.Title>
      <EmptyState.Description>{description}</EmptyState.Description>
      {actions && <EmptyState.Actions>{actions}</EmptyState.Actions>}
    </EmptyState>
  );
}
