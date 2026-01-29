import * as React from "react";
import { Instructions } from "../instructions";

/**
 * InputProps
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelAria?: string;
  instructions?: JSX.Element;
}

/**
 * Creates textfield element specifically for matriculation examination
 * @param props props
 */
export const TextField: React.FC<InputProps> = (props) => {
  const { label, labelAria, instructions, ...rest } = props;

  return (
    <>
      <label className="matriculation__label" aria-label={labelAria}>
        {label}
        {instructions && <Instructions content={instructions} />}
      </label>
      <input {...rest} />
    </>
  );
};
