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
  const {
    currentTag,
    handleDelete,
    handleUpdate,
    handleRemoveAllCollaborators,
  } = useGuiderLabel(label);

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
          tag: currentTag,
          onDelete: handleDelete,
          onUpdate: handleUpdate,
          deleteDialogTitle: t("labels.remove", {
            ns: "flags",
          }),
          deleteDialogContent: t("content.removing", {
            ns: "flags",
          }),
          customAction: {
            title: t("labels.removeCollaborators", {
              ns: "flags",
              collaboratorCount: currentTag.collaborators.length,
            }),
            icon: "users",
            label: t("labels.removeAllCollaborators", {
              ns: "messaging",
            }),
            content: t("content.removingCollaborators", {
              ns: "flags",
            }),
            onCustomAction: handleRemoveAllCollaborators,
          },

          updateDialogTitle: t("labels.edit", {
            ns: "flags",
          }),
          editLabel: t("labels.edit"),
          deleteLabel: t("labels.remove"),
          disableDelete:
            currentTag.collaborators.length > 0 ||
            label.ownerIdentifier !== status.userSchoolDataIdentifier,
          disableCustomAction:
            currentTag.collaborators.length === 0 ||
            label.ownerIdentifier !== status.userSchoolDataIdentifier,
        } satisfies DropdownWrapperProps
      }
      isEditable
    >
      {label.name}
    </NavigationElement>
  );
};

export default GuiderLabel;
