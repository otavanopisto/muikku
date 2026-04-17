import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const DeleteColumnIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Column line */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 3C8.55228 3 9 3.44772 9 4V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V4C7 3.44772 7.44772 3 8 3Z"
      fill="currentColor"
    />
    {/* Trash */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 11V10C7 9.17477 7.40255 8.43324 7.91789 7.91789C8.43324 7.40255 9.17477 7 10 7H14C14.8252 7 15.5668 7.40255 16.0821 7.91789C16.5975 8.43324 17 9.17477 17 10V11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H20V20C20 20.8252 19.5975 21.5668 19.0821 22.0821C18.5668 22.5975 17.8252 23 17 23H7C6.17477 23 5.43324 22.5975 4.91789 22.0821C4.40255 21.5668 4 20.8252 4 20V13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H7ZM9 10C9 9.82523 9.09745 9.56676 9.33211 9.33211C9.56676 9.09745 9.82523 9 10 9H14C14.1748 9 14.4332 9.09745 14.6679 9.33211C14.9025 9.56676 15 9.82523 15 10V11H9V10ZM6 13V20C6 20.1748 6.09745 20.4332 6.33211 20.6679C6.56676 20.9025 6.82523 21 7 21H17C17.1748 21 17.4332 20.9025 17.6679 20.6679C17.9025 20.4332 18 20.1748 18 20V13H6Z"
      fill="currentColor"
    />
  </svg>
));

DeleteColumnIcon.displayName = "DeleteColumnIcon";
