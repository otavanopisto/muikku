import { NavLink } from "@mantine/core";
import {
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
} from "react-router";
import type { NavigationQueryLink } from "~/src/navigation/navigation";
import { navLinkClassNames } from "~/src/components/NavbarLink/navLinkClassnames";

/**
 * NavbarQueryLink - A link that navigates to a query-based route
 */
interface NavbarQueryLinkProps extends Omit<NavigationQueryLink, "type"> {}

/**
 * NavbarQueryLink - A link that navigates to a query-based route
 * @param props - The props for the NavbarQueryLink component
 */
export function NavbarQueryLink(props: NavbarQueryLinkProps) {
  const {
    icon: Icon,
    label,
    link,
    queryName,
    queryValue: linkQueryValue,
  } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const to = typeof link === "function" ? link(params) : link;
  const resolved = useResolvedPath(to);

  const currentQueryValue = new URLSearchParams(location.search).get(queryName);
  const isOnTargetPath =
    location.pathname === resolved.pathname ||
    location.pathname.startsWith(`${resolved.pathname}/`);
  const isActive = isOnTargetPath && currentQueryValue === linkQueryValue;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    const nextParams = isOnTargetPath
      ? new URLSearchParams(location.search)
      : new URLSearchParams(resolved.search);

    if (isActive) {
      nextParams.delete(queryName);
    } else {
      nextParams.set(queryName, linkQueryValue);
    }

    const newSearch = nextParams.toString();
    void navigate(`${resolved.pathname}${newSearch ? `?${newSearch}` : ""}`);
  };

  return (
    <NavLink
      label={label}
      leftSection={Icon ? <Icon size={20} stroke={1.5} /> : null}
      active={isActive}
      onClick={handleClick}
      classNames={navLinkClassNames}
    />
  );
}
