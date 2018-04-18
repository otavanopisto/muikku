import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { TranscriptOfRecordLocationType } from '~/reducers/main-function/records/records';
import {StateType} from '~/reducers';

interface NavigationProps {
  i18n: i18nType,
  location: TranscriptOfRecordLocationType
}

interface NavigationState {

}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render() {
    let sections = [
      {
        name: this.props.i18n.text.get("TODO records"),
        isActive: this.props.location === "RECORDS" as TranscriptOfRecordLocationType,
        hash: ""
      },
      {
        name: this.props.i18n.text.get("TODO hops"),
        isActive: this.props.location === "HOPS" as TranscriptOfRecordLocationType,
        hash: "hops"
      },
      {
        name: this.props.i18n.text.get("TODO vops"),
        isActive: this.props.location === "VOPS" as TranscriptOfRecordLocationType,
        hash: "vops"
      }
    ]
    return <select className="item-list item-list--aside-navigation">
      {sections.map((section, index)=>{
        return <option key={index} className="" value={"#" + section.hash}>
          <span className="item-list__icon icon-new-section"></span>
          <span className="item-list__text-body text">
            {section.name}
          </span>
        </option>
      })}
    </select>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    location: state.records.location
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Navigation );