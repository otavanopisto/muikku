import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import "~/sass/elements/form.scss";
import "~/sass/elements/language-profile.scss";
import { filterMatch } from "~/util/modifiers";
import { LanguageData } from "~/@types/shared";
import { useTranslation } from "react-i18next";

/**
 * AddItemProps
 */
interface AddItemProps {
  action: (item: LanguageData | string) => void;
  allItems: LanguageData[];
  selectedItems: LanguageData[];
  filterBy: "name" | "code";
  placeHolder?: string;
}

/**
 * AddItem
 * Component to add a new item to the list
 * @param props the props of the component
 */
const AddItem = (props: AddItemProps) => {
  const { action, selectedItems, filterBy, allItems, placeHolder } = props;
  const [filter, setFilter] = React.useState<string>("");
  const [active, setActive] = React.useState<boolean>(false);
  const { t } = useTranslation(["languageProfile", "common"]);

  /**
   * Clears the input fields and resets the component state.
   * @returns void
   */
  const clearStates = () =>
    unstable_batchedUpdates(() => {
      setActive(false);
      setFilter("");
    });
  /**
   * filterLanguages
   * @param value the value to filter the languages
   */
  const handleFieldChange = (value: string) => {
    setFilter(value);
  };

  /**
   * toggleDropdown toggles the visibility of the dropdown
   * @param visible whether the dropdown should be visible or not
   */
  const toggleDropdown = (visible: boolean) => {
    setActive(visible);
  };

  /**
   * handleAdd
   * @param item the item to add
   */
  const handleAdd = (item: LanguageData) => {
    action(item);
    clearStates();
  };

  /**
   * clearComponent
   */
  const clearComponent = () => {
    clearStates();
  };

  const filteredItems = allItems.filter(
    (item) =>
      filterMatch(item.name, filter) &&
      !selectedItems.some((i) => i[filterBy] === item[filterBy])
  );
  return (
    <div className="language-profile__add-language">
      <div className="language-profile__textfield-container">
        <input
          className="language-profile__input"
          type="text"
          placeholder={placeHolder ? placeHolder : undefined}
          onFocus={() => toggleDropdown(true)}
          onChange={(e) => handleFieldChange(e.target.value)}
          value={filter}
        />
        {active && filter && (
          <div className="language-profile__language-dropdown">
            {filteredItems.length === 0 ? (
              <div
                onClick={clearComponent}
                className="language-profile__dropdown-item"
              >
                {t("content.empty", {
                  context: "languages",
                })}
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.code}
                  className="language-profile__dropdown-item"
                  onClick={() => handleAdd(item)}
                >
                  {item.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItem;
