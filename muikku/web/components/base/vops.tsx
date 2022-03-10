import * as React from "react";

import "~/sass/elements/vops.scss";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { VOPSDataType } from "~/reducers/main-function/vops";
import { StateType } from "~/reducers";

const MAX_ROW_SIZE = 15;
const CLASS_TRANSLATIONS: {
  states: {
    [key: string]: string;
  };
  mandatorities: {
    [key: string]: string;
  };
} = {
  states: {
    ENROLLED: "enrolled",
    FAILED: "failed",
    PLANNED: "planned",
    MARKED_INCOMPLETE: "incomplete",
    ASSESSED: "passed",
  },
  mandatorities: {
    MANDATORY: "mandatory",
    SCHOOL_LEVEL_OPTIONAL: "optional-school",
    UNSPECIFIED_OPTIONAL: "optional-school",
    NATIONAL_LEVEL_OPTIONAL: "optional-national",
  },
};

/**
 * VopsProps
 */
interface VopsProps {
  data?: VOPSDataType;
  defaultData: VOPSDataType;
  i18n: i18nType;
}

/**
 * VopsState
 */
interface VopsState {
  legendOpened: boolean;
}

/**
 * Vops
 */
class Vops extends React.Component<VopsProps, VopsState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: VopsProps) {
    super(props);

    this.toggleLegend = this.toggleLegend.bind(this);

    this.state = {
      legendOpened: false,
    };
  }
  /**
   * toggleLegend
   */
  toggleLegend() {
    this.setState({
      legendOpened: !this.state.legendOpened,
    });
  }
  /**
   * render
   */
  render() {
    const data = this.props.data || this.props.defaultData;
    if (!data.optedIn) {
      return null;
    }
    return (
      <div className="vops">
        {/*
      <div className="vops__data">
        <span>{this.props.i18n.text.get("plugin.records.studyplan.progress.title.courses.info")}</span>
        <span>{this.props.i18n.text.get("plugin.records.studyplan.progress.title.courses.all", data.numCourses)}</span>
        <span>{this.props.i18n.text.get("plugin.records.studyplan.progress.title.courses.mandatory", data.numMandatoryCourses)}</span>
      </div>
      */}
        <div className="vops__legend-header" onClick={this.toggleLegend}>
          <span
            className={`vops__legend-arrow icon-arrow-${
              this.state.legendOpened ? "up" : "down"
            }`}
          ></span>
          <span className="vops__legend-header-text">
            {this.props.i18n.text.get("plugin.records.studyplan.legend.title")}
          </span>
        </div>
        {this.state.legendOpened ? (
          <div className="vops__legend">
            <div className="vops__legend-topic">
              {this.props.i18n.text.get(
                "plugin.records.studyplan.legend.title.shapes"
              )}
            </div>
            <div className="vops__legend-items">
              <div className="vops__legend-item">
                <div className="vops__item vops__item--mandatory"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.mandatory"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--optional-national"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.optional.national"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--optional-school"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.optional.school"
                  )}
                </div>
              </div>
            </div>
            <div className="vops__legend-topic">
              {this.props.i18n.text.get(
                "plugin.records.studyplan.legend.title.colors"
              )}
            </div>
            <div className="vops__legend-items">
              <div className="vops__legend-item">
                <div className="vops__item"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.neutral"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--incomplete"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.incomplete"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--planned"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.planned"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--passed"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.passed"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--enrolled"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.enrolled"
                  )}
                </div>
              </div>
              <div className="vops__legend-item">
                <div className="vops__item vops__item--failed"></div>
                <div className="vops__legend-item-text">
                  {this.props.i18n.text.get(
                    "plugin.records.studyplan.legend.title.failed"
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="vops__body">
          <div className="vops__table-wrapper">
            <div className="vops__row vops__row--header">
              <div className="vops__row-item vops__row-item--text-primary">
                {this.props.i18n.text.get("plugin.records.title.subject")}
              </div>
              {Array.from(Array(MAX_ROW_SIZE)).map((item, index) => (
                <div
                  className="vops__row-item vops__row-item--text"
                  key={index}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {data.rows.map((row) => (
              <div className="vops__row" key={row.subjectIdentifier}>
                <div className="vops__row-item vops__row-item--text-primary">
                  {row.subject}
                </div>
                {row.items.map((item, index) => {
                  if (item.placeholder) {
                    return (
                      <div
                        className="vops__row-item"
                        key={"PLACEHOLDER" + index}
                      >
                        <div className="vops__item vops__item--placeholder"></div>
                      </div>
                    );
                  }
                  let vopsClassNameSubType = "";
                  if (CLASS_TRANSLATIONS.states[item.state]) {
                    vopsClassNameSubType +=
                      "vops__item--" +
                      CLASS_TRANSLATIONS.states[item.state] +
                      " ";
                  }
                  if (CLASS_TRANSLATIONS.mandatorities[item.mandatority]) {
                    vopsClassNameSubType +=
                      "vops__item--" +
                      CLASS_TRANSLATIONS.mandatorities[item.mandatority];
                  }
                  return (
                    <div className="vops__row-item" key={item.courseNumber}>
                      <div
                        className={`vops__item ${vopsClassNameSubType}`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    defaultData: state.vops && state.vops.value,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Vops);
