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
        {/* <div className="studies-records__section studies-records__section--latest-excercise-evaluations">
          <h2 className="studies-records__section-header">
            Viimeisimmät tehtävä arvioinnit
          </h2>
          <div className="studies-records__section-content">
            <div className="studies-records__section-content-filters">
              <h1>FILTTERIT</h1>
            </div>
            <div className="studies-records__section-content-course-list">
              {Array.from(Array(5)).map((item, index) => (
                <div className="course-list__item">
                  <div className="course-list__item-header">
                    <div className="course-list__item-header-name">
                      Matikka 1. Kaavat ja laskut
                    </div>
                    <div className="course-list__item-header-evaluation-date">
                      9.11.2021 - Tehtävä {index + 1}
                    </div>
                  </div>
                  <div className="course-list__item-content">
                    <div className="course-list__item-content-asessor">
                      <Avatar hasImage={false} id={1} firstName="Eka" />
                      <div className="course-list__item-content-asessor-info">
                        <h3>Nimi</h3>
                        <span>Titteli</span>
                      </div>
                    </div>
                    <div className="course-list__item-content-data">
                      <div className="course-list__item-content-data-grade">
                        arvosana
                      </div>
                      <div className="course-list__item-content-data-functions">
                        <Button style={{ backgroundColor: "#009FE3" }}>
                          Arviointi
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        <div className="studies-records__section studies-records__section--latest-excercise-evaluations">
          <h2 className="studies-records__section-header">Kurssisuoritukset</h2>
          <div className="studies-records__section-content">
            <div className="studies-records__section-content-filters">
              <h1>FILTTERIT</h1>
            </div>
            <div className="studies-records__section-content-course-list">
              <h1>KURSSILISTA</h1>
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
