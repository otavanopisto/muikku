import { memo } from "react";

type SvgProps = React.ComponentPropsWithoutRef<"svg">;

/**
 * ImageCaptionIcon
 * @param className - The class name.
 * @param props - The props.
 * @returns The ImageCaptionIcon.
 */
export const ImageCaptionIcon = memo(({ className, ...props }: SvgProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="3" width="18" height="13" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 14l-5-4-7 5" />
    <line x1="3" y1="20" x2="21" y2="20" />
    <line x1="6" y1="22" x2="18" y2="22" />
  </svg>
));

ImageCaptionIcon.displayName = "ImageCaptionIcon";
