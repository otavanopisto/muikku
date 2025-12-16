import * as React from "react";
import Select, { GroupBase, Props } from "react-select";

/**
 * CustomSelectProps
 */
interface CustomSelectProps {
  disableFilter?: boolean;
}

/**
 * CustomSelect
 * @param props props
 * @returns JSX.Element
 */
export function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group> & CustomSelectProps) {
  return <Select {...props} />;
}
