import { Button } from "@mantine/core";
import { ActionBar } from "src/components/ActionBar/ActionBar";
import type { CommunicatorActionHandlers, ResolvedAction } from "../actions";

/**
 * CommunicatorActionBarProps - Props for the CommunicatorActionBar component
 */
interface CommunicatorActionBarProps {
  actions: ResolvedAction[];
  handlers: CommunicatorActionHandlers;
}

/**
 * Renders resolved communicator actions into the ActionBar.
 * No logic here — just maps ResolvedAction[] to buttons.
 */
export function CommunicatorActionBar(props: CommunicatorActionBarProps) {
  const { actions, handlers } = props;

  return (
    <ActionBar>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant === "danger" ? "filled" : "default"}
          color={action.variant === "danger" ? "red" : undefined}
          disabled={action.state === "disabled"}
          onClick={handlers[action.id]}
        >
          {action.label}
        </Button>
      ))}
    </ActionBar>
  );
}
