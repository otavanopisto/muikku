import * as React from "react";

/**
 * InputProps
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  labelAria?: string;
}

/**
 * TextField
 * @param props props
 * @returns React.JSX.Element. Textfield component
 */
export const TextField: React.FC<InputProps> = (props) => {
  const { label, id, labelAria, ...rest } = props;

  return (
    <>
      {label && (
        <label htmlFor={id} className="hops__label" aria-label={labelAria}>
          {label}
        </label>
      )}

      <input id={id} className="hops__input" {...rest} />
    </>
  );
};
