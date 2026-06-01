import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const BackgroundColorIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Drop */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C12.5523 3 13 3.44772 13 4C13 6.74762 16.3333 9.08627 16.3333 12.1667C16.3333 14.9243 14.7576 17 12 17C9.24238 17 7.66667 14.9243 7.66667 12.1667C7.66667 9.08627 11 6.74762 11 4C11 3.44772 11.4477 3 12 3ZM9.66667 12.1667C9.66667 13.95 10.5709 15 12 15C13.4291 15 14.3333 13.95 14.3333 12.1667C14.3333 11.0792 13.3113 9.81986 12 8.32601C10.6887 9.81986 9.66667 11.0792 9.66667 12.1667Z"
      fill="currentColor"
    />
    {/* Background bar */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 20C4 19.4477 4.44772 19 5 19H19C19.5523 19 20 19.4477 20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20Z"
      fill="currentColor"
    />
  </svg>
));

BackgroundColorIcon.displayName = "BackgroundColorIcon";
