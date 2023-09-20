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
 * @param param0 param0
 * @param param0.children children
 * @param param0.modifiers modifiers
 * @param param0.className className
 * @returns JSX.Element
 */
export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  modifiers,
  className,
}) => {
  let updatedClassName = "input-group-container";

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
  /**
   * Default: "input-group"
   */
  className?: string;
  modifiers?: string[];
}

const defaultGroupItemProps = {
  className: "input-group",
};

/**
 * CheckboxGroupItem
 * @param props props
 * @returns JSX.Element. Checkbox group item component
 */
export const CheckboxGroupItem: React.FC<CheckboxGroupItemProps> = (props) => {
  props = { ...defaultGroupItemProps, ...props };

  const { label, className, children, modifiers, ...inputProps } = props;
  /**
   * Default className value "input-group"
   */
  let updatedClassName = "input-group";
  let updatedClassMods: string[] | string = [];

  /**
   * If other than default className
   */
  if (className) {
    updatedClassName = className;
  }

  /**
   * disabled mod
   */
  if (inputProps.disabled) {
    updatedClassMods.push("disabled");
  }

  /**
   * If concat and create modifiers string if there is any modifers
   */
  if (updatedClassMods) {
    if (modifiers) {
      updatedClassMods = updatedClassMods.concat(modifiers);
    }

    updatedClassMods = updatedClassMods
      .map((m) => `${updatedClassName}--${m}`)
      .join(" ");
  }

  return (
    <div className={`${updatedClassName} ${updatedClassMods}`}>
      <input
        className="hops__input hops__input--input-groups"
        {...inputProps}
        type="checkbox"
      ></input>
      <label className="hops__label hops__label--input-groups"> {label} </label>
    </div>
  );
};

/**
 * ScaleInputGroupProps
 */
interface ScaleInputGroupProps<T> {
  name: keyof T | string;
  className?: string;
  modifiers?: string[];
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

const defaultScaleInputGroupProps = {
  className: "input-group",
};

/**
 * ScaleInputGroup
 *
 * @param props props
 * @returns JSX.Element. Scale input group component
 */
export const ScaleInputGroup = <T,>(props: ScaleInputGroupProps<T>) => {
  props = { ...defaultScaleInputGroupProps, ...props };

  const {
    scaleSize,
    name,
    value,
    onChangeScaleGroup,
    disabled,
    className,
    label,
    modifiers,
  } = props;
  const [scaleValue, setScaleValue] = React.useState(value);

  React.useEffect(() => {
    onChangeScaleGroup(name, scaleValue);
  }, [scaleValue, name, onChangeScaleGroup]);

  /**
   * handleScaleChange
   * @param e e
   */
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleValue(parseInt(e.target.value));
  };

  /**
   * Default className value "checkbox-group__item"
   */
  let updatedClassName = "input-group";
  let updatedClassMods: string[] | string = [];

  /**
   * If other than default className
   */
  if (className) {
    updatedClassName = className;
  }

  /**
   * disabled mod
   */
  if (disabled) {
    updatedClassMods.push("disabled");
  }

  /**
   * If concat and create modifiers string if there is any modifers
   */
  if (updatedClassMods) {
    if (modifiers) {
      updatedClassMods = updatedClassMods.concat(modifiers);
    }

    updatedClassMods = updatedClassMods
      .map((m) => `${updatedClassName}--${m}`)
      .join(" ");
  }

  const items = Array.from(Array(scaleSize)).map((item, index) =>
    disabled ? (
      <ScaleInputItem
        className="input-group__item-container"
        key={index}
        label={index.toString()}
        name={`input-group-${name.toString()}`}
        value={index}
        readOnly
        disabled
        defaultChecked={index === value}
      />
    ) : (
      <ScaleInputItem
        className="input-group__item-container"
        key={index}
        label={index.toString()}
        name={`input-group-${name.toString()}`}
        value={index}
        checked={index === value}
        onChange={handleScaleChange}
      />
    )
  );

  return (
    <div className={`${updatedClassName} ${updatedClassMods}`}>
      <label className="input-group__label"> {label} </label>
      <div className="input-group__items-container">{items}</div>
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
 * @param param0 param0
 * @param param0.className className
 * @param param0.modifiers modifiers
 * @param param0.label label
 * @returns JSX.Element. Scale input item component
 */
export const ScaleInputItem: React.FC<ScaleInputItemProps> = ({
  className,
  modifiers,
  label,
  ...inputProps
}) => (
  <div
    className={`${className ? className : ""} ${(modifiers || [])
      .map((s) => `${className}--${s}`)
      .join(" ")}`}
  >
    <input
      className="hops__input hops__input--input-groups"
      type="radio"
      {...inputProps}
    ></input>
    <label className="input-group__item-label"> {label} </label>
  </div>
);
