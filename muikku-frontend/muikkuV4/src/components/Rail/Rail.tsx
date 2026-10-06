import { UnstyledButton } from "@mantine/core";
import classes from "./Rail.module.css";

const COLOR_VARS: Record<string, string> = {
  teal: "var(--mantine-color-teal-6)",
  violet: "var(--mantine-color-violet-6)",
  blue: "var(--mantine-color-blue-6)",
  orange: "var(--mantine-color-orange-6)",
  gray: "var(--mantine-color-dimmed)",
};

/**
 * Props for a single rail item.
 */
export interface RailItemProps {
  /** Mantine color key (teal, violet, …) or any CSS color */
  color?: string;
  /** Fill the bullet (e.g. completed) */
  filled?: boolean;
  /** Content inside the bullet; defaults to empty */
  bullet?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}

/**
 * Vertical list with a connector line and per-item bullets.
 */
export function Rail(props: { children: React.ReactNode }) {
  return <div className={classes.rail}>{props.children}</div>;
}

/**
 * One row on the rail.
 */
function RailItem(props: RailItemProps) {
  const { color, filled = false, bullet, onClick, children } = props;
  const itemColor =
    color && COLOR_VARS[color] ? COLOR_VARS[color] : (color ?? undefined);

  const content = (
    <>
      <span className={classes.bullet} data-filled={filled || undefined}>
        {bullet}
      </span>
      <div className={classes.body}>{children}</div>
    </>
  );

  const style = { "--rail-item-color": itemColor } as React.CSSProperties;

  if (onClick) {
    return (
      <UnstyledButton
        className={classes.item}
        onClick={onClick}
        ta="left"
        w="100%"
        style={style}
      >
        {content}
      </UnstyledButton>
    );
  }

  return (
    <div className={classes.item} style={style}>
      {content}
    </div>
  );
}

Rail.Item = RailItem;
