/* eslint-disable react-x/no-forward-ref */
import { forwardRef, useMemo, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";

import { useMenuNavigation } from "@/hooks/use-menu-navigation";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import { BanIcon } from "@/components/tiptap-icons/ban-icon";
import { TextColorIcon } from "@/components/tiptap-icons/text-color-icon";

import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover";
import { Separator } from "@/components/tiptap-ui-primitive/separator";
import {
  Card,
  CardBody,
  CardItemGroup,
} from "@/components/tiptap-ui-primitive/card";
import { ButtonGroup } from "@/components/tiptap-ui-primitive/button-group";

import {
  hasTextColor,
  TEXT_COLORS,
  type TextColor,
  useTextColor,
} from "~/src/components/tiptap-ui/text-color-popover/use-text-color";

/**
 * TextColorPopoverContentProps is the props for the TextColorPopoverContent component
 */
export interface TextColorPopoverContentProps {
  editor?: Editor | null;
  colors?: readonly TextColor[];
}

/**
 * TextColorPopoverProps is the props for the TextColorPopover component
 */
export interface TextColorPopoverProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  colors?: readonly TextColor[];
}

/**
 * TextColorPopoverButton is the button for the TextColorPopover component
 */
export const TextColorPopoverButton = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, children, ...props }, ref) => (
  <Button
    type="button"
    className={className}
    variant="ghost"
    data-appearance="default"
    role="button"
    tabIndex={-1}
    aria-label="Text color"
    tooltip="Text color"
    ref={ref}
    {...props}
  >
    {children ?? <TextColorIcon className="tiptap-button-icon" />}
  </Button>
));

TextColorPopoverButton.displayName = "TextColorPopoverButton";

/**
 * TextColorPopoverContent is the content for the TextColorPopover component
 */
export function TextColorPopoverContent({
  editor,
  colors = TEXT_COLORS,
}: TextColorPopoverContentProps) {
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleUnsetColor } = useTextColor({ editor });

  const menuItems = useMemo(
    () => [...colors, { label: "Default text color", value: "none" as const }],
    [colors]
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: "both",
    onSelect: (item) => {
      if (!containerRef.current) return false;
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      const highlightedElement = containerRef.current.querySelector(
        '[data-highlighted="true"]'
      ) as HTMLElement;
      if (highlightedElement) highlightedElement.click();
      if (item.value === "none") handleUnsetColor();
      return true;
    },
    autoSelectFirstItem: false,
  });

  return (
    <Card
      ref={containerRef}
      tabIndex={0}
      style={isMobile ? { boxShadow: "none", border: 0 } : {}}
    >
      <CardBody style={isMobile ? { padding: 0 } : {}}>
        <CardItemGroup orientation="horizontal">
          <ButtonGroup>
            {colors.map((c, index) => (
              <ButtonGroup key={c.value}>
                <TextColorSwatchButton
                  editor={editor}
                  color={c.value}
                  label={c.label}
                  tabIndex={index === selectedIndex ? 0 : -1}
                  data-highlighted={selectedIndex === index}
                />
              </ButtonGroup>
            ))}
          </ButtonGroup>

          <Separator />

          <ButtonGroup>
            <Button
              onClick={handleUnsetColor}
              aria-label="Default text color"
              tooltip="Default text color"
              tabIndex={selectedIndex === colors.length ? 0 : -1}
              type="button"
              role="menuitem"
              variant="ghost"
              data-highlighted={selectedIndex === colors.length}
            >
              <BanIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
}

/**
 * TextColorSwatchButton is the button for the TextColorPopoverContent component
 */
function TextColorSwatchButton(props: {
  editor?: Editor | null;
  color: string;
  label: string;
  tabIndex?: number;
  "data-highlighted"?: boolean;
}) {
  const { editor, color, label, ...rest } = props;
  const { canTextColor, handleSetColor, isActive } = useTextColor({
    editor,
    color,
    label,
  });

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={!canTextColor}
      data-disabled={!canTextColor}
      data-active-state={isActive ? "on" : "off"}
      aria-label={label}
      tooltip={label}
      onClick={handleSetColor}
      style={
        {
          // simple colored dot
          "--tt-swatch": color,
        } as React.CSSProperties
      }
      {...rest}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: "var(--tt-swatch)",
          display: "inline-block",
          border: "1px solid var(--tt-border-color, rgba(0,0,0,.15))",
        }}
      />
    </Button>
  );
}

/**
 * TextColorPopover is the popover for the TextColorPopover component
 */
export function TextColorPopover({
  editor: providedEditor,
  hideWhenUnavailable = false,
  colors = TEXT_COLORS,
  ...props
}: TextColorPopoverProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);

  // For the toolbar button itself, we just need visibility/can-show.
  const { isVisible, canTextColor, label, Icon } = useTextColor({
    editor,
    hideWhenUnavailable,
  });

  if (!isVisible) return null;

  const isActive = hasTextColor(editor);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <TextColorPopoverButton
          disabled={!canTextColor}
          data-disabled={!canTextColor}
          data-active-state={isActive ? "on" : "off"}
          aria-label={label}
          tooltip={label}
          {...props}
        >
          <Icon className="tiptap-button-icon" />
        </TextColorPopoverButton>
      </PopoverTrigger>

      <PopoverContent aria-label="Text colors">
        <TextColorPopoverContent editor={editor} colors={colors} />
      </PopoverContent>
    </Popover>
  );
}

export default TextColorPopover;
