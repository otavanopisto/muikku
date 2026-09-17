import * as React from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import { ButtonPill } from "~/components/general/button";
import {
  EventSortBy,
  EventSortOrder,
} from "~/components/general/events/hooks/useEventListSort";
import "~/sass/elements/items-sorter.scss";
import "~/sass/elements/buttons.scss";

/**
 * EventListSortersProps
 */
interface EventListSortersProps {
  sortBy: EventSortBy;
  sortOrder: EventSortOrder;
  onSort: (sortBy: EventSortBy, sortOrder: EventSortOrder) => void;
  modifier?: string;
}

/**
 * Date and title sorters for an event list.
 * @param props props
 * @returns JSX.Element
 */
const EventListSorters: React.FC<EventListSortersProps> = (props) => {
  const { sortBy, sortOrder, onSort, modifier } = props;
  const { t } = useTranslation(["events", "common"]);

  /**
   * Builds selected class depending of if the sorter is active
   * @param by by
   * @param order order
   * @returns selected class name or empty string
   */
  const buildSorterClass = (by: EventSortBy, order: EventSortOrder) =>
    sortBy === by && sortOrder === order ? "sorter-selected" : "";

  return (
    <div
      className={`items-sorter items-sorter--header ${modifier && `items-sorter--${modifier}`}`}
    >
      <Dropdown
        openByHover
        key="date-asc"
        content={t("labels.sortAscending", {
          ns: "events",
          context: "date",
        })}
      >
        <ButtonPill
          aria-label={t("labels.sortAscending", {
            ns: "events",
            context: "date",
          })}
          onClick={() => onSort("start", "asc")}
          buttonModifiers={["sorter", buildSorterClass("start", "asc")].filter(
            Boolean
          )}
          icon="sort-amount-asc"
        />
      </Dropdown>

      <Dropdown
        openByHover
        key="date-desc"
        content={t("labels.sortDescending", {
          ns: "events",
          context: "date",
        })}
      >
        <ButtonPill
          aria-label={t("labels.sortDescending", {
            ns: "events",
            context: "date",
          })}
          onClick={() => onSort("start", "desc")}
          buttonModifiers={["sorter", buildSorterClass("start", "desc")].filter(
            Boolean
          )}
          icon="sort-amount-desc"
        />
      </Dropdown>

      <Dropdown
        openByHover
        key="title-asc"
        content={t("labels.sortAscending", {
          ns: "events",
          context: "title",
        })}
      >
        <ButtonPill
          aria-label={t("labels.sortAscending", {
            ns: "events",
            context: "title",
          })}
          onClick={() => onSort("title", "asc")}
          buttonModifiers={["sorter", buildSorterClass("title", "asc")].filter(
            Boolean
          )}
          icon="sort-alpha-asc"
        />
      </Dropdown>

      <Dropdown
        openByHover
        key="title-desc"
        content={t("labels.sortDescending", {
          ns: "events",
          context: "title",
        })}
      >
        <ButtonPill
          aria-label={t("labels.sortDescending", {
            ns: "events",
            context: "title",
          })}
          onClick={() => onSort("title", "desc")}
          buttonModifiers={["sorter", buildSorterClass("title", "desc")].filter(
            Boolean
          )}
          icon="sort-alpha-desc"
        />
      </Dropdown>
    </div>
  );
};

export default EventListSorters;
