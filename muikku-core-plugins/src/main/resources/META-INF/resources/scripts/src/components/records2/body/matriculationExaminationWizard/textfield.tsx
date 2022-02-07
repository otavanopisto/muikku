import * as React from "react";

/**
 * InputProps
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelAria?: string;
}

/**
 * TextField
 * @param param0 param0
 * @param param0.label label
 * @param param0.labelAria labelAria
 * @returns JSX.Element
 */
export const TextField: React.FC<InputProps> = ({
  label,
  labelAria,
  ...rest
}) => (
  <>
    <label className="matriculation__label" aria-label={labelAria}>
      {label}
    </label>
    <input {...rest} />
  </>
);
