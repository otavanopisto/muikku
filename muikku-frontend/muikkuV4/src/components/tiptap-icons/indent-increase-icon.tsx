import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const IndentIncreaseIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* lines */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 6C4 5.44772 4.44772 5 5 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H5C4.44772 7 4 6.55228 4 6Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 12C10 11.4477 10.4477 11 11 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H11C10.4477 13 10 12.5523 10 12Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18C10 17.4477 10.4477 17 11 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H11C10.4477 19 10 18.5523 10 18Z"
      fill="currentColor"
    />
    {/* arrow pointing right (increase indent) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071L6.58579 12L5.29289 13.2929C4.90237 13.6834 4.90237 14.3166 5.29289 14.7071C5.68342 15.0976 6.31658 15.0976 6.70711 14.7071L8.70711 12.7071C9.09763 12.3166 9.09763 11.6834 8.70711 11.2929L6.70711 9.29289C6.31658 8.90237 5.68342 8.90237 5.29289 9.29289Z"
      fill="currentColor"
    />
  </svg>
));

IndentIncreaseIcon.displayName = "IndentIncreaseIcon";
