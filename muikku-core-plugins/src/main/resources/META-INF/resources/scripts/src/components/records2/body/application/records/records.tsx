import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/records.scss";
import {
  RecordsType,
  TransferCreditType,
} from "~/reducers/main-function/records";
import { StateType } from "~/reducers";
import Button from "../../../../general/button";
import Avatar from "~/components/general/avatar";
import { RecordsList, RecordsListItem } from "./records-list";
import { recordsMock } from "../mocks/mocks";

/**
 * RecordsProps
 */
interface RecordsProps {
  i18n: i18nType;
  records: RecordsType;
}

/**
 * RecordsState
 */
interface RecordsState {
  sortDirectionWorkspaces?: string;
  sortDirectionRecords?: string;
  sortedWorkspaces?: any;
  sortedRecords?: any;
}

/**
 * Records
 */
class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps) {
    super(props);

    this.state = {};
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="records">
        <h1>Opintosuoritukset</h1>
        <div className="studies-records__section studies-records__section--subject-evaluations">
          <h2 className="studies-records__section-header">Kurssisuoritukset</h2>
          <div className="studies-records__section-content">
            <div className="studies-records__section-content-filters">
              <h1>FILTTERIT</h1>
            </div>
            <div className="studies-records__section-content-subject-list">
              {recordsMock.map((rItem, index) => (
                <RecordsList
                  key={index}
                  name={rItem.name}
                  courseCount={rItem.courses.length + 1}
                >
                  <div className="studies-records__section-content-course-list-item .studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell">
                      <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                        Nimi
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell .studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Suorituspvm
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell .studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Arvioija
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell .studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Tehtävät
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell .studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Status
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell .studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Arvosana
                      </div>
                    </div>
                  </div>
                  {rItem.courses.map((cItem, index) => (
                    <RecordsListItem
                      key={index}
                      userEntityId={0}
                      index={index}
                      {...cItem}
                    />
                  ))}

                  <div className="studies-records__divider studies-records__divider--transparent" />
                </RecordsList>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Records);
