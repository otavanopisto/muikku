import * as React from "react";
import "~/sass/elements/avatar.scss";
import Dropdown from "~/components/general/dropdown";
import GroupAvatarUser, { GroupAvatarUserProps } from "./group-user";
import { filterMatch } from "~/util/modifiers";
import { useTranslation } from "react-i18next";

/**
 * AvatarProps
 */
export interface GroupAvatarProps {
  hasImage: boolean;
  id: number | null;
  name: string;
  size?: string;
  groupAvatar?: "usergroup" | "workspace";
  groupMembers?: GroupAvatarUserProps[];
  groupMemberAction?: (userId: number) => JSX.Element;
  userCategory?: number;
  avatarAriaLabel?: string;
  modifier?: string;
  showTooltip?: boolean;
  avatarAriaHidden?: boolean;
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const GroupAvatar = (props: GroupAvatarProps) => {
  const [filter, setFilter] = React.useState<string>("");
  const timeOut = React.useRef<NodeJS.Timeout>(null);
  const { t } = useTranslation();
  const {
    name,
    size,
    modifier,
    showTooltip,
    groupMembers,
    groupAvatar,
    groupMemberAction,
  } = props;

  /**
   * Method to debounce filter.
   * @param e event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(function () {
      setFilter(e.target.value);
    }, 500);
  };

  const groupAvatarMembers = groupMembers && (
    <div className="avatar__group-members">
      <div className="avatar__group-members-search">
        <input
          className="form-element__input"
          onChange={handleInputChange}
          type="text"
          placeholder={t("labels.search", {})}
        />
      </div>
      <div className="avatar__group-members-container">
        {groupMembers
          .filter((m) => filterMatch(m.name, filter))
          .map((member) => (
            <GroupAvatarUser
              key={member.id}
              size="xsmall"
              action={groupMemberAction}
              {...member}
            />
          ))}
      </div>
    </div>
  );

  const avatarBase = (
    <div
      className={`avatar avatar--group ${groupMembers ? "avatar--group-members" : ""} ${
        size ? "avatar--" + size : ""
      } ${"avatar--" + groupAvatar} ${modifier ? "avatar--" + modifier : ""} `}
    >
      <span
        className={`avatar__decoration icon icon-${groupAvatar === "usergroup" ? "users" : "books"}`}
      ></span>
      <span className="avatar__text">{name}</span>
    </div>
  );

  const avatar = showTooltip ? (
    <Dropdown openByHover key="avatar" content={name}>
      {avatarBase}
    </Dropdown>
  ) : (
    avatarBase
  );

  return groupMembers && groupMembers.length > 0 ? (
    <Dropdown modifier="group-members" content={groupAvatarMembers}>
      {avatar}
    </Dropdown>
  ) : (
    avatar
  );
};

export default GroupAvatar;
