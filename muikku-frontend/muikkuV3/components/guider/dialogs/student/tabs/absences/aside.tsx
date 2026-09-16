import * as React from "react";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { useTranslation } from "react-i18next";
import { EventFilter } from "~/components/general/events/hooks/useAbsenceEventFilter";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps {
  setEventFilter: (filter: EventFilter) => void;
  activeFilters: EventFilter[];
}

/**
 * NavigationAside
 * @param props props
 */
const NavigationAside = (props: NavigationAsideProps) => {
  const { t } = useTranslation(["events"]);
  const { setEventFilter, activeFilters } = props;
  return (
    <Navigation>
      <NavigationTopic name={t("labels.absences", { ns: "events" })}>
        <NavigationElement
          isActive={activeFilters.includes("WITH_REASON")}
          onClick={() => setEventFilter("WITH_REASON")}
        >
          {t("filters.WITH_REASON", { ns: "events" })}
        </NavigationElement>
        <NavigationElement
          isActive={activeFilters.includes("WITHOUT_REASON")}
          onClick={() => setEventFilter("WITHOUT_REASON")}
        >
          {t("filters.WITHOUT_REASON", { ns: "events" })}
        </NavigationElement>
      </NavigationTopic>
    </Navigation>
  );
};

export default NavigationAside;
