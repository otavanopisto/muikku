import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const IndentDecreaseIcon = memo(({ className, ...props }: SvgProps) => (
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
    {/* arrow pointing left (decrease indent) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.70711 9.29289C9.09763 9.68342 9.09763 10.3166 8.70711 10.7071L7.41421 12L8.70711 13.2929C9.09763 13.6834 9.09763 14.3166 8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L7.29289 9.29289C7.68342 8.90237 8.31658 8.90237 8.70711 9.29289Z"
      fill="currentColor"
    />
  </svg>
));

IndentDecreaseIcon.displayName = "IndentDecreaseIcon";
