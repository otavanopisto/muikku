import { Button } from "@mantine/core";
import { ActionBar } from "src/components/ActionBar/ActionBar";
import type { ActionName, ResolvedAction } from "../actions";

/**
 * CommunicatorActionBarProps - Props for the CommunicatorActionBar component
 */
interface CommunicatorActionBarProps {
  actions: ResolvedAction[];
  onAction: (actionName: ActionName) => void;
}

/**
 * Renders resolved communicator actions into the ActionBar.
 * No logic here — just maps ResolvedAction[] to buttons.
 */
export function CommunicatorActionBar(props: CommunicatorActionBarProps) {
  const { actions, onAction } = props;

  return (
    <ActionBar>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant === "danger" ? "filled" : "default"}
          color={action.variant === "danger" ? "red" : undefined}
          disabled={action.state === "disabled"}
          onClick={() => onAction(action.id)}
        >
          {action.label}
        </Button>
      ))}
    </ActionBar>
  );
}
