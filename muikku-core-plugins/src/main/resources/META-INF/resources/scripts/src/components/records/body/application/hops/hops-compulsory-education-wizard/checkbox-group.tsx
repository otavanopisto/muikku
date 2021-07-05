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
}

export const CheckboxGroupItem: React.FC<CheckboxGroupItemProps> = ({
  label,
  className,
  children,
  ...inputProps
}) => {
  return (
    <div className={className}>
      <input
        className="checkbox__group-input"
        {...inputProps}
        type="checkbox"
      ></input>
      <label className="checkbox__group-item__label"> {label} </label>
    </div>
  );
};
