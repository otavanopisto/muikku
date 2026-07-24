import { NavLink } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import type { NavigationQueryLink } from "~/src/navigation/navigation";
import { navLinkClassNames } from "~/src/components/NavbarLink/navLinkClassnames";

/**
 * Props for the NavbarQueryLink component.
 */
interface NavbarQueryLinkProps extends Omit<NavigationQueryLink, "type"> {}

/**
 * Query-param toggle link for secondary navigation.
 */
export function NavbarQueryLink(props: NavbarQueryLinkProps) {
  const { icon: Icon, label, queryName, queryValue: linkQueryValue } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const currentQueryValue = new URLSearchParams(location.search).get(queryName);
  const isActive = currentQueryValue === linkQueryValue;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    const currentParams = new URLSearchParams(location.search);

    if (isActive) {
      currentParams.delete(queryName);
    } else {
      currentParams.set(queryName, linkQueryValue);
    }

    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

    void navigate(newUrl);
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
