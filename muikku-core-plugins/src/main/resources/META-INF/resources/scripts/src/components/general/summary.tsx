import * as React from 'react';

import '~/sass/elements/buttons.scss';
import Link from './link';
import {i18nType} from '~/reducers/base/i18n';

interface SummaryItemType {
  pre: string,
  body: string,
  post: string
}

interface SummaryItem {
  item: SummaryItemType
}

interface SummaryProps {
  title? : string,  //{this.props.i18n.text.get("plugin.records.vops.mandatory.title")}
  i18n : i18nType,
  numMandatoryCourses : number
  summaryItems : Array<SummaryItem> 
}

interface SummaryState {
}

export default class BasicSummary extends React.Component<SummaryProps, SummaryState> {
  
  render(){
    return (
        <div className="application-sub-panel">
        <div className="application-sub-panel__body application-sub-panel__body--studies-yo-cards">
          <div className="application-sub-panel__item application-sub-panel__item--summarizer">
            <div className="application-sub-panel__header">{this.props.title}</div>
            <div className="application-sub-panel__item-body application-sub-panel__item-body--summarizer">
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--total">{this.props.numMandatoryCourses}</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.mandatory")}</span>
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--done">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.done")}</span>
              <span className="application-sub-panel__summary-highlight application-sub-panel__summary-highlight--undone">23</span>
              <span className="application-sub-panel__summary-definition">{this.props.i18n.text.get("plugin.records.vops.subject.courses.planned")}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
