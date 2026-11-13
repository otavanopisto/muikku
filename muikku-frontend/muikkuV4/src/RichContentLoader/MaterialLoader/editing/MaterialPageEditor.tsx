import { Tabs } from "@mantine/core";
import classes from "../../coreMaterial/MaterialPage.module.css";
import { PageAttachmentsTab } from "./AttachmentsTab";
import { PageContentTab } from "./ContentTab";
import { PageMetadataTab } from "./MetadataTab";
import { useMaterialContentContext } from "../../coreMaterial/MaterialContentProvider";

/**
 * In-place authoring body: Sisältö / Tiedot / Liitteet.
 * Only mounted when editing.active.
 */
export function MaterialPageEditor() {
  const { material, workspace, editing } = useMaterialContentContext();

  if (!editing?.active) {
    return null;
  }

  return (
    <Tabs defaultValue="content" color="teal">
      <Tabs.List grow className={classes.tabsList}>
        <Tabs.Tab value="content" className={classes.tab}>
          Sisältö
        </Tabs.Tab>
        <Tabs.Tab value="info" className={classes.tab}>
          Tiedot
        </Tabs.Tab>
        <Tabs.Tab value="attachments" className={classes.tab}>
          Liitteet
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="content">
        <PageContentTab
          page={material}
          savedHtml={editing.savedHtml ?? material.html ?? ""}
          onEditorReady={(editor) => editing.onEditorReady?.(editor)}
          onTitleChange={(title) => editing.onTitleChange?.(title)}
          onHtmlChange={(html) => editing.onHtmlChange?.(html)}
        />
      </Tabs.Panel>
      <Tabs.Panel value="info">
        <div className={classes.panel}>
          <PageMetadataTab
            page={material}
            onPatch={(patch) => editing.onPatch?.(patch)}
          />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="attachments">
        <div className={classes.panel}>
          <PageAttachmentsTab
            workspaceMaterialId={material.workspaceMaterialId}
            workspaceUrlName={workspace.urlName}
          />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}
