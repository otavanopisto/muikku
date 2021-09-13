import * as React from "react";
import "~/sass/elements/checkbox-group.scss";
/**
 * CheckboxGroupProps
 */
interface CheckboxGroupProps {}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children }) => {
  return <div className="checkbox__group">{children}</div>;
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
