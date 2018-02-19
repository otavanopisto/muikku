import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import { RecordsType } from '~/reducers/main-function/records/records';

interface CurrentRecordProps {
  i18n: i18nType,
  records: RecordsType
}

interface CurrentRecordState {
}

class CurrentRecord extends React.Component<CurrentRecordProps, CurrentRecordState> {
  constructor(props: CurrentRecordProps){
    super(props);
  }
  
  render(){
    if (this.props.records.location !== "RECORDS" || !this.props.records.current){
      return null;
    } else if (this.props.records.currentStatus === "LOADING"){
      return null;
    }
    return <div className="application-list">
      TODO
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    records: state.records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentRecord);