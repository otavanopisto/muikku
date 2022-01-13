import * as React from "react";

/**
 * InputProps
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelAria?: string;
}

/**
 * Creates textfield element specifically for matriculation examination
 * @param root0.label label
 * @param root0.labelAria labelAria
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
