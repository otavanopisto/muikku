import { Box, NavLink, Text, Textarea, Title } from "@mantine/core";
import { useOutletContext, useParams } from "react-router";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";
import { WorkspaceContentLayout } from "src/layouts";

/**
 * Placeholder TOC matching the current materials screenshot.
 */
const TOC_SECTIONS = [
  {
    label: "1 Tervetuloa opintojaksolle",
    children: [
      "1.1 Johdanto",
      "1.2 Opintojakson opettaja",
      "1.3 Opintojakson tavoitteet ja sisällöt",
      "1.4 Opintojakson kuvaus ja ohjeet",
      "1.5 Lisälenkkejä ja syventävää aineistoa",
      "1.6 Extra materiaalia ja tehtäviä",
      "1.7 Kirjoita oppimispäiväkirjaan",
    ],
  },
  { label: "2 Tervetuloa YO-kokeisiin", children: [] },
  { label: "3 Tervetuloa kertaukseen", children: [] },
  { label: "4 Kuinka opin olemaan huolestumatta", children: [] },
];

/**
 * WorkspaceMaterials - Temporary materials dialog content.
 */
export function WorkspaceMaterials() {
  const { workspaceUrlName } = useParams();
  const { onClose } = useOutletContext<{ onClose: () => void }>();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);

  return (
    <WorkspaceContentLayout
      title={`${workspaceInfo?.name ?? workspaceUrlName} – Materiaalit`}
      closeLabel="Poistu materiaaleista"
      onClose={onClose}
      toc={TOC_SECTIONS.map((section) => (
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
      aside={
        <>
          <Title order={5} mb="sm">
            Muistiinpanot
          </Title>
          <Textarea
            placeholder="Kirjoita muistiinpanoja..."
            minRows={8}
            autosize
          />
        </>
      }
    >
      <Box p="md">
        <Text c="dimmed">Valitse sivu sisällysluettelosta.</Text>
      </Box>
    </WorkspaceContentLayout>
  );
}
