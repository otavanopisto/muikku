import { panels } from "~/src/pages/Dashboard/catalog/panels";
import { useAtomValue } from "jotai";
import { userAtom } from "~/src/atoms/auth";

const useActionBarItems = () => {
  const user = useAtomValue(userAtom);

  if (!user) {
    return [];
  }

  return panels.filter((panel) => {
    if (!panel.access) return true;
    return user.roles.some((role) => panel.access?.includes(role));
  });
};

export default useActionBarItems;
