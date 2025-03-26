import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Dropdown from "~/components/general/dropdown";
import { ButtonPill } from "~/components/general/button";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

/**
 * EditorButtonSetProps
 */
interface EditorButtonSetProps extends MaterialLoaderProps {
  invisible?: boolean;
}

/**
 * toggleVisiblePageStatus
 * @param props props
 */
function toggleVisiblePageStatus(props: EditorButtonSetProps) {
  props.updateWorkspaceMaterialContentNode({
    workspace: props.workspace,
    material: props.material,
    update: {
      ...props.material,
      hidden: !props.material.hidden,
    },
    isDraft: false,
    updateLinked: true,
  });
}

/**
 * startupEditor
 * @param props props
 */
function startupEditor(props: EditorButtonSetProps) {
  if (
    typeof props.canAddAttachments === "undefined" ||
    props.canAddAttachments
  ) {
    props.requestWorkspaceMaterialContentNodeAttachments(
      props.workspace,
      props.material
    );
  }
  props.setWorkspaceMaterialEditorState(
    {
      currentNodeWorkspace: props.workspace,
      currentNodeValue: props.material,
      parentNodeValue: props.folder,
      section: false,
      opened: true,
      canDelete:
        typeof props.canDelete === "undefined" ? false : props.canDelete,
      canHide: typeof props.canHide === "undefined" ? false : props.canHide,
      disablePlugins: !!props.disablePlugins,
      canPublish:
        typeof props.canPublish === "undefined" ? false : props.canPublish,
      canRevert:
        typeof props.canRevert === "undefined" ? false : props.canRevert,
      canRestrictView:
        typeof props.canRestrictView === "undefined"
          ? false
          : props.canRestrictView,
      canCopy: typeof props.canCopy === "undefined" ? false : props.canCopy,
      canChangePageType:
        typeof props.canChangePageType === "undefined"
          ? false
          : props.canChangePageType,
      canChangeExerciseType:
        typeof props.canChangeExerciseType === "undefined"
          ? false
          : props.canChangeExerciseType,
      canSetLicense:
        typeof props.canSetLicense === "undefined"
          ? false
          : props.canSetLicense,
      canSetProducers:
        typeof props.canSetProducers === "undefined"
          ? false
          : props.canSetProducers,
      canAddAttachments:
        typeof props.canAddAttachments === "undefined"
          ? false
          : props.canAddAttachments,
      canEditContent:
        typeof props.canEditContent === "undefined"
          ? true
          : props.canEditContent,
      canSetTitle:
        typeof props.canSetTitle === "undefined" ? true : props.canSetTitle,
      showRemoveAnswersDialogForPublish: false,
      showRemoveAnswersDialogForDelete: false,
      showUpdateLinkedMaterialsDialogForPublish: false,
      showRemoveLinkedAnswersDialogForPublish: false,
      showUpdateLinkedMaterialsDialogForPublishCount: 0,
    },
    true
  );
}

/**
 * copyPage
 * @param props props
 */
function copyPage(props: EditorButtonSetProps) {
  localStorage.setItem(
    "workspace-material-copied-id",
    props.material.workspaceMaterialId.toString(10)
  );
  localStorage.setItem("workspace-copied-id", props.workspace.id.toString(10));

  props.displayNotification(
    i18next.t("notifications.documentCopied", {
      ns: "materials",
      title: props.material.title,
    }),
    "success"
  );
}

/**
 * MaterialLoaderEditorButtonSet
 * @param props props
 */
export function MaterialLoaderEditorButtonSet(props: EditorButtonSetProps) {
  const { t } = useTranslation(["materials", "common"]);

  if (!props.editable) {
    return null;
  }

  const viewForAdminPanel = props.isInFrontPage
    ? "workspace-description"
    : "workspace-materials";

  if (props.invisible) {
    return (
      <div
        className={`material-admin-panel material-admin-panel--page-functions material-admin-panel--${viewForAdminPanel} rs_skip_always`}
      ></div>
    );
  }

  return (
    <div
      className={`material-admin-panel material-admin-panel--page-functions material-admin-panel--${viewForAdminPanel} rs_skip_always`}
    >
      <Dropdown
        openByHover
        modifier="material-management-tooltip"
        content={t("actions.edit")}
      >
        <ButtonPill
          buttonModifiers="material-management-page"
          icon="pencil"
          onClick={startupEditor.bind(this, props)}
        />
      </Dropdown>
      {props.canCopy ? (
        <Dropdown
          openByHover
          modifier="material-management-tooltip"
          content={t("labels.copy", { ns: "materials" })}
        >
          <ButtonPill
            buttonModifiers="material-management-page"
            icon="copy"
            onClick={copyPage.bind(this, props)}
          />
        </Dropdown>
      ) : null}
      {props.canHide && (!props.folder || !props.folder.hidden) ? (
        <Dropdown
          openByHover
          modifier="material-management-tooltip"
          content={
            props.material.hidden
              ? t("labels.setVisible", { ns: "materials" })
              : t("labels.hide", { ns: "materials" })
          }
        >
          <ButtonPill
            buttonModifiers="material-management-page"
            icon="eye"
            onClick={toggleVisiblePageStatus.bind(this, props)}
          />
        </Dropdown>
      ) : null}
    </div>
  );
}
