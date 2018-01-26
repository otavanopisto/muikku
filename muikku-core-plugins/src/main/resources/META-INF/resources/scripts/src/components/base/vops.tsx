import { GuiderVOPSDataType } from "reducers/main-function/guider/guider-students";
import * as React from "react";

import '~/sass/elements/vops.scss';
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";

const MAX_ROW_SIZE = 15;
const CLASS_TRANSLATIONS:{
  states: {
    [key: string]: string
  },
  mandatorities: {
    [key: string]: string
  }
} = {
  states: {
    ENROLLED: "enrolled",
    FAILED: "failed",
    PLANNED: "planned",
    MARKED_INCOMPLETE: "incomplete",
    ASSESSED: "passed"
  },
  mandatorities: {
    MANDATORY: "mandatory",
    SCHOOL_LEVEL_OPTIONAL: "optional-school",
    UNSPECIFIED_OPTIONAL: "optional-school",
    NATIONAL_LEVEL_OPTIONAL: "optional-national"
  }
}

interface VopsProps {
  data: GuiderVOPSDataType,
  i18n: i18nType
}

interface VopsState {
  legendOpened: boolean
}

class Vops extends React.Component<VopsProps, VopsState> {
  constructor(props: VopsProps){
    super(props);
    
    this.toggleLegend = this.toggleLegend.bind(this);
    
    this.state = {
      legendOpened: false
    }
  }
  toggleLegend(){
    this.setState({
      legendOpened: !this.state.legendOpened
    });
  }
  render(){
    if (!this.props.data.optedIn){
      return null;
    }
    return <div className="vops">
      <div className="vops-title">{this.props.i18n.text.get("plugin.records.studyplan.title")}</div>
      <div className="vops-legend-header">
        <span className={`vops-legend-arrow icon-arrow-${this.state.legendOpened ? "up" : "down"}`} onClick={this.toggleLegend}></span>
        <span className="vops-legend-header-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title")}</span>
      </div>
      {this.state.legendOpened ? <div className="vops-legend">
        <div className="vops-legend-topic">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.shapes")}</div>
        <div className="vops-legend-items">
          <div className="vops-legend-item">
            <div className="vops-item vops-item--mandatory"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.mandatory")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--optional-national"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.optional.national")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--optional-school"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.optional.school")}</div>
          </div>
        </div>
        <div className="vops-legend-topic">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.colors")}</div>
        <div className="vops-legend-items">
          <div className="vops-legend-item">
            <div className="vops-item"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.neutral")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--incomplete"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.incomplete")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--planned"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.planned")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--passed"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.passed")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--enrolled"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.enrolled")}</div>
          </div>
          <div className="vops-legend-item">
            <div className="vops-item vops-item--failed"></div>
            <div className="vops-legend-item-text">{this.props.i18n.text.get("plugin.records.studyplan.legend.title.failed")}</div>
          </div>
        </div>
      </div> : null}
      <div className="vops-data">
        <span>{this.props.i18n.text.get("plugin.records.studyplan.progress.title.courses.info")}</span>&nbsp;
        <span>{this.props.i18n.text.get("plugin.records.studyplan.progress.title.courses.all", this.props.data.numCourses)}</span>&nbsp;
        <span>{this.props.i18n.text.get("plugin.records.studyplan.progress.title.courses.mandatory", this.props.data.numMandatoryCourses)}</span>
      </div>
      <div className="vops-body">
        <div className="vops-table-wrapper">
          <div className="vops-row vops-row--header">
            <div className="vops-row-item vops-row-item--text-primary">{this.props.i18n.text.get("plugin.records.title.subject")}</div>
            {Array.from(Array(MAX_ROW_SIZE)).map((item, index)=>{
              return <div className="vops-row-item vops-row-item--text" key={index}>{index + 1}</div>
            })}
          </div>
          {this.props.data.rows.map((row)=>{
            return <div className="vops-row" key={row.subjectIdentifier}>
              <div className="vops-row-item vops-row-item--text-primary">
                {row.subject}
              </div>
              {row.items.map((item)=>{
                if (item.placeholder){
                  return <div className="vops-row-item" key={item.courseNumber}><div className="vops-item vops-item--placeholder"></div></div>;
                }
              
                let vopsClassNameSubType = "";
                if (CLASS_TRANSLATIONS.states[item.state]){
                  vopsClassNameSubType += "vops-item--" + CLASS_TRANSLATIONS.states[item.state] + " ";
                }
                if (CLASS_TRANSLATIONS.mandatorities[item.mandatority]){
                  vopsClassNameSubType += "vops-item--" + CLASS_TRANSLATIONS.mandatorities[item.mandatority];
                }
                return <div className="vops-row-item" key={item.courseNumber}>
                  <div className={`vops-item ${vopsClassNameSubType}`}></div>
                </div>
              })}
            </div>
          })}
        </div>
      </div>
    </div>
  }
}
            
function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Vops);