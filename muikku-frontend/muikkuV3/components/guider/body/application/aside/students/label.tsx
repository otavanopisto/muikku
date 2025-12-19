import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { displayNotification } from "~/actions/base/notifications";
import { hexToColorInt } from "~/util/modifiers";
import MApi, { isMApiError } from "~/api/api";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import {
  NavigationElement,
  NavigationDropdown,
  DropdownWrapperProps,
} from "~/components/general/navigation";
import { GenericTag } from "~/components/general/tag-update-dialog";

import { UserFlag } from "~/generated/client";
/**
 * Props for GuiderLabel
 */
interface GuiderLabelProps {
  label: UserFlag;
  isActive?: boolean;
  hash?: string;
  onDelete: (tag: GenericTag, success?: () => void, fail?: () => void) => void;
  onUpdate: (tag: GenericTag, success?: () => void, fail?: () => void) => void;
  onRemoveCollaborators: (
    tag: GenericTag,
    success?: () => void,
    fail?: () => void
  ) => void;
}

/**
 * GuiderLabel
 * @param props component props
 * @returns JSX.Element
 */
const GuiderLabel: React.FC<GuiderLabelProps> = (props: GuiderLabelProps) => {
  const { label, onDelete, onUpdate, onRemoveCollaborators, isActive, hash } =
    props;
  const { status } = useSelector((state: StateType) => state);
  const [tag, setTag] = React.useState<GenericTag>({
    id: label.id,
    label: label.name,
    color: hexToColorInt(label.color),
    description: label.description || "",
    ownerIdentifier: label.ownerIdentifier,
    collaborators: { all: [], toAdd: [], toRemove: [] },
  });
  const { t } = useTranslation(["flags"]);
  const dispatch = useDispatch();

  /**
   * Load collaborators
   */
  const loadCollaborators = React.useCallback(
    async (tagId: number) => {
      const userApi = MApi.getUserApi();
      try {
        const sharesResult = await userApi.getFlagShares({
          flagId: tagId,
        });

        setTag((prevTag) => ({
          ...prevTag,
          collaborators: { all: sharesResult, toRemove: [], toAdd: [] },
        }));
      } catch (e) {
        if (!isMApiError(e)) {
          throw e;
        }
        dispatch(displayNotification(e.message, "error"));
      }
    },
    [dispatch]
  );

  React.useEffect(() => {
    loadCollaborators(tag.id);
  }, [tag.id, loadCollaborators]);

  /**
   * Handle remove collaborators with refresh
   * @param tag tag
   */
  const handleRemoveCollaborators = (tag: GenericTag) => {
    onRemoveCollaborators(tag, () => {
      // Refresh collaborators after successful removal
      loadCollaborators(tag.id);
    });
  };

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
          onDelete,
          onUpdate,
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
