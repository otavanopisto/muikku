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
}

/**
 * Textarea
 * @param param0 param0
 * @param param0.label label
 * @returns JSX.Element. Textarea component
 */
export const Textarea: React.FC<TextareaProps> = ({
  label,
  ...textareaProps
}) => (
  <>
    <label>{label}</label>
    <div className="form-element__textarea-container">
      <textarea {...textareaProps} />
    </div>
  </>
);
