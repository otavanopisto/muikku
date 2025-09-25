import {
  Badge,
  Button,
  Code,
  Container,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import { useLocation, useNavigate, useParams } from "react-router";
import { userAtom } from "~/src/atoms/auth";
import { workspacePermissionsAtom } from "~/src/atoms/permissions";
import { workspaceInfoAtom } from "~/src/atoms/workspace";

/**
 * NotFound page for 404 errors with workspace context detection
 * @returns React.ReactNode
 */
export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workspaceUrlName } = useParams();
  const user = useAtomValue(userAtom);
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const workspacePermissions = useAtomValue(workspacePermissionsAtom);
  const attemptedPath = location.pathname;

  // Check if this is a workspace-related 404
  const isWorkspaceContext = !!workspaceUrlName;
  const workspaceName = workspaceInfo?.name;

  // Determine appropriate messaging based on context
  const getContextualMessage = () => {
    if (isWorkspaceContext && workspaceName) {
      return {
        title: "Workspace Page Not Found",
        message: `The page you're looking for doesn't exist in the "${workspaceName}" workspace.`,
        suggestion:
          "Try navigating to a different workspace page or check the URL.",
      };
    } else if (isWorkspaceContext && !workspaceName) {
      return {
        title: "Invalid Workspace URL",
        message: "The workspace URL format is invalid.",
        suggestion:
          "Workspace URLs should be in the format: /workspace/workspace-name",
      };
    } else {
      return {
        title: "Page Not Found",
        message: "The page you're looking for doesn't exist!",
        suggestion: "Check the URL or navigate to a different page.",
      };
    }
  };

  const context = getContextualMessage();

  // Determine navigation options
  const getNavigationOptions = () => {
    if (isWorkspaceContext && workspaceName) {
      return [
        {
          label: "Go to Workspace Home",
          action: () => navigate(`/workspace/${workspaceInfo.urlName}`),
          canAccess: workspacePermissions?.WORKSPACE_HOME_VISIBLE ?? false,
        },
        {
          label: "Go to Main Dashboard",
          action: () => navigate("/dashboard"),
          canAccess: user?.loggedIn ?? false,
        },
        {
          label: "Go to Home",
          action: () => navigate("/"),
          canAccess: !(user?.loggedIn ?? false),
        },
      ];
    } else {
      return [
        {
          label: "Go to Dashboard",
          action: () => navigate("/dashboard"),
          canAccess: user?.loggedIn ?? false,
        },
        {
          label: "Go to Home",
          action: () => navigate("/"),
          canAccess: !(user?.loggedIn ?? false),
        },
      ];
    }
  };

  const navigationOptions = getNavigationOptions().filter(
    (option) => option.canAccess
  );

  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          {context.title}
        </Title>

        {isWorkspaceContext && (
          <Badge color="blue" variant="light" mb="md">
            Workspace Context
          </Badge>
        )}

        <Text mb="md">{context.message}</Text>

        <Text size="sm" c="dimmed" mb="md">
          <strong>Attempted path:</strong> <Code>{attemptedPath}</Code>
        </Text>

        {isWorkspaceContext && workspaceName && (
          <Text size="sm" c="dimmed" mb="md">
            <strong>Workspace:</strong> <Code>{workspaceName}</Code>
          </Text>
        )}

        <Text size="sm" c="dimmed" mb="xl">
          {context.suggestion}
        </Text>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {navigationOptions.map((option, index) => (
            <Button
              key={`${option.label}`}
              variant={index === 0 ? "filled" : "outline"}
              onClick={() => void option.action()}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Paper>
    </Container>
  );
}
