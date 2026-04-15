import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

export const TextDirectionRightIcon = memo(
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
      {/* Text lines */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 7C2 6.44772 2.44772 6 3 6H10C10.5523 6 11 6.44772 11 7C11 7.55228 10.5523 8 10 8H3C2.44772 8 2 7.55228 2 7Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 11.4477 2.44772 11 3 11H10C10.5523 11 11 11.4477 11 12C11 12.5523 10.5523 13 10 13H3C2.44772 13 2 12.5523 2 12Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 17C2 16.4477 2.44772 16 3 16H10C10.5523 16 11 16.4477 11 17C11 17.5523 10.5523 18 10 18H3C2.44772 18 2 17.5523 2 17Z"
        fill="currentColor"
      />
      {/* Arrow pointing right */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2929 6.29289C12.9024 5.90237 12.2692 5.90237 11.8787 6.29289C11.4882 6.68342 11.4882 7.31658 11.8787 7.70711L14.1716 10H12C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12H14.1716L11.8787 14.2929C11.4882 14.6834 11.4882 15.3166 11.8787 15.7071C12.2692 16.0976 12.9024 16.0976 13.2929 15.7071L17.2929 11.7071C17.6834 11.3166 17.6834 10.6834 17.2929 10.2929L13.2929 6.29289Z"
        fill="currentColor"
      />
    </svg>
  )
);

TextDirectionRightIcon.displayName = "TextDirectionRightIcon";
