import * as React from "react";

/**
 * InputProps
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  labelAria?: string;
}

/**
 * TextField
 * @param param0 param0
 * @param param0.label label
 * @param param0.labelAria labelAria
 * @returns JSX.Element. Textfield component
 */
export const TextField: React.FC<InputProps> = ({
  label,
  id,
  labelAria,
  ...rest
}) => (
  <>
    <label htmlFor={id} className="hops__label" aria-label={labelAria}>
      {label}
    </label>
    <input id={id} className="hops__input" {...rest} />
  </>
);
