import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const TableIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 4C3.34315 4 2 5.34315 2 7V17C2 18.6569 3.34315 20 5 20H19C20.6569 20 22 18.6569 22 17V7C22 5.34315 20.6569 4 19 4H5ZM4 10V7C4 6.44772 4.44772 6 5 6H8V10H4ZM10 10V6H14V10H10ZM16 10V6H19C19.5523 6 20 6.44772 20 7V10H16ZM4 12V17C4 17.5523 4.44772 18 5 18H8V12H4ZM10 12V18H14V12H10ZM16 12V18H19C19.5523 18 20 17.5523 20 17V12H16Z"
      fill="currentColor"
    />
  </svg>
));

TableIcon.displayName = "TableIcon";
