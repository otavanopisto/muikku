import { ActionIcon, Group, Stack, Title, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

/** Props for the CoursepickerSection component */
interface CoursepickerSectionProps {
  title: string;
  info?: string;
  children: React.ReactNode;
}

/**
 * CoursepickerSection component
 * @param props - Props for the CoursepickerSection component
 */
export function CoursepickerSection(props: CoursepickerSectionProps) {
  const { title, info, children } = props;

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Title order={4}>{title}</Title>
        {info ? (
          <Tooltip label={info} multiline w={280}>
            <ActionIcon variant="subtle" size="sm" aria-label="Lisätietoa">
              <IconInfoCircle size={16} />
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>
      {children}
    </Stack>
  );
}
