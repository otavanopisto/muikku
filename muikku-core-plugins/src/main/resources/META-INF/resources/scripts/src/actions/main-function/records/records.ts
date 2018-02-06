import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {UserWithSchoolDataType} from '~/reducers/main-function/user-index';
import { WorkspaceType, WorkspaceStudentAccessmentType, WorkspaceStudentActivityType } from 'reducers/main-function/index/workspaces';

interface TransferCreditType {
  assessorIdentifier: string,
  courseName: string,
  courseNumber: number,
  curriculumIdentifier: string,
  date: string,
  gradeIdentifier: string,
  gradingScaleIdentifier: string,
  identifier: string,
  length: number,
  lengthUnitIdentifier: string,
  schoolIdentifier: string,
  studentIdentifier: string,
  subjectIdentifier: string,
  verbalAssessment: string
}

export type RecordType = {
    groupCurriculumIdentifier?: string,
    records: Array<{
      type: "workspace" | "transferCredit",
      value: WorkspaceType | TransferCreditType
    }>
}

export type RecordsOrderedType = Array<RecordType>

export type AllStudentUsersData = {
    [id: string]: {
      user: UserWithSchoolDataType,
      workspaces: RecordsOrderedType
    }
  }
    
export type UPDATE_ALL_STUDENT_USERS_DATA = SpecificActionType<"UPDATE_ALL_STUDENT_USERS_DATA", AllStudentUsersData>;

export interface UpdateAllStudentUsersTriggerType {
  ():AnyActionType
}

let updateAllStudentUsers:UpdateAllStudentUsersTriggerType = function updateAllStudentUsers(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let userId:number = getState().status.userId;
      let users:Array<UserWithSchoolDataType> = await promisify(mApi().user.students.read({
        userEntityId: userId,
        includeInactiveStudents: true,
        includeHidden: true
      }), 'callback')() as Array<UserWithSchoolDataType>;
      users = users.sort((a, b)=>{
        if(a.id < b.id) return 1;
        if(a.id > b.id) return -1;
        return 0;
      });
      
      let workspaces:Array<Array<WorkspaceType>> = await Promise.all(users.map((user)=>promisify(mApi().workspace.workspaces.read({
        userIdentifier: user.id,
        includeUnpublished: true,
        includeInactiveWorkspaces: true,
        orderBy: "alphabet",
        maxResults: 500
      }), 'callback')())) as Array<Array<WorkspaceType>>;
      //It won't give empty array if it's empty :/
      workspaces = workspaces.map(workspaceSet=>!workspaceSet ? [] : workspaceSet);
      
      let transferCredits:Array<Array<TransferCreditType>> = await Promise.all(users.map((user)=>promisify(mApi().user.students.transferCredits.read(
        user.id
      ), 'callback')())) as Array<Array<TransferCreditType>>;
      
      await Promise.all(workspaces.map(async (workspaceSet, index)=>{
        let user = users[index];
        await Promise.all(workspaceSet.map(async (workspace)=>{
          workspace.studentAcessment = (<Array<WorkspaceStudentAccessmentType>>await promisify(mApi().workspace.workspaces
              .students.assessments.read(workspace.id, user.id), 'callback')())[0];
          if (!workspace.studentAcessment){
            workspace.studentActivity = <WorkspaceStudentActivityType>await promisify(mApi().guider.workspaces.activity
                .read(workspace.id), 'callback')();
          }
        }));
      }));
      
      let resultingData:AllStudentUsersData = {}
      users.map((user, index)=>{
        resultingData[user.id] = {
          user,
          workspaces: null
        }
        let givenWorkspacesByServer = workspaces[index];
        let givenTransferCreditsByServer = transferCredits[index];
        
        if (!user.curriculumIdentifier){
          resultingData[user.id].workspaces = [{
            records: (givenWorkspacesByServer as any).concat(givenTransferCreditsByServer).map(()=>{
              
            })
          }];
        } else {
          let recordById:{[key: string]: RecordType} = {};
          let defaultRecords: RecordType = {
             records: []
          }
          let workspaceIdsOrdered = givenWorkspacesByServer.map((workspace)=>{
            let curriculumIdentifier:string = workspace.curriculumIdentifiers[0];
            if (!curriculumIdentifier){
              defaultRecords.records.push({
                type: "workspace",
                value: workspace
              });
            } else if (!recordById[curriculumIdentifier]){
              recordById[curriculumIdentifier] = {
                groupCurriculumIdentifier: curriculumIdentifier,
                records: [{
                  type: "workspace",
                  value: workspace
                }]
              }
            } else {
              recordById[curriculumIdentifier].records.push({
                type: "workspace",
                value: workspace
              });
            }
            return curriculumIdentifier;
          });
          let recordsIdsOrdered = givenTransferCreditsByServer.map((transferCredit)=>{
            let curriculumIdentifier:string = transferCredit.curriculumIdentifier;
            if (!curriculumIdentifier){
              defaultRecords.records.push({
                type: "transferCredit",
                value: transferCredit
              });
            } else if (!recordById[curriculumIdentifier]){
              recordById[curriculumIdentifier] = {
                groupCurriculumIdentifier: curriculumIdentifier,
                records: [{
                  type: "transferCredit",
                  value: transferCredit
                }]
              }
            } else {
              recordById[curriculumIdentifier].records.push({
                type: "transferCredit",
                value: transferCredit
              });
            }
            return curriculumIdentifier;
          });
          
          let workspaceOrder = [user.curriculumIdentifier].concat(workspaceIdsOrdered).concat(recordsIdsOrdered).filter((item, pos, self)=>{
            return self.indexOf(item) == pos;
          })
          
          resultingData[user.id].workspaces = workspaceOrder.map((curriculumIdentifier: string)=>{
            return recordById[curriculumIdentifier];
          }).concat([defaultRecords]).filter((record: RecordType)=>!record.records.length);
        }
      });
      
      dispatch({
        type: "UPDATE_ALL_STUDENT_USERS_DATA",
        payload: resultingData
      })
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {updateAllStudentUsers}
export {updateAllStudentUsers}