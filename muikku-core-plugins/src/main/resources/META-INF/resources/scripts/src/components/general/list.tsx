import * as React from "react";
import "~/sass/elements/list.scss";

interface ListContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * ListContainer
 * @param param0
 * @returns JSX.Element
 */
export const ListContainer: React.FC<ListContainerProps> = ({
  modifiers,
  children,
  className,
  ...rest
}) => {
  let updatedClassName = "list-container";

  if (className) {
    updatedClassName = className;
  }

  return (
    <div
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </div>
  );
};

interface ListItemProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * ListItem
 * @param param0
 * @returns JSX.Element
 */
export const ListItem: React.FC<ListItemProps> = ({
  modifiers,
  className,
  children,
  ...rest
}) => {
  let updatedClassName = "list-item";

  if (className) {
    updatedClassName = className;
  }

  return (
    <div
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * ListItemIndicator
 */
interface ListItemIndicator
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * ListItemIndicator
 * @param param0
 * @returns JSX.Element
 */
export const ListItemIndicator: React.FC<ListItemIndicator> = ({
  modifiers,
  children,
  className,
  ...rest
}) => {
  let updatedClassName = "list-item-indicator";

  if (className) {
    updatedClassName = className;
  }

  return (
    <div
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </div>
  );
};
