import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
// import { MatriculationLink } from './matriculation-link';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';

import '~/sass/elements/message.scss';
import { RecordsType } from '~/reducers/main-function/records';
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
    
    return <VopsGraph />;
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