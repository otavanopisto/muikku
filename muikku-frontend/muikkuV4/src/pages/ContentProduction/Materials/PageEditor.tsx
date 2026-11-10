import { Group, Paper, Tabs, Title } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import type { MaterialContentNode } from "~/generated/client";
import {
  materialHtmlDraftsAtom,
  resolvedMaterialHtml,
  setMaterialHtmlDraftAtom,
} from "src/atoms/WorkspaceContentDrafts";
import {
  MATERIAL_AUTHOR,
  MuikkuEditor,
} from "src/components/tiptap-templates/muikku-editor";

/**
 * Props for the selected-page editor.
 */
interface PageEditorProps {
  page: MaterialContentNode;
  expanded: boolean;
}

/**
 * Content tab for one material page. Tiedot / Liitteet stay disabled until later.
 */
export function PageEditor(props: PageEditorProps) {
  const { page, expanded } = props;
  const drafts = useAtomValue(materialHtmlDraftsAtom);
  const setDraft = useSetAtom(setMaterialHtmlDraftAtom);
  const html = resolvedMaterialHtml(
    drafts,
    page.workspaceMaterialId,
    page.html
  );

  if (!expanded) {
    return (
      <Paper p="sm" radius="md" withBorder>
        <Group gap="sm" wrap="nowrap">
          {/* icon stubs later: edit, copy, restrict, type, delete */}
          <Title order={3} size="h4" lineClamp={1}>
            {page.title}
          </Title>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="md" radius="md" withBorder shadow="xs">
      <Tabs defaultValue="content">
        <Tabs.List>
          <Tabs.Tab value="content">Sisältö</Tabs.Tab>
          <Tabs.Tab value="info" disabled>
            Tiedot
          </Tabs.Tab>
          <Tabs.Tab value="attachments" disabled>
            Liitteet
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="content" pt="md">
          <MuikkuEditor
            key={page.workspaceMaterialId}
            className="muikku-editor--material-editor"
            content={html}
            features={MATERIAL_AUTHOR}
            minRows={16}
            editable
            onChange={(next) => {
              if (page.workspaceMaterialId == null) return;
              setDraft({
                workspaceMaterialId: page.workspaceMaterialId,
                html: next,
              });
            }}
          />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
