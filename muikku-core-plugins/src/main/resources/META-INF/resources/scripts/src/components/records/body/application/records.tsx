import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';
import { RecordsType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';

interface RecordsProps {
  i18n: i18nType,
  records: RecordsType
}

interface RecordsState {
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
  }

  render(){
    if (this.props.records.userDataStatus === "LOADING"){
      return null;
    } else if (this.props.records.userDataStatus === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    }
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "RECORDS" || !!this.props.records.current}>
    </BodyScrollKeeper>
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
)(Records);