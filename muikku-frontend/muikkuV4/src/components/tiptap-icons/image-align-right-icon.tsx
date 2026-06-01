import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

/**
 * Float image right: rounded “image” block with a vertical guide line to its right.
 */
export const ImageAlignRightIcon = memo(({ className, ...props }: SvgProps) => (
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
    <rect
      x="4.5"
      y="7.5"
      width="10"
      height="9"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19 5.5V18.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
));

ImageAlignRightIcon.displayName = "ImageAlignRightIcon";
