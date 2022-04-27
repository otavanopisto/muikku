import * as React from "react";
import "~/sass/elements/list.scss";

/**
 * ListContainerProps
 */
interface ListContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * ListContainer
 * @param props props
 * @returns JSX.Element
 */
export const ListContainer: React.FC<ListContainerProps> = (props) => {
  const { modifiers, children, className, ...rest } = props;

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

/**
 * ListItemProps
 */
interface ListItemProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * ListItem
 * @param props props
 * @returns JSX.Element
 */
export const ListItem: React.FC<ListItemProps> = (props) => {
  const { modifiers, className, children, ...rest } = props;

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
 * @param props props
 * @returns JSX.Element
 */
export const ListItemIndicator: React.FC<ListItemIndicator> = (props) => {
  const { modifiers, children, className, ...rest } = props;

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
