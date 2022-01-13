import * as React from "react";

/**
 * TextAreaProps
 */
interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelAria?: string;
}

/**
 * Creates Textarea element specifically for matriculation examination
 * @param root0.label label
 * @param root0.labelAria labelAria
 */
export const Textarea: React.FC<TextAreaProps> = ({
  label,
  labelAria,
  ...rest
}) => (
  <>
    <label className="matriculation__label" aria-label={labelAria}>
      {label}
    </label>
    <textarea {...rest} />
  </>
);
