import * as React from "react";

/**
 * ItemList properties
 */
interface ItemListProps {
  modifier?: string;
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
  const { children, modifier } = props;

  return (
    <div className={`item-list ${modifier ? "item-list--" + modifier : ""}`}>
      {children}
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
  const { as, modifier, icon, children, ...rest } = props;
  const Component = as || "div";

  return (
    <Component
      {...rest}
      className={`item-list__item ${
        modifier ? "item-list__item--" + modifier : ""
      }`}
    >
      {icon ? (
        <>
          <div
            className={`item-list__icon ${
              modifier ? "item-list__icon--" + modifier : ""
            } ${icon}`}
          ></div>

          <div className="item-list__text-body">{children}</div>
        </>
      ) : (
        { children }
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
