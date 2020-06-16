import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { TranscriptOfRecordLocationType } from '~/reducers/main-function/records';
import {StateType} from '~/reducers';

interface NavigationProps {
  i18n: i18nType,
  location: TranscriptOfRecordLocationType
}

interface NavigationState {

}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render() {

    return <div className="item-list item-list--aside-navigation"></div>
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
