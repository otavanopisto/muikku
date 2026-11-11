import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { MaterialContentNode } from "~/generated/client";
import type { Workspace } from "src/RichContentLoader/coreMaterial/types";
import { PageEditor } from "./PageEditor";
import { PagePreview } from "./PagePreview";
import { SectionHeader } from "./SectionHeader";
import classes from "./MaterialsWorkspace.module.css";

/**
 * One grid: header row, then one row per page (editor | saved).
 * Row height follows the taller cell so both columns share one scroll.
 */
export function SectionGrid(props: {
  section: MaterialContentNode | null;
  pages: MaterialContentNode[];
  page: MaterialContentNode | null;
  workspace: Workspace;
}) {
  const { section, pages, page, workspace } = props;
  const sectionTitle = section?.title ?? "Materiaalit";

  return (
    <div className={classes.split}>
      <div className={classes.header}>
        <SectionHeader sectionTitle={sectionTitle} />
      </div>
      <div className={`${classes.header} ${classes.saved}`}>
        <SectionHeader sectionTitle={sectionTitle} />
      </div>

      {pages.map((item, index) => {
        const active = item.path === page?.path;
        return (
          <PageRow
            key={item.workspaceMaterialId ?? item.path}
            page={item}
            folder={section}
            workspace={workspace}
            active={active}
            showPlus={index < pages.length - 1}
          />
        );
      })}
    </div>
  );
}

/**
 * Editor cell + saved cell, then an optional + row (left only).
 */
function PageRow(props: {
  page: MaterialContentNode;
  folder: MaterialContentNode | null;
  workspace: Workspace;
  active: boolean;
  showPlus: boolean;
}) {
  const { page, folder, workspace, active, showPlus } = props;

  return (
    <>
      <div className={classes.cell}>
        <PageEditor page={page} folder={folder} workspace={workspace} />
      </div>
      <div className={`${classes.cell} ${classes.saved}`}>
        <PagePreview
          page={page}
          folder={folder}
          workspace={workspace}
          active={active}
        />
      </div>
      {showPlus && (
        <>
          <div className={`${classes.cell} ${classes.plusRow}`}>
            <ActionIcon
              variant="subtle"
              radius="xl"
              aria-label="Lisää sivu"
              disabled
            >
              <IconPlus size={16} />
            </ActionIcon>
          </div>
          <div className={`${classes.cell} ${classes.saved}`} />
        </>
      )}
    </>
  );
}
