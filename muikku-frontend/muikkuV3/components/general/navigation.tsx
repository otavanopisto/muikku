/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */
import Link from "~/components/general/link";
import * as React from "react";
// eslint-disable-next-line camelcase
import { createPortal, unstable_batchedUpdates } from "react-dom";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/item-list.scss";
import UpdateDialog, {
  GenericTag,
} from "~/components/general/tag-update-dialog";
import PromptDialog from "~/components/general/prompt-dialog";
import { useTranslation } from "react-i18next";

/**
 * Navigation
 */
export default class Navigation extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * Component render method
   * @returns JSx.Element
   */
  render() {
    return (
      <nav className="menu-wrapper menu-wrapper--aside">
        {this.props.children}
      </nav>
    );
  }
}

/**
 * NavigationTopicProps
 */
interface NavigationTopicProps {
  name: string;
  classModifier?: string;
}

/**
 * NavigationTopicState
 */
interface NavigationTopicState {}

/**
 * NavigationTopic
 */
export class NavigationTopic extends React.Component<
  NavigationTopicProps,
  NavigationTopicState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const listClassNameModifier = this.props.classModifier
      ? "menu--" + this.props.classModifier
      : "";

    return (
      <ul className={`menu ${listClassNameModifier}`}>
        <li className="menu__title">
          {this.props.name ? this.props.name : null}
        </li>
        {this.props.children}
      </ul>
    );
  }
}

/**
 * NavigationElementProps
 */
interface NavigationElementProps {
  isActive: boolean;
  className?: string;
  modifiers?: string | Array<string>;
  hash?: number | string;
  id?: string;
  href?: string;
  onClick?: (parameter?: any) => any;
  children: string;
  icon?: string;
  iconTitle?: string;
  iconColor?: string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
  isEditable?: boolean;
  editableWrapper?: any;
  editableWrapperArgs?: any;
  editableIcon?: string;
  editableAction?: () => any;
  onScrollToSection?: () => any;
  scrollPadding?: number;
  disableScroll?: boolean;
}

/**
 * NavigationElementState
 */
interface NavigationElementState {}

/**
 * NavigationElement
 */
export class NavigationElement extends React.Component<
  NavigationElementProps,
  NavigationElementState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    let editableComponent: JSX.Element | null = null;
    const modifiers: Array<string> =
      typeof this.props.modifiers === "string"
        ? [this.props.modifiers]
        : this.props.modifiers;

    if (this.props.isEditable && this.props.editableWrapper) {
      const EditableWrapper = this.props.editableWrapper;
      editableComponent = (
        <EditableWrapper {...this.props.editableWrapperArgs}>
          <ButtonPill
            tabIndex={0}
            disablePropagation
            as="span"
            buttonModifiers="navigation-edit-label"
            icon={this.props.editableIcon ? this.props.editableIcon : "pencil"}
          />
        </EditableWrapper>
      );
    } else if (this.props.isEditable) {
      editableComponent = (
        <ButtonPill
          tabIndex={0}
          disablePropagation
          as="span"
          buttonModifiers="navigation-edit-label"
          icon={this.props.editableIcon ? this.props.editableIcon : "pencil"}
          onClick={this.props.editableAction}
        />
      );
    }

    return (
      <li id={this.props.id ? this.props.id : null} className="menu__item">
        <Link
          className={`menu__item-link ${this.props.isActive ? "active" : ""} ${
            this.props.className ? this.props.className : ""
          } ${(modifiers || []).map((s) => `menu__item-link--${s}`).join(" ")}`}
          onScrollToSection={this.props.onScrollToSection}
          scrollPadding={this.props.scrollPadding}
          disableScroll={this.props.disableScroll}
          href={this.props.hash ? "#" + this.props.hash : null}
          to={this.props.href}
          onClick={this.props.onClick}
          ref="element"
        >
          {this.props.icon ? (
            <span
              title={this.props.iconTitle}
              className={`menu__item-link-icon icon-${this.props.icon}`}
              style={{ color: this.props.iconColor }}
            ></span>
          ) : null}
          <span className="menu__item-link-text">{this.props.children}</span>
          {this.props.iconAfter ? (
            <span
              title={this.props.iconAfterTitle}
              className={`menu__item-link-icon icon-${this.props.iconAfter}`}
              style={{ color: this.props.iconAfterColor }}
            ></span>
          ) : null}
          {editableComponent}
        </Link>
      </li>
    );
  }

  /**
   * getElement
   * @returns HTMLElement
   */
  getElement(): HTMLElement {
    return (this.refs["element"] as any).getElement();
  }
}

/**
 * Props for a situation where Dropdown is used as a wrapper
 */
export interface DropdownWrapperProps
  extends Omit<NavigationDropdownProps, "children"> {}

/**
 * NavigationDropdownProps
 */
interface NavigationDropdownProps {
  children: React.ReactNode;
  // So far this only works for announcement categories,
  // generalizing this is a different issue
  tag: GenericTag;
  onDelete: (tag: GenericTag, success?: () => void, fail?: () => void) => void;
  onUpdate: (tag: GenericTag, success?: () => void, fail?: () => void) => void;
  deleteDialogTitle: string;
  deleteDialogContent: string;
  customAction?: {
    title: string;
    content: string;
    label: string;
    icon: string;
    onCustomAction: (
      tag: GenericTag,
      success?: () => void,
      fail?: () => void
    ) => void;
  };

  updateDialogTitle?: string;
  editLabel: string;
  deleteLabel: string;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableCustomAction?: boolean;
}

type NavigationDropdownAction = "edit" | "delete" | "custom";
type DialogOpenType = "edit" | "delete" | "custom" | null;

/**
 * NavigationDropdown component
 * @param props component props
 * @returns JSX.Element
 */
export const NavigationDropdown: React.FC<NavigationDropdownProps> = (
  props
) => {
  const {
    children,
    tag,
    onDelete,
    onUpdate,
    deleteDialogTitle,
    deleteDialogContent,
    customAction,
    editLabel,
    deleteLabel,
    disableEdit,
    disableDelete,
    disableCustomAction,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState<DialogOpenType>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLElement>(null);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!open) return;

    /**
     * handles click outside of dropdown
     * @param e mouse event
     */
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // Check if click is outside both trigger and dropdown
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  /**
   * handleToggleOpen
   * @param e mouse event
   */
  const handleToggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    }

    setOpen(!open);
  };

  /**
   * handleDelete
   * @param tag tag to be deleted
   */
  const handleDelete = (tag: GenericTag) => {
    onDelete(tag);
    setOpenDialog(null);
  };

  /**
   * handleOptions
   * @param e mouse event
   * @param action option action
   */
  const handleOptions = (
    e: React.MouseEvent,
    action: NavigationDropdownAction
  ) => {
    e.preventDefault();
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      if (action === "edit") {
        setOpenDialog("edit");
      } else if (action === "delete") {
        setOpenDialog("delete");
      } else if (action === "custom") {
        setOpenDialog("custom");
      }
      setOpen(false);
    });
  };

  // Clone the children and add our click handler
  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, {
        onClick: handleToggleOpen,
      })
    : children;

  return (
    <>
      <div ref={triggerRef}>{trigger}</div>
      {open &&
        createPortal(
          <nav
            role="menu"
            aria-label={t("wcag.tagOptionMenu", { ns: "common" })}
            aria-hidden={!open}
            ref={dropdownRef}
            className="menu__item-dropdown"
            id="tagDropdownMenu"
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <ul className="menu__item-dropdown-list">
              <li
                className={`menu__item-dropdown-list-item ${disableEdit ? " disabled" : ""}`}
                id="editOption"
                role="menuitem"
                aria-disabled={disableEdit}
                onClick={(e) => !disableEdit && handleOptions(e, "edit")}
              >
                <span className="menu__item-dropdown-icon icon-pencil"></span>
                <span>{editLabel}</span>
              </li>
              {customAction && (
                <li
                  className={`menu__item-dropdown-list-item ${disableCustomAction ? "disabled" : ""}`}
                  id="customActionOption"
                  role="menuitem"
                  aria-disabled={disableCustomAction}
                  onClick={(e) =>
                    !disableCustomAction && handleOptions(e, "custom")
                  }
                >
                  <span
                    className={`menu__item-dropdown-icon icon-${customAction.icon}`}
                  ></span>
                  <span>{customAction.label}</span>
                </li>
              )}
              <li
                className={`menu__item-dropdown-list-item ${disableDelete ? "disabled" : ""}`}
                id="deleteOption"
                role="menuitem"
                aria-disabled={disableDelete}
                onClick={(e) => !disableDelete && handleOptions(e, "delete")}
              >
                <span className="menu__item-dropdown-icon icon-trash"></span>
                <span>{deleteLabel}</span>
              </li>
            </ul>
          </nav>,
          document.body
        )}

      <UpdateDialog
        tag={tag}
        title={props.updateDialogTitle}
        isOpen={openDialog === "edit"}
        onClose={() => setOpenDialog(null)}
        onUpdate={onUpdate}
      >
        <span style={{ display: "none" }} />
      </UpdateDialog>

      <PromptDialog
        title={deleteDialogTitle}
        content={deleteDialogContent}
        onExecute={() => handleDelete(tag)}
        isOpen={openDialog === "delete"}
        onClose={() => setOpenDialog(null)}
      >
        <span style={{ display: "none" }} />
      </PromptDialog>

      {customAction && (
        <PromptDialog
          title={customAction.title}
          content={customAction.content}
          onExecute={() => customAction.onCustomAction(tag)}
          isOpen={openDialog === "custom"}
          onClose={() => setOpenDialog(null)}
        >
          <span style={{ display: "none" }} />
        </PromptDialog>
      )}
    </>
  );
};
