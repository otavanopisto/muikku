import * as React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelAria?: string;
}

export const Textarea: React.FC<TextAreaProps> = ({
  label,
  labelAria,
  ...rest
}) => (
  <>
    <label aria-label={labelAria}>{label}</label>
    <textarea {...rest} />
  </>
);
