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
import {
  RecordsList,
  RecordsListItem,
  RecordSubject,
  RecordSubjectCourse,
} from "./records-list";
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

  filterOnGoingStatusCourses = (records: RecordSubject[]) => {
    const ongoingList: RecordSubjectCourse[] = [];

    records.map((rItem) => {
      rItem.courses.map((cItem) => {
        if (cItem.status === "ONGOING") {
          ongoingList.push(cItem);
        }
      });
    });

    return ongoingList;
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const ongoingList = this.filterOnGoingStatusCourses(recordsMock);

    return (
      <div className="records">
        <h1>Opintosuoritukset</h1>
        <div className="studies-records__section studies-records__section--subject-evaluations">
          <div className="studies-records__section-content">
            <div className="studies-records__section-content-filters">
              <div
                style={{
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "5px",
                  }}
                >
                  <label>Arviointiaika (alk):</label>
                  <input type="date" />
                </div>
                <div>-</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "5px",
                  }}
                >
                  <label>Arviointiaika (lop):</label>
                  <input type="date" />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "5px",
                  }}
                >
                  <label>Ryhmä:</label>
                  <select>
                    <option>Kaikki</option>
                    <option>Työnalla</option>
                    <optgroup label="Oppiaine">
                      <option>Äidinkieli</option>
                      <option>Matematiikka</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <label>Haku:</label>
                  <input />
                </div>
              </div>
            </div>
            <div className="studies-records__section-content-subject-list">
              <RecordsList
                key="ongoing"
                name="Työnalla"
                courseCount={ongoingList.length}
                studiesListType="ongoing"
              >
                <div className="studies-records__section-content-course-list-item studies-records__section-content-course-list-item--header">
                  <div className="studies-records__section-content-course-list-item-cell">
                    <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                      Nimi
                    </div>
                  </div>
                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Suorituspvm
                    </div>
                  </div>
                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Arvioija / Opettaja
                    </div>
                  </div>

                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Arvosana
                    </div>
                  </div>
                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Tehtävät
                    </div>
                  </div>
                </div>
                {ongoingList.map((cItem, index) => (
                  <RecordsListItem
                    key={index}
                    userEntityId={4}
                    courseName={`${cItem.name} (${cItem.subjectCode})`}
                    index={index}
                    {...cItem}
                  />
                ))}
              </RecordsList>

              {recordsMock.map((rItem, index) => (
                <RecordsList
                  key={index}
                  name={rItem.name}
                  courseCount={rItem.courses.length}
                  studiesListType="normal"
                >
                  <div className="studies-records__section-content-course-list-item studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell">
                      <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                        Nimi
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Suorituspvm
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Arvioija / Opettaja
                      </div>
                    </div>

                    <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Arvosana
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Tehtävät
                      </div>
                    </div>
                  </div>
                  {rItem.courses.map((cItem, index) => {
                    if (cItem.status === "ONGOING") {
                      return;
                    }

                    return (
                      <RecordsListItem
                        key={index}
                        userEntityId={4}
                        courseName={cItem.name}
                        index={index}
                        {...cItem}
                      />
                    );
                  })}
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
