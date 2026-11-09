import { Box, NavLink, Text } from "@mantine/core";
import { useOutletContext, useParams } from "react-router";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";
import { WorkspaceContentLayout } from "src/layouts";

/**
 * Placeholder help TOC.
 */
const HELP_TOC = [
  { label: "1 Johdanto", children: ["1.1 Näin käytät ohjeita"] },
  { label: "2 Arviointi", children: [] },
];

/**
 * WorkspaceHelp - Workspace help page
 */
export function WorkspaceHelp() {
  const { workspaceUrlName } = useParams();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const { onClose } = useOutletContext<{ onClose: () => void }>();

  return (
    <WorkspaceContentLayout
      title={`${workspaceInfo?.name ?? workspaceUrlName} – Ohjeet`}
      closeLabel="Poistu ohjeista"
      onClose={onClose}
      toc={HELP_TOC.map((section) => (
        <NavLink
          key={section.label}
          label={section.label}
          defaultOpened={section.children.length > 0}
          childrenOffset={16}
        >
          {section.children.map((child) => (
            <NavLink key={child} label={child} />
          ))}
        </NavLink>
      ))}
    >
      <Box p="md">
        <Text c="dimmed">Valitse sivu sisällysluettelosta.</Text>
      </Box>
    </WorkspaceContentLayout>
  );
}
