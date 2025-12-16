import { Group } from "@mantine/core";

/**
 * ActionBarProps - Action bar props
 */
interface ActionBarProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * ActionBar - Action bar component
 * @param props - Action bar props
 * @returns Action bar component
 */
export function ActionBar(props: ActionBarProps) {
  const { children, variant = "primary", className } = props;
  return (
    <Group mb="md" className={className}>
      {children}
    </Group>
  );
}
