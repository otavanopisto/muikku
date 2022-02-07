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
 * Textarea
 * @param param0 param0
 * @param param0.label label
 * @param param0.labelAria labelAria
 * @returns JSX.Element
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
