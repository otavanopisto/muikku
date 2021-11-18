import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/study-info.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import Avatar from "~/components/general/avatar";

/**
 * RecordsProps
 */
interface StudyInfoProps {
  i18n: i18nType;
}

/**
 * RecordsState
 */
interface StudyInfoState {
  sortDirectionWorkspaces?: string;
  sortDirectionRecords?: string;
  sortedWorkspaces?: any;
  sortedRecords?: any;
}

/**
 * Records
 */
class StudyInfo extends React.Component<StudyInfoProps, StudyInfoState> {
  constructor(props: StudyInfoProps) {
    super(props);

    this.state = {};
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="study-info">
        <h1>Opintojen tiedot</h1>
        <div className="studies-info__section">
          <div className="basic-info">
            <div className="basic-info-header">
              <div className="basic-info-header-info-text">
                Opinto-oikeuden päättymispäivä
              </div>
              <div className="basic-info-header-info-date">27.02.2051</div>
            </div>
            <div className="basic-info-content">
              <div className="basic-info-content-data">
                <div className="basic-info-content-data-asessor-avatar">
                  <Avatar id={1} firstName="Eka" hasImage={false} />
                </div>
                <div className="basic-info-content-data-asessor-info">
                  <div className="basic-info-content-data-asessor-info-container">
                    <div className="basic-info-content-data-asessor-info-row basic-info-content-data-asessor-info-row--asessor-name">
                      Eka Vekara
                    </div>
                    <div className="basic-info-content-data-asessor-info-row">
                      Sähköposti
                    </div>
                    <div className="basic-info-content-data-asessor-info-row">
                      Puhelinnumero
                    </div>
                    <div className="basic-info-content-data-asessor-info-row">
                      <Button>Lähetä viesti</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="study-options">
            <h1 style={{ width: "100%", textAlign: "center" }}>ASETUKSET</h1>
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
export default connect(mapStateToProps, mapDispatchToProps)(StudyInfo);
