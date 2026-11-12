import type { Role } from "~/generated/client";
import { useMemo } from "react";
import { panels } from "~/src/pages/Dashboard/catalog/panels";
import type { User } from "~/src/services/auth";

interface useActionBarItemsProps {
  user: User;
}

const useActionBarItems = (props: useActionBarItemsProps) => {
  const { user } = props;

  const items = useMemo(
    () =>
      panels.filter((panel) => {
        if (!panel.access) return true;
        return user.roles.some((role) => panel.access?.includes(role));
      }),
    [user]
  );

  return items;
};

export default useActionBarItems;
