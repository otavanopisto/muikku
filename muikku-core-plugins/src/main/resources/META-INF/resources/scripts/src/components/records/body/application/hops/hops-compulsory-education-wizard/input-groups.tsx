import * as React from "react";
import "~/sass/elements/input-groups.scss";
/**
 * CheckboxGroupProps
 */
interface InputGroupProps
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
export const InputGroup: React.FC<InputGroupProps> = ({
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

interface ScaleInputGroupProps<T> {
  name: keyof T | string;
  className?: string;
  disabled: boolean;
  label: string;
  /**
   * How big scale is.
   * Example 5 (0-5)
   */
  scaleSize: number;
  value: number;
  onChangeScaleGroup: (name: keyof T | string, scaleValue: number) => void;
}

export const ScaleInputGroup = <T,>(props: ScaleInputGroupProps<T>) => {
  const {
    scaleSize,
    name,
    value,
    onChangeScaleGroup,
    disabled,
    className,
    label,
  } = props;
  const [scaleValue, setScaleValue] = React.useState(value);

  React.useEffect(() => {
    onChangeScaleGroup(name, scaleValue);
  }, [scaleValue]);

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleValue(parseInt(e.target.value));
  };

  const items = Array.from(Array(scaleSize)).map((item, index) => {
    return disabled ? (
      <ScaleInputItem
        className="scale__input__group"
        key={index}
        label={index.toString()}
        name={`scale_input_${name}`}
        value={index}
        readOnly
        disabled
        defaultChecked={index === value}
      />
    ) : (
      <ScaleInputItem
        className="scale__input__group"
        key={index}
        label={index.toString()}
        name={`scale_input_${name}`}
        value={index}
        checked={index === value}
        onChange={handleScaleChange}
      />
    );
  });

  const classModifier = disabled ? "group__item--disabled" : "";
  return (
    <div className={`${className} ${classModifier}`}>
      <label className="item__label"> {label} </label>
      <div style={{ display: "flex" }}>{items}</div>
    </div>
  );
};

/**
 * ScaleInputItemProps
 */
interface ScaleInputItemProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  className?: string;
  modifiers?: string[];
}

/**
 * ScaleInputItem
 * @param param0
 * @returns JSX.Element
 */
export const ScaleInputItem: React.FC<ScaleInputItemProps> = ({
  className,
  modifiers,
  label,
  ...inputProps
}) => {
  return (
    <div className={`${className} ${modifiers}`}>
      <input type="radio" {...inputProps}></input>
      <label className="item__label"> {label} </label>
    </div>
  );
};
