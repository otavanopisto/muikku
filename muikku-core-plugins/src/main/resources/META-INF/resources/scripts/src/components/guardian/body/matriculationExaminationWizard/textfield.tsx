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
 * @param props props
 */
export const TextField: React.FC<InputProps> = (props) => {
  const { label, labelAria, ...rest } = props;

  return (
    <>
      <label className="matriculation__label" aria-label={labelAria}>
        {label}
      </label>
      <input {...rest} />
    </>
  );
};
