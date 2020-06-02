import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';

import '~/sass/elements/message.scss';
import { RecordsType } from '~/reducers/main-function/records';
import HopsGraph from '~/components/base/hops_editable';
import { SetHopsToTriggerType, setHopsTo } from "~/actions/main-function/hops";
import { bindActionCreators } from "redux";
import { HOPSDataType } from '~/reducers/main-function/hops';
import {StateType} from '~/reducers';

interface HopsProps {
  i18n: i18nType,
  records: RecordsType,
  hops: any,
  setHopsTo: SetHopsToTriggerType
}

interface HopsState {
}

class Hops extends React.Component<HopsProps, HopsState> {
  timeout: number;
  constructor(props: HopsProps){
    super(props);
    
    this.setHopsToWithDelay = this.setHopsToWithDelay.bind(this);
  }
  setHopsToWithDelay(hops: HOPSDataType){
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.props.setHopsTo.bind(null, hops), 500);
  }
  render(){
    if (this.props.records.location !== "hops"){
      return null;
    } else if (this.props.hops.status === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.hops.status !== "READY"){
      return null;
    }
    
    return <HopsGraph onHopsChange={this.setHopsToWithDelay}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: (state as any).records,
    hops: state.hops
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({setHopsTo}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hops);