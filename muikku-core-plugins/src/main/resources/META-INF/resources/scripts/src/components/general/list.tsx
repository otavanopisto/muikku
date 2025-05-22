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
 * @returns React.JSX.Element
 */
export const ListContainer: React.FC<ListContainerProps> = (props) => {
  const { modifiers, children, className, ...rest } = props;

  let updatedClassName = "list__container";

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
 * ListHeaderProps
 */
interface ListHeaderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string[];
}

/**
 * ListHeader
 * @param props props
 * @returns React.JSX.Element
 */
export const ListHeader: React.FC<ListHeaderProps> = (props) => {
  const { modifiers, className, children, ...rest } = props;

  let updatedClassName = "list__header";

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
 * @returns React.JSX.Element
 */
export const ListItem: React.FC<ListItemProps> = (props) => {
  const { modifiers, className, children, ...rest } = props;

  let updatedClassName = "list__item";

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
 * @returns React.JSX.Element
 */
export const ListItemIndicator: React.FC<ListItemIndicator> = (props) => {
  const { modifiers, children, className, ...rest } = props;

  let updatedClassName = "list__indicator";

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
