import * as React from "react";
import "~/sass/elements/checkbox-group.scss";
/**
 * CheckboxGroupProps
 */
interface CheckboxGroupProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * CheckboxGroup
 * @param param0
 * @returns JSX.Element
 */
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  modifiers,
  className,
}) => {
  let updatedClassName = "checkbox__group";

  if (className) {
    updatedClassName = className;
  }

  return (
    <div
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
    >
      {children}
    </div>
  );
};

/**
 * CheckboxGroupItemProps
 */
interface CheckboxGroupItemProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  className?: string;
  modifiers?: string[];
}

/**
 * CheckboxGroupItem
 * @param param0
 * @returns
 */
export const CheckboxGroupItem: React.FC<CheckboxGroupItemProps> = ({
  label,
  className,
  children,
  ...inputProps
}) => {
  const classModifier = inputProps.disabled ? "group__item--disabled" : "";

  return (
    <div className={`${className} ${classModifier}`}>
      <input className="item__input" {...inputProps} type="checkbox"></input>
      <label className="item__label"> {label} </label>
    </div>
  );
};
