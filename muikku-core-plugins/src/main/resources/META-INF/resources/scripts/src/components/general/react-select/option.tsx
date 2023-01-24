import * as React from "react";
import { OptionProps, components } from "react-select";
import { OptionWithExtraContent } from "./types";

/**
 * OptionWithDescription
 * @param props props
 * @returns JSX.Element
 */
export const OptionWithDescription = <CustomValue,>(
  props: OptionProps<OptionWithExtraContent<CustomValue>>
) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <h3>{data.label}</h3>
      {data.extraContent && data.extraContent}
    </components.Option>
  );
};
