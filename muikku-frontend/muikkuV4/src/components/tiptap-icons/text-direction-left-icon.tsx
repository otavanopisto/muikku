import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const TextDirectionLeftIcon = memo(
  ({ className, ...props }: SvgProps) => (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Arrow pointing left */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7071 7.70711C11.0976 7.31658 11.0976 6.68342 10.7071 6.29289C10.3166 5.90237 9.68342 5.90237 9.29289 6.29289L5.29289 10.2929C4.90237 10.6834 4.90237 11.3166 5.29289 11.7071L9.29289 15.7071C9.68342 16.0976 10.3166 16.0976 10.7071 15.7071C11.0976 15.3166 11.0976 14.6834 10.7071 14.2929L8.41421 12H11C11.5523 12 12 11.5523 12 11C12 10.4477 11.5523 10 11 10H8.41421L10.7071 7.70711Z"
        fill="currentColor"
      />
      {/* Text lines */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 7C13 6.44772 13.4477 6 14 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H14C13.4477 8 13 7.55228 13 7Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 12C13 11.4477 13.4477 11 14 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H14C13.4477 13 13 12.5523 13 12Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 17C13 16.4477 13.4477 16 14 16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H14C13.4477 18 13 17.5523 13 17Z"
        fill="currentColor"
      />
    </svg>
  )
);

TextDirectionLeftIcon.displayName = "TextDirectionLeftIcon";
