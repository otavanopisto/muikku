import * as React from "react";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import RecordsGroupItem from "./records-group-item";
import { useTranslation } from "react-i18next";
import "~/sass/elements/label.scss";
import TransferedCreditIndicator from "./transfered-credit-indicator";
import { RecordWorkspaceActivitiesWithLineCategory } from "./types";

/**
 * RecordsListProps
 */
interface RecordsGroupProps {
  recordGroup: RecordWorkspaceActivitiesWithLineCategory;
}

/**
 * RecordsListItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroup: React.FC<RecordsGroupProps> = (props) => {
  const { recordGroup } = props;
  const { t } = useTranslation(["studies", "common"]);

  const [creditSortDirection, setWorkspaceSortDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  /**
   * sortWorkspaces
   */
  const handleWorkspaceSortDirectionClick = () => {
    setWorkspaceSortDirection((oldValue) =>
      oldValue === "asc" ? "desc" : "asc"
    );
  };

  /**
   * handleWorkspaceSortDirectionKeyUp
   * @param e e
   */
  const handleWorkspaceSortDirectionKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setWorkspaceSortDirection((oldValue) =>
        oldValue === "asc" ? "desc" : "asc"
      );
    }
  };

  /**
   * handlePreventDefault
   * @param e e
   */
  const handlePreventDefault = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  };

  const sortedCredits = recordGroup.credits.sort((a, b) => {
    const aString = a.activity.name.toLowerCase();
    const bString = b.activity.name.toLowerCase();

    if (aString > bString) {
      return creditSortDirection === "asc" ? 1 : -1;
    }
    if (aString < bString) {
      return creditSortDirection === "asc" ? -1 : 1;
    }
    return 0;
  });

  if (sortedCredits.length + recordGroup.transferCredits.length <= 0) {
    return (
      <ApplicationList>
        <div className="application-list__header-container application-list__header-container--sorter">
          <h3 className="application-list__header application-list__header--sorter">
            {recordGroup.lineCategory}
          </h3>
        </div>
        <div className="application-sub-panel__item">
          <div className="empty">
            <span>
              {t("content.empty", { ns: "studies", context: "workspaces" })}
            </span>
          </div>
        </div>
      </ApplicationList>
    );
  }

  let categoryName = recordGroup.lineCategory;

  if (recordGroup.showCredits) {
    categoryName += ` - ${t("labels.courseCredits", {
      ns: "studies",
      mandatoryCredits: recordGroup.mandatoryCourseCredits,
      totalCredits: recordGroup.completedCourseCredits,
    })}`;
  }

  return (
    <ApplicationList>
      <div
        tabIndex={0}
        onClick={handleWorkspaceSortDirectionClick}
        onKeyUp={handleWorkspaceSortDirectionKeyUp}
        onKeyDown={handlePreventDefault}
        className="application-list__header-container application-list__header-container--sorter"
      >
        <h3 className="application-list__header application-list__header--sorter">
          {categoryName}
        </h3>
        <div className={`icon-sort-alpha-${creditSortDirection}`}></div>
      </div>
      {sortedCredits.length
        ? sortedCredits.map((credit, i) => {
            // By default every workspace is not combination
            let isCombinationWorkspace = false;

            if (credit.activity.subjects) {
              // If assessmentState contains more than 1 items, then its is combination
              isCombinationWorkspace = credit.activity.subjects.length > 1;
            }

            return (
              <RecordsGroupItem
                key={`credit-item-${i}`}
                credit={credit}
                isCombinationWorkspace={isCombinationWorkspace}
              />
            );
          })
        : null}

      {recordGroup.transferCredits.length ? (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">Hyväksiluvut</h3>
          </div>
          {recordGroup.transferCredits.map((credit, i) => (
            <ApplicationListItem
              className="course course--credits"
              key={`tranfer-credit-${i}`}
            >
              <ApplicationListItemHeader modifiers="course">
                <span className="application-list__header-icon icon-books"></span>
                <div className="application-list__header-primary">
                  <div className="application-list__header-primary-title">
                    {credit.activity.name}
                  </div>

                  <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
                    <div className="label">
                      <div className="label__text">{credit.lineName}</div>
                    </div>
                    {credit.activity.curriculums.map((curriculum) => (
                      <div key={curriculum.identifier} className="label">
                        <div className="label__text">{curriculum.name} </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="application-list__header-secondary">
                  <TransferedCreditIndicator transferCredit={credit.activity} />
                </div>
              </ApplicationListItemHeader>
            </ApplicationListItem>
          ))}
        </>
      ) : null}
    </ApplicationList>
  );
};

export default RecordsGroup;
