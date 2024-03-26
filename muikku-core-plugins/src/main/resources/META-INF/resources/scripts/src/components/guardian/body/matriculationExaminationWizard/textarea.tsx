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
 * @param props props
 */
export const Textarea: React.FC<TextAreaProps> = (props) => {
  const { label, labelAria, ...rest } = props;

  return (
    <>
      <label className="matriculation__label" aria-label={labelAria}>
        {label}
      </label>
      <textarea {...rest} />
    </>
  );
};
