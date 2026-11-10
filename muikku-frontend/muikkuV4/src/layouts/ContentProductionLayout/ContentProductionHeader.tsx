import { Button, Group, Menu, Select } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import { workspacePermissionsAtom } from "src/atoms/permissions";
import { hasWorkspacePermission } from "src/services/access";
import { useContentProductionLayout } from "./ContentProductionLayoutContext";
import {
  CONTENT_PRODUCTION_KIND_LABEL,
  contentProductionHref,
  contentProductionReadHref,
  type ContentProductionKind,
} from "./kinds";

/**
 * Header left cluster after Back: return to the matching read view.
 */
export function ContentProductionHeaderStart() {
  const navigate = useNavigate();
  const { workspaceUrlName, "*": splat = "" } = useParams();
  const { kind } = useContentProductionLayout();

  return (
    <Button
      color="blue"
      w={{ base: "100%", sm: "auto" }}
      onClick={() => {
        if (!workspaceUrlName || !kind) return;
        void navigate(
          contentProductionReadHref(workspaceUrlName, kind, splat),
          { replace: true }
        );
      }}
    >
      Luku näkymä
    </Button>
  );
}

/**
 * Header right cluster: pikatoiminnot + kind select.
 */
export function ContentProductionHeaderEnd() {
  return (
    <Group wrap="nowrap" gap="sm" justify="flex-end" w="100%">
      <QuickActionsMenu />
      <KindSelect />
    </Group>
  );
}

/**
 * Workspace-level authoring actions. Handlers are stubs in this slice.
 */
function QuickActionsMenu() {
  return (
    <Menu position="bottom-end" shadow="md">
      <Menu.Target>
        <Button
          variant="light"
          rightSection={<IconChevronDown size={16} />}
          w={{ base: "100%", sm: "auto" }}
        >
          Pikatoiminnot
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item disabled>Luo sivuja ja osioita</Menu.Item>
        <Menu.Item disabled>Muokkaa tuottajia</Menu.Item>
        <Menu.Item disabled>Muokkaa numeroinnit</Menu.Item>
        <Menu.Item disabled>Lataa tiedostoja</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

/**
 * Switch content-production kind. Options follow manage permissions.
 */
function KindSelect() {
  const navigate = useNavigate();
  const { workspaceUrlName } = useParams();
  const { kind } = useContentProductionLayout();
  const permissions = useAtomValue(workspacePermissionsAtom);

  const data: { value: ContentProductionKind; label: string }[] = [];
  if (
    hasWorkspacePermission("WORKSPACE_MANAGE_WORKSPACE_MATERIALS", permissions)
  ) {
    data.push({
      value: "materials",
      label: CONTENT_PRODUCTION_KIND_LABEL.materials,
    });
    data.push({
      value: "exams",
      label: CONTENT_PRODUCTION_KIND_LABEL.exams,
    });
  }
  if (
    hasWorkspacePermission("WORKSPACE_MANAGE_WORKSPACE_FRONTPAGE", permissions)
  ) {
    data.push({
      value: "description",
      label: CONTENT_PRODUCTION_KIND_LABEL.description,
    });
  }
  if (hasWorkspacePermission("WORKSPACE_MANAGE_WORKSPACE_HELP", permissions)) {
    data.push({
      value: "help",
      label: CONTENT_PRODUCTION_KIND_LABEL.help,
    });
  }

  return (
    <Select
      aria-label="Muokattava sisältö"
      data={data}
      value={kind}
      allowDeselect={false}
      w={{ base: "100%", sm: 220 }}
      onChange={(value) => {
        if (!workspaceUrlName || !isKind(value)) return;
        void navigate(contentProductionHref(workspaceUrlName, value), {
          replace: true,
        });
      }}
    />
  );
}

/**
 * Narrow select value to a kind.
 * @param value - Select value
 */
function isKind(value: string | null): value is ContentProductionKind {
  return (
    value === "materials" ||
    value === "exams" ||
    value === "description" ||
    value === "help"
  );
}
