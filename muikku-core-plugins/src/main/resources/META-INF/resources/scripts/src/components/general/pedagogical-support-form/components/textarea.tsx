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
 * @param param0 param0
 * @param param0.label label
 * @param param0.id
 * @returns JSX.Element. Textarea component
 */
export const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  ...textareaProps
}) => (
  <>
    <label htmlFor={id} className="hops__label">
      {label}
    </label>
    <div className="form-element__textarea-container">
      <textarea id={id} {...textareaProps} />
    </div>
  </>
);
