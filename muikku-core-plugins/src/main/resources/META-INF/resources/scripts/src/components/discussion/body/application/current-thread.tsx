import { UserIndexType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType } from "~/reducers/main-function/discussion/discussion-threads";
import { Dispatch, connect } from "react-redux";

interface CurrentThreadProps {
  discussionThreads: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType
}

interface CurrentThreadState {
  
}

class CurrentThread extends React.Component<CurrentThreadProps, CurrentThreadState> {
  render(){
    if (!this.props.discussionThreads.current){
      return null;
    }
    return <div className="application-list application-list__items">{
      "TEST"
    }</div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    discussionThreads: state.discussionThreads,
    userIndex: state.userIndex
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);