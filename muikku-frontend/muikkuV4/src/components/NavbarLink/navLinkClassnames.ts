import type { NavLinkProps } from "@mantine/core";
import classes from "./NavbarLink.module.css";

export const navLinkClassNames: NavLinkProps["classNames"] = {
  root: classes.root,
  section: classes.section,
  body: classes.body,
  label: classes.label,
  description: classes.description,
};
