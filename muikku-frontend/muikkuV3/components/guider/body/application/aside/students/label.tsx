import * as React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";

import {
  NavigationElement,
  NavigationDropdown,
  DropdownWrapperProps,
} from "~/components/general/navigation";

import { UserFlag } from "~/generated/client";
import { useGuiderLabel } from "./hooks/useGuiderLabel";
import { useTranslation } from "react-i18next";
/**
 * Props for GuiderLabel
 */
interface GuiderLabelProps {
  label: UserFlag;
  isActive?: boolean;
  hash?: string;
}

/**
 * GuiderLabel
 * @param props component props
 * @returns JSX.Element
 */
const GuiderLabel: React.FC<GuiderLabelProps> = (props: GuiderLabelProps) => {
  const { label, isActive, hash } = props;
  const { status } = useSelector((state: StateType) => state);
  const { t } = useTranslation(["flags"]);
  const { tag, handleDelete, handleUpdate, handleRemoveCollaborators } =
    useGuiderLabel(label);

  return (
    <NavigationElement
      modifiers="aside-navigation-guider-flag"
      icon="flag"
      key={label.id}
      iconColor={label.color}
      isActive={isActive}
      hash={"?" + hash}
      editableIcon="more_vert"
      editableWrapper={NavigationDropdown}
      editableWrapperArgs={
        {
          tag,
          onDelete: handleDelete,
          onUpdate: handleUpdate,
          deleteDialogTitle: t("labels.remove", {
            ns: "flags",
          }),
          deleteDialogContent: t("content.removing", {
            ns: "flags",
          }),
          customActionDialogTitle: t("labels.removeCollaborators", {
            ns: "flags",
            collaboratorCount: tag.collaborators.all.length,
          }),
          customActionDialogContent: t("content.removingCollaborators", {
            ns: "flags",
          }),
          updateDialogTitle: t("labels.edit", {
            ns: "flags",
          }),
          editLabel: t("labels.edit"),
          deleteLabel: t("labels.remove"),
          customActionLabel: t("labels.removeAllCollaborators", {
            ns: "messaging",
          }),
          customActionIcon: "users",
          disableDelete:
            tag.collaborators.all.length > 0 ||
            label.ownerIdentifier !== status.userSchoolDataIdentifier,
          disableCustomAction:
            tag.collaborators.all.length === 0 ||
            label.ownerIdentifier !== status.userSchoolDataIdentifier,
          onCustomAction: handleRemoveCollaborators,
        } satisfies DropdownWrapperProps
      }
      isEditable
    >
      {label.name}
    </NavigationElement>
  );
};

export default GuiderLabel;
