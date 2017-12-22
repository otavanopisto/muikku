import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';

import BodyScrollLoader from '~/components/general/body-scroll-loader';
import SelectableList from '~/components/general/selectable-list';
import { LoadMoreStudentsTriggerType, loadMoreStudents } from '~/actions/main-function/guider/guider-students';
import { GuiderStudentListType, GuiderStudentsStateType, GuiderStudentType } from '~/reducers/main-function/guider/guider-students';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import { UserType } from '~/reducers/main-function/user-index';
import { getName } from '~/util/modifiers';

interface GuiderStudentsProps {
  i18n: i18nType,
  guiderStudentsState: GuiderStudentsStateType,
  guiderStudentsHasMore: boolean,
  loadMoreStudents: LoadMoreStudentsTriggerType,
  guiderStudentsStudents: GuiderStudentListType,
  guiderStudentsCurrent: boolean,
  guiderStudentsSelectedIds: Array<string>
}

interface GuiderStudentsState {
}

class GuiderStudents extends BodyScrollLoader<GuiderStudentsProps, GuiderStudentsState> {
  constructor(props: GuiderStudentsProps){
    super(props);
    
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "guiderStudentsState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "guiderStudentsHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreStudents";
  }

  render(){
    if (this.props.guiderStudentsState === "LOADING"){
      return null;
    } else if (this.props.guiderStudentsState === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.guiderStudentsState.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("TODO it's empty")}</span></div>
    }
    
    return <BodyScrollKeeper hidden={!!this.props.guiderStudentsCurrent}>
      <SelectableList className="application-list" selectModeClassAddition="application-list--select-mode"
        extra={this.props.guiderStudentsState === "LOADING_MORE" ?
          <div className="application-list__item loader-empty"/>
         : null} dataState={this.props.guiderStudentsState}>
      {this.props.guiderStudentsStudents.map((student: GuiderStudentType, index: number)=>{
        let isSelected = this.props.guiderStudentsSelectedIds.includes(student.id);
        return {
          className: "application-list__item",
          onSelect: ()=>{},//this.props.addToGuiderSelectedStudents.bind(null, student),
          onDeselect: ()=>{},//this.props.removeFromGuiderSelectedStudents.bind(null, student),
          onEnter: ()=>{},//this.setCurrentGuiderStudent.bind(this, student),
          isSelected,
          key: student.id,
          contents: (checkbox: React.ReactElement<any>)=>{
            return <div className="application-list__item-content-wrapper message__content">
                <div className="application-list__item-content application-list__item-content--aside">
                  <div className="message__select-container">
                    {checkbox}
                  </div>
                </div>
                <div className="application-list__item-content application-list__item-content--main">
                  <div className="application-list__item-header">
                    {getName(student as any as UserType)}
                  </div>
                </div>    
              </div>
            }
          }
        })
      }
    </SelectableList></BodyScrollKeeper>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderStudentsState: state.guiderStudents.state,
    guiderStudentsHasMore: state.guiderStudents.hasMore,
    guiderStudentsStudents: state.guiderStudents.students,
    guiderStudentsCurrent: state.guiderStudents.current,
    guiderStudentsSelectedIds: state.guiderStudents.selectedIds
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({loadMoreStudents}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(GuiderStudents);