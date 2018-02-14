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
import Link from '~/components/general/link';
import { WorkspaceType } from '~/reducers/main-function/index/workspaces';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';

interface RecordsProps {
  i18n: i18nType,
  records: RecordsType
}

interface RecordsState {
}

let storedCurriculumIndex:any = {};

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
    
    this.getWorkspaceLink = this.getWorkspaceLink.bind(this);
  }
  
  getWorkspaceLink(user: UserWithSchoolDataType, workspace: WorkspaceType){
    return "#?u=" + user.userEntityId + "&w=" + workspace.id;
  }

  render(){
    if (this.props.records.userDataStatus === "LOADING"){
      return null;
    } else if (this.props.records.userDataStatus === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    }
    
    if (Object.keys(storedCurriculumIndex).length && this.props.records.curriculums.length){
      this.props.records.curriculums.forEach((curriculum)=>{
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }
    
    return <BodyScrollKeeper hidden={this.props.records.location !== "RECORDS" || !!this.props.records.current}>
      <div className="application-list">
        {this.props.records.userData.map((data)=>{
          let user = data.user;
          let records = data.records;
          
          return <div key={data.user.id}>
            <h2>{user.studyProgrammeName}</h2>
            {records.map((record, index)=>{
              //TODO remember to add the curriculum reducer information to give the actual curriculum name somehow, this just gives the id
              return <div key={record.groupCurriculumIdentifier || index}>
                {record.groupCurriculumIdentifier ? <h3>{storedCurriculumIndex[record.groupCurriculumIdentifier]}</h3> : null}
                {record.workspaces.map((workspace)=>{
                  //TODO add information, I am not sure how that goes, discuss with lankkinen, make the progress bars ready so
                  //that ukkonen can work with them already
                  return <Link key={workspace.id} href={this.getWorkspaceLink(user, workspace)}>
                    {workspace.name}
                  </Link>
                })}
                {record.transferCredits.length ? <h3>{this.props.i18n.text.get("TODO transfer credits")}</h3> : null}
                {record.transferCredits.map((credit)=>{
                  return <div key={credit.date}>
                    {credit.courseName}
                  </div>
                })}
              </div>
            })}
          </div>
        })}
      </div>
      <div className="TODO files">
        {this.props.records.files.length ?
          <div>
            {this.props.records.files.map((file)=>{
              return <Link key={file.id} href={`/rest/records/files/${file.id}/content`} openInNewTab={file.title}>
                {file.title}
              </Link>
            })}
          </div> :
          <div>{
            this.props.i18n.text.get("TODO no files")
          }</div>
        }
      </div>
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