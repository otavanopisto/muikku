import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "../../button";
import Dropdown from "~/components/general/dropdown";
import {
  collectMaterialNoteIds,
  NotebookMaterialPageGroup,
} from "../helpers/notebook-layout";
import { useNotebookOpenItems } from "../hooks/useNotebookOpenItems";
import NotebookMaterialPageGroupView from "../groups/notebook-material-page-group";

/**
 * NotebookMaterialSectionProps
 */
interface NotebookMaterialSectionProps {
  groups: NotebookMaterialPageGroup[];
  storageKey: string;
}

/**
 * Material-scoped notes section with its own open/close controls.
 * @param props props
 */
const NotebookMaterialSection = (props: NotebookMaterialSectionProps) => {
  const { groups, storageKey } = props;
  const { t } = useTranslation("notebook");
  const { isOpen, toggle, openAll, closeAll } = useNotebookOpenItems(
    storageKey,
    collectMaterialNoteIds(groups)
  );

  if (!groups.length) {
    return null;
  }

  /**
   * handleOpenAllClick
   */
  const handleOpenAllClick = () => {
    openAll(collectMaterialNoteIds(groups));
  };

  /**
   * handleCloseAllClick
   */
  const handleCloseAllClick = () => {
    closeAll();
  };

  return (
    <section className="notebook__section notebook__section--material">
      <div className="notebook__section-header notebook__section-header--material">
        <h3 className="notebook__section-title">
          {t("labels.noteSectionTitle", {
            ns: "notebook",
            context: "page",
          })}
        </h3>
        <div className="notebook__section-actions">
          <Dropdown
            openByHover
            content={<p>{t("actions.openAll", { ns: "common" })}</p>}
          >
            <IconButton
              icon="arrow-down"
              aria-label={t("actions.openAll", { ns: "common" })}
              buttonModifiers={["notebook-action"]}
              onClick={handleOpenAllClick}
              disablePropagation={true}
            />
          </Dropdown>
          <Dropdown
            openByHover
            content={<p>{t("actions.closeAll", { ns: "common" })}</p>}
          >
            <IconButton
              icon="arrow-up"
              aria-label={t("actions.closeAll", { ns: "common" })}
              buttonModifiers={["notebook-action"]}
              onClick={handleCloseAllClick}
              disablePropagation={true}
            />
          </Dropdown>
        </div>
      </div>

      {groups.map((group) => (
        <NotebookMaterialPageGroupView
          key={group.page.workspaceMaterialId}
          group={group}
          isOpen={isOpen}
          onToggle={toggle}
        />
      ))}
    </section>
  );
};

export default NotebookMaterialSection;
