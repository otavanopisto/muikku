import * as React from "react";
import "~/sass/elements/avatar.scss";
import GroupAvatarUser, { GroupAvatarUserProps } from "./user";
import { filterMatch } from "~/util/modifiers";
import { useTranslation } from "react-i18next";

/**
 * AvatarProps
 */
export interface GroupAvatarUsersProps {
  users: GroupAvatarUserProps[];
  action?: (userId: number) => JSX.Element;
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const GroupAvatarUsers = (props: GroupAvatarUsersProps) => {
  const [filter, setFilter] = React.useState<string>("");
  const timeOut = React.useRef<NodeJS.Timeout>(null);
  const { t } = useTranslation();
  const { users, action } = props;

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

  return (
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
        {users
          .filter((m) => filterMatch(m.name, filter))
          .map((user) => (
            <GroupAvatarUser
              key={user.id}
              size="xsmall"
              action={action}
              {...user}
            />
          ))}
      </div>
    </div>
  );
};

export default GroupAvatarUsers;
