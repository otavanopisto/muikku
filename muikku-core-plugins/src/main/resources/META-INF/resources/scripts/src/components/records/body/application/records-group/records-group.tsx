import * as React from "react";
import { AnyActionType } from "~/actions";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { StateType } from "~/reducers";
import { RecordWorkspaceActivitiesWithLineCategory } from "~/reducers/main-function/records";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import RecordsGroupItem from "./records-group-item";
import TransferedCreditIndicator from "../records-indicators/transfered-credit-indicator";

/**
 * RecordsListProps
 */
interface RecordsGroupProps {
  recordGroup: RecordWorkspaceActivitiesWithLineCategory;
  i18n: i18nType;
}

/**
 * RecordsListItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroup: React.FC<RecordsGroupProps> = (props) => {
  const { recordGroup } = props;

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
            <span>{props.i18n.text.get("plugin.records.courses.empty")}</span>
          </div>
        </div>
      </ApplicationList>
    );
  }

  return (
    <ApplicationList>
      <div
        onClick={handleWorkspaceSortDirectionClick}
        className="application-list__header-container application-list__header-container--sorter"
      >
        <h3 className="application-list__header application-list__header--sorter">
          {recordGroup.lineCategory}
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
          <div className="application-list__header-container application-list__header-container--sorter">
            <h3 className="application-list__header application-list__header--sorter">
              Hyväksiluvut
            </h3>
          </div>
          {recordGroup.transferCredits.map((credit, i) => (
            <ApplicationListItem
              className="course course--credits"
              key={`tranfer-credit-${i}`}
            >
              <ApplicationListItemHeader modifiers="course">
                <span className="application-list__header-icon icon-books"></span>
                <span className="application-list__header-primary">
                  {credit.activity.name}

                  <div
                    style={{
                      display: "flex",
                      flexBasis: "100%",
                      fontSize: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "2px 5px 0 0",
                        fontStyle: "italic",
                        fontWeight: "lighter",
                      }}
                    >
                      {credit.lineName}
                    </div>
                    {credit.activity.curriculums.map((curriculum) => (
                      <div
                        key={curriculum.identifier}
                        style={{
                          padding: "2px 5px 0 0",
                          fontStyle: "italic",
                          fontWeight: "lighter",
                        }}
                      >
                        {curriculum.name}{" "}
                      </div>
                    ))}
                  </div>
                </span>
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RecordsGroup);
