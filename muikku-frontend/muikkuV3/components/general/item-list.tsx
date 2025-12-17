import * as React from "react";
import { IconButton } from "./button";

/**
 * ItemList properties
 */
interface ItemListProps {
  modifier?: string;
  header?: string;
}

/**
 * Item list component
 * @param props ItemListProps
 * @returns JSX.element
 */
const ItemList: React.FC<ItemListProps> & {
  Item?: <C extends React.ElementType>(
    props: RootElementProps<C>
  ) => JSX.Element;
  ItemFooter?: React.FC<FooterProps>;
} = (props) => {
  const { children, modifier, header } = props;

  return (
    <div className={`item-list ${modifier ? "item-list--" + modifier : ""}`}>
      {header ? (
        <>
          <div className="item-list__header">{header}</div>
          <div className="item-list__content">{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
};

/**
 * Item Properties
 */
type ItemProps<C extends React.ElementType> = {
  as?: C;
  modifier?: string;
  icon?: string;
  onDelete?: () => void;
};

/**
 *  RootElementProps
 *  React.ComponentPropsWithoutRef will check the props for the given ElemenType,
 *  so there can't be divs with href for example.
 */
type RootElementProps<C extends React.ElementType> = React.PropsWithChildren<
  ItemProps<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ItemProps<C>>;

/**
 * Strongly typed list item, you can use even React components in the "as" prop
 * @param props RootElementProps
 * @returns JSX.Element
 */
const ListItem = <C extends React.ElementType = "div">(
  props: RootElementProps<C>
) => {
  const { as, modifier, icon, children, onDelete, ...rest } = props;
  const Component = as || "div";

  return (
    <Component
      {...rest}
      className={`item-list__item ${
        modifier ? "item-list__item--" + modifier : ""
      }`}
    >
      {icon && (
        <span
          className={`item-list__icon ${
            modifier ? "item-list__icon--" + modifier : ""
          } ${icon}`}
        ></span>
      )}
      <span className="item-list__text-body">{children}</span>
      {onDelete && (
        <IconButton
          icon="trash"
          buttonModifiers="studies-panel-list-item-delete"
          onClick={onDelete}
        />
      )}
    </Component>
  );
};

/**
 * Item actions Properties
 */
interface FooterProps {
  modifier?: string;
}

/**
 * ItemFooter component
 * @param props FooterProps
 * @returns JSX.Element
 */
const ItemFooter: React.FC<FooterProps> = (props) => {
  const { modifier, children } = props;

  return (
    <div
      className={`item-list__item-actions ${
        modifier ? "item-list__item-actions--" + modifier : ""
      }`}
    >
      {children}
    </div>
  );
};

ItemList.Item = ListItem;
ItemList.ItemFooter = ItemFooter;

export default ItemList;
