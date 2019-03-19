import * as React from 'react';
import '~/sass/elements/summary.scss';
import Link from './link';
import {i18nType} from '~/reducers/base/i18n';

interface BasicSummaryItemType {
  className?: string | number,
  pre?: string | number,
  body: string | number,
  post?: string | number
}

interface BasicSummaryItem {
  item: BasicSummaryItemType
}

interface BasicSummaryProps {
  className?: string, 
  title? : string,
  summaryItems? : Array<BasicSummaryItemType>
}

interface BasicSummaryState {
}

export default class BasicSummary extends React.Component<BasicSummaryProps, BasicSummaryState> {
  render(){
    return (
        <div className={`summary ${this.props.className ? "summary--" + this.props.className : ""}`} >
          <div className="summary__header">{this.props.title}</div>
          <div className="summary__body">
            {this.props.summaryItems.map((summaryItem, index) => 
              <span className="summary__item-container" key={index}>
                <span className={`summary__item-highlight ${summaryItem.className ? "summary__item-highlight--" + summaryItem.className: ""}`}>{summaryItem.body}</span>
                <span className="summary__item-definition">{summaryItem.post}</span>
              </span>
            )}
  
          </div>
        </div>
    )
  }
}
