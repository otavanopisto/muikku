import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
// import { MatriculationLink } from './matriculation-link';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/application-list.scss';
import { RecordsType } from '~/reducers/main-function/records/records';
import { VOPSType } from '~/reducers/main-function/vops';
import VopsGraph from '~/components/base/vops';
import {StateType} from '~/reducers';

interface VopsProps {
  i18n: i18nType,
  records: RecordsType,
  vops: VOPSType
}

interface VopsState {
}

class Vops extends React.Component<VopsProps, VopsState> {
  render(){
    if (this.props.records.location !== "vops"){
      return null;
    } else if (this.props.vops.status === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.vops.status !== "READY"){
      return null;
    }
    return <div>
      <div className="application-panel__header-title">{this.props.i18n.text.get("plugin.records.vops.title")}</div>
    
    {/* 
      <div className="application-sub-panel">
        <div className="application-sub-panel__body application-sub-panel__body--studies-yo-cards">
          <div className="application-sub-panel__item application-sub-panel__item--summarizer">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.vops.mandatory.title")}</div>
            <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--total">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.mandatory")}</span>
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--done">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.done")}</span>
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--undone">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.planned")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="application-sub-panel">
        <div className="application-sub-panel__body application-sub-panel__body--studies-yo-cards">
          <div className="application-sub-panel__item application-sub-panel__item--summarizer">
            <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.vops.optional.title")}</div>
            <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--total">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.optional")}</span>
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--done">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.done")}</span>
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--undone">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.planned")}</span>
            </div>
          </div>
        </div>
      </div>
    */}  
      <VopsGraph/>
{/*
      <div className="application-sub-panel">
        <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.records.yo.plannedWorkspaces.title")}</div>
        <div className="application-sub-panel__body application-list">
          <div className="application-list__item course">
            <div className="application-list__item-header application-list__item-header--course">
              <span className="application-list__header-icon icon-books"></span>
              <span className="application-list__header-primary">Gur- gurzi 4</span>
              <span className="application-list__header-secondary">Toissijainen</span>
            </div>
          </div>
          <div className="application-list__item course">
            <div className="application-list__item-header  application-list__item-header--course">
              <span className="application-list__header-icon icon-books"></span>
              <span className="application-list__header-primary">Gur- gurzi 5</span>
              <span className="application-list__header-secondary">Toissijainen</span>
            </div>
          </div>
        </div>
      </div>
*/}
    </div>   
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: state.records,
    vops: state.vops
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vops);