import * as React from "react";
import { OptionProps, components } from "react-select";
import { OptionWithExtraContent } from "./types";

/**
 * OptionWithDescription
 * @param props props
 * @returns React.JSX.Element
 */
export const OptionWithDescription = <CustomValue,>(
  props: OptionProps<OptionWithExtraContent<CustomValue>>
) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <label className="react-select-override__option-label">
        {data.label}
      </label>

      {data.extraContent && (
        <div className="react-select-override__option-body">
          {data.extraContent}
        </div>
      )}
    </components.Option>
  );
};
