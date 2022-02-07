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
  /**
   * Default: "group__item"
   */
  className?: string;
  modifiers?: string[];
}

const defaultGroupItemProps = {
  className: "group__item",
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
   * Default className value "group__item"
   */
  let updatedClassName = "group__item";
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
      <input className="item__input" {...inputProps} type="checkbox"></input>
      <label className="item__label"> {label} </label>
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
  className: "group__item",
};

/**
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
  }, [scaleValue]);

  /**
   * handleScaleChange
   * @param e e
   */
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleValue(parseInt(e.target.value));
  };

  /**
   * Default className value "group__item"
   */
  let updatedClassName = "group__item";
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
    )
  );

  return (
    <div className={`${updatedClassName} ${updatedClassMods}`}>
      <label className="item__label"> {label} </label>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{items}</div>
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
  <div className={`${className} ${modifiers}`}>
    <input type="radio" {...inputProps}></input>
    <label className="item__label"> {label} </label>
  </div>
);
