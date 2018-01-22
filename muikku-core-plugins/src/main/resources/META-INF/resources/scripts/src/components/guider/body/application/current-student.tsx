import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import { GuiderCurrentStudentStateType, GuiderStudentUserProfileType, GuiderStudentUserProfileLabelType } from '~/reducers/main-function/guider/guider-students';
import { getUserImageUrl, getName } from '~/util/modifiers';

interface CurrentStudentProps {
  i18n: i18nType,
  guiderStudentsCurrent: GuiderStudentUserProfileType,
  guiderCurrentState: GuiderCurrentStudentStateType
}

interface CurrentStudentState {
}

class CurrentStudent extends React.Component<CurrentStudentProps, CurrentStudentState> {
  constructor(props: CurrentStudentProps){
    super(props);
  }
  render(){
    if (this.props.guiderStudentsCurrent === null){
      return null;
    }
    
    //Note that some properties are not available until later, that's because it does
    //step by step loading, make sure to show this in the way this is represented, ensure to have
    //a case where the property is not available
    //You can use the cheat && after the property
    //eg. guiderStudentsCurrent.property && guiderStudentsCurrent.property.useSubProperty
    
   
  
     /* 
     */  
    //This is ugly and raw
    //TODO: Ukkonen make it pretty"firstName":"Jari","lastName":"Ahokas","nickName":null,"studyProgrammeName":"y","hasImage":false,"nationality":null,"language":null,"municipality":null,"school":null,"email":"ja...@gmail.com","studyStartDate":"2012-07-11T21:00:00.000+0000","studyEndDate":null,"studyTimeEnd":null,"curriculumIdentifier":null,"updatedByStudent":false,"flags":null}
    return <div className="application-list__item application-list__item--guider-current-student">
      <div className="TODO">
        {this.props.guiderStudentsCurrent.basic ? <div>
           <object className="container container--profile-image"
            data={getUserImageUrl(this.props.guiderStudentsCurrent.basic.userEntityId)}
            type="image/jpeg">
             <div className={`application-list__item-content-avatar`}>{this.props.guiderStudentsCurrent.basic.firstName[0]}</div>
           </object>
           <div className="TODO">{getName(this.props.guiderStudentsCurrent.basic)}</div>
        </div> : null}
        {this.props.guiderStudentsCurrent.labels && this.props.guiderStudentsCurrent.labels.map((label: GuiderStudentUserProfileLabelType)=>{
          return null;
        })}
      </div>
    
      <span>{JSON.stringify(this.props.guiderStudentsCurrent)}</span>
      {this.props.guiderCurrentState === "LOADING" ? <div className="application-list__item loader-empty"/> : null}
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderStudentsCurrent: state.guiderStudents.current,
    guiderCurrentState: state.guiderStudents.currentState
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentStudent);