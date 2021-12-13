import * as React from "react";

interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  ...textareaProps
}) => (
  <>
    <label>{label}</label>
    <textarea {...textareaProps} />
  </>
);
