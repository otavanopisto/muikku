import * as React from "react";
import { createPortal } from "react-dom";
import CategoryUpdateDialog from "../../dialogs/category-update";
import PromptDialog from "~/components/general/prompt-dialog";
import { AnnouncementCategory } from "~/generated/client";
import "~/sass/elements/tag-dropdown.scss";

/**
 * DropdownMenuDemoProps
 */
interface DropdownMenuDemoProps {
  children?: React.ReactNode;
  category: AnnouncementCategory;
  onDelete: (tag: AnnouncementCategory) => void;
  deleteDialogTitle: string;
  deleteDialogContent: string;
}

/**
 * TagDropdown component
 * @param props component props
 * @returns JSX.Element
 */
const TagDropdown: React.FC<DropdownMenuDemoProps> = (props) => {
  const {
    children,
    category,
    onDelete,
    deleteDialogTitle,
    deleteDialogContent,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLElement>(null);

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
   * H
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
  const handleDelete = (tag: AnnouncementCategory) => {
    onDelete(tag);
    setDeleteDialogOpen(false);
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
            ref={dropdownRef}
            className="tag-dropdown"
            style={{
              position: "absolute",
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <ul className="tag-dropdown__list">
              <li
                className="tag-dropdown__item"
                onClick={() => {
                  // Todo handler
                  setEditDialogOpen(true);
                  setOpen(false);
                }}
              >
                <span className="tag-icon icon-pencil"></span>
                <span> Edit Category</span>
              </li>
              <li
                className="tag-dropdown__item"
                onClick={() => {
                  // Todo handler
                  setDeleteDialogOpen(true);
                  setOpen(false);
                }}
              >
                <span className="tag-icon icon-trash"></span>
                <span> Remove Category</span>
              </li>
            </ul>
          </nav>,
          document.body
        )}

      <CategoryUpdateDialog
        category={category}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      >
        <span style={{ display: "none" }} />
      </CategoryUpdateDialog>

      <PromptDialog
        title={deleteDialogTitle}
        content={deleteDialogContent}
        onExecute={() => handleDelete(category)}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <span style={{ display: "none" }} />
      </PromptDialog>
    </>
  );
};

export default TagDropdown;
