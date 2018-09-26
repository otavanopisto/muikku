import * as React from "react";
import { StateType } from "reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/panel.scss';



interface StudiesEndedProps {
  i18n: i18nType
}

interface StudiesEndedState {
  
}

class StudiesEnded extends React.Component<StudiesEndedProps, StudiesEndedState> {
  render(){
    return <div className="panel panel--studies-ended rich-text" dangerouslySetInnerHTML={{__html: this.props.i18n.text.get("plugin.frontpage.inactiveStudent.message")}}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudiesEnded);