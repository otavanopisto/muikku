import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

/**
 * Float image left: vertical guide line with a rounded “image” block to its right.
 */
export const ImageAlignLeftIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    {...props}
  >
    <path
      d="M5 5.5V18.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="9.5"
      y="7.5"
      width="10"
      height="9"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
));

ImageAlignLeftIcon.displayName = "ImageAlignLeftIcon";
