import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const TextColorIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* "A" */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.1056 4.55279C11.6622 3.17907 13.6047 3.17907 14.1613 4.55279L18.8927 16.2274C19.1002 16.7394 18.8537 17.3222 18.3417 17.5297C17.8298 17.7372 17.2469 17.4907 17.0394 16.9787L15.8785 14.112H9.38842L8.22746 16.9787C8.01995 17.4907 7.43712 17.7372 6.92516 17.5297C6.4132 17.3222 6.16667 16.7394 6.37418 16.2274L11.1056 4.55279ZM10.1987 12.112H15.0682L12.6334 6.10049L10.1987 12.112Z"
      fill="currentColor"
    />
    {/* Color bar */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 20C4 19.4477 4.44772 19 5 19H19C19.5523 19 20 19.4477 20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20Z"
      fill="currentColor"
    />
  </svg>
));

TextColorIcon.displayName = "TextColorIcon";
