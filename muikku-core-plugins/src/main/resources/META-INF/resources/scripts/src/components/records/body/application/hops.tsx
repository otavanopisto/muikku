import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';
import { RecordsType } from '~/reducers/main-function/records/records';
import HopsGraph from '~/components/base/hops';

interface HopsProps {
  i18n: i18nType,
  records: RecordsType,
  hops: any
}

interface HopsState {
}

class Hops extends React.Component<HopsProps, HopsState> {
  render(){
    if (this.props.records.location !== "HOPS"){
      return null;
    } else if (this.props.hops.status === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.hops.status !== "READY"){
      return null;
    }
    
    return <HopsGraph editable/>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    records: state.records,
    hops: state.hops
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Hops);