import * as React from "react";

/**
 * TextareaProps
 */
interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: string;
  id: string;
}

/**
 * Textarea
 * @param props props
 * @returns JSX.Element. Textarea component
 */
export const Textarea: React.FC<TextareaProps> = (props) => {
  const { label, id, ...textareaProps } = props;

  return (
    <>
      <label htmlFor={id} className="hops__label">
        {label}
      </label>
      <div className="form-element__textarea-container">
        <textarea id={id} {...textareaProps} />
      </div>
    </>
  );
};
