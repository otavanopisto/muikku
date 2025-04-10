import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/language-profile.scss";
import { filterMatch } from "~/util/modifiers";
import { LanguageData } from "~/@types/shared";

interface AddBaseProps {
  action: (item: LanguageData | string) => void;
  allItems: LanguageData[];
  selectedItems: LanguageData[];
}

const AddBase = (props: AddBaseProps) => {
  const { action, selectedItems, allItems } = props;
  const [filter, setFilter] = React.useState<string>("");
  const [active, setActive] = React.useState<boolean>(false);

  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * filterLanguages
   * @param value the value to filter the languages
   */
  const handleFieldChange = (value: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setFilter(value);
    }, 400);
  };

  const toggleDropdown = (visible: boolean) => {
    setActive(visible);
  };

  /**
   * handleAdd
   * @param item the item to add
   */
  const handleAdd = (item: LanguageData) => {
    action(item);
    setActive(false);
  };

  return (
    <div className="language-profile__add-language">
      <input
        className="language-profile__filter-input form-element__input form-element__input--search"
        type="text"
        placeholder="TODO: Add a language"
        onFocus={() => toggleDropdown(true)}
        onChange={(e) => handleFieldChange(e.target.value)}
      />
      {active && filter && (
        <div className="language-profile__language-dropdown">
          {allItems
            .filter((item) => filterMatch(item.name, filter))
            .filter((item) => !selectedItems.some((i) => i.code === item.code))
            .map((item) => (
              <div
                key={item.code}
                className="language-profile__dropdown-item"
                onClick={() => handleAdd(item)}
              >
                {item.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AddBase;
