import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { i18nType } from '~/reducers/base/i18n';
import '~/sass/elements/link.scss';
import '~/sass/elements/label.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/avatar.scss';
import '~/sass/elements/workspace-activity.scss';
import { getUserImageUrl, getName } from '~/util/modifiers';
import Hops from '~/components/base/hops_readable';
import FileDeleteDialog from '../../dialogs/file-delete';
import Workspaces from './current-student/workspaces';
import FileUploader from '~/components/general/file-uploader';
import {
  AddFileToCurrentStudentTriggerType,
  addFileToCurrentStudent
} from '~/actions/main-function/guider';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import { UserFileType } from '~/reducers/user-index';
import { StateType } from '~/reducers';
import { GuiderType, GuiderStudentUserProfileLabelType } from '~/reducers/main-function/guider';
import NewMessage from '~/components/communicator/dialogs/new-message';
import { ButtonPill } from '~/components/general/button';
import GuiderToolbarLabels from './toolbar/labels';
import GuidanceEvent from './toolbar/guidance-event';



interface CurrentStudentProps {
  i18n: i18nType,
  guider: GuiderType,
  addFileToCurrentStudent: AddFileToCurrentStudentTriggerType,
  displayNotification: DisplayNotificationTriggerType
}

interface CurrentStudentState {
}

class CurrentStudent extends React.Component<CurrentStudentProps, CurrentStudentState> {
  constructor(props: CurrentStudentProps) {
    super(props);
  }

  //TODO doesn't anyone notice that nor assessment requested, nor no passed courses etc... is available in this view
  render() {
    if (this.props.guider.currentStudent === null) {
      return null;
    }
    //Note that some properties are not available until later, that's because it does
    //step by step loading, make sure to show this in the way this is represented, ensure to have
    //a case where the property is not available
    //You can use the cheat && after the property
    //eg. guider.currentStudent.property && guider.currentStudent.property.useSubProperty
    let defaultEmailAddress = this.props.guider.currentStudent.emails && this.props.guider.currentStudent.emails.find((e) => e.defaultAddress);
    let studentBasicHeader = this.props.guider.currentStudent.basic && <div className="application-sub-panel__header">
      <object
        className="avatar-container"
        data={getUserImageUrl(this.props.guider.currentStudent.basic.userEntityId)}
        type="image/jpeg">
        <div className={`avatar avatar--category-1`}>{this.props.guider.currentStudent.basic.firstName[0]}</div>
      </object>
      <div className="application-sub-panel__header-main-container">
        <h2 className="application-sub-panel__header-main application-sub-panel__header-main--guider-profile-student-name">{getName(this.props.guider.currentStudent.basic, true)}</h2>
        <div className="application-sub-panel__header-main application-sub-panel__header-main--guider-profile-student-email">{(defaultEmailAddress && defaultEmailAddress.address) || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.email")}</div>
      </div>
      <div className="application-sub-panel__header-aside-container">
        {/* {this.props.guider.currentStudent.basic.studyProgrammeName} */}
        <GuiderToolbarLabels />
        <NewMessage extraNamespace='student-view' initialSelectedItems={[{
          type: "user",
          value: {
            id: this.props.guider.currentStudent.basic.userEntityId,
            name: getName(this.props.guider.currentStudent.basic, true)
          }
        }]}>
          <ButtonPill icon="envelope" buttonModifiers={["new-message", "guider-student"]} />
        </NewMessage>
        <GuidanceEvent>
          <ButtonPill icon="bubbles" buttonModifiers={["new-message", "guider-student"]} />
        </GuidanceEvent>
      </div>
    </div >

    let studentLabels = this.props.guider.currentStudent.labels && this.props.guider.currentStudent.labels.map((label: GuiderStudentUserProfileLabelType) => {
      return <span className="label" key={label.id}>
        <span className="label__icon icon-flag" style={{ color: label.flagColor }}></span>
        <span className="label__text">{label.flagName}</span>
      </span>
    });

    let studentBasicInfo = this.props.guider.currentStudent.basic && <div className="application-sub-panel__body">
      <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.studyStartDateTitle")}</div>
        <div className="application-sub-panel__item-data">
          <span className="application-sub-panel__single-entry">{this.props.guider.currentStudent.basic.studyStartDate ?
            this.props.i18n.time.format(this.props.guider.currentStudent.basic.studyStartDate) : "-"}</span>
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.studyEndDateTitle")}</div>
        <div className="application-sub-panel__item-data">
          <span className="application-sub-panel__single-entry">{this.props.guider.currentStudent.basic.studyEndDate ?
            this.props.i18n.time.format(this.props.guider.currentStudent.basic.studyEndDate) : "-"}</span>
        </div>
      </div>
      <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.studyTimeEndTitle")}</div>
        <div className="application-sub-panel__item-data">
          <span className="application-sub-panel__single-entry">{this.props.guider.currentStudent.basic.studyTimeEnd ?
            this.props.i18n.time.format(this.props.guider.currentStudent.basic.studyTimeEnd) : "-"}</span>
        </div>
      </div>
      {this.props.guider.currentStudent.emails && <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.email")}</div>
        <div className="application-sub-panel__item-data">
          {this.props.guider.currentStudent.emails.length ? this.props.guider.currentStudent.emails.map((email) => {
            return <span className="application-sub-panel__single-entry" key={email.address} >
              {email.defaultAddress ? `*` : null} {email.address} ({email.type})
            </span>
          }) : <span className="application-sub-panel__single-entry">{this.props.i18n.text.get("plugin.guider.user.details.label.unknown.email")}</span>}
        </div>
      </div>}
      {this.props.guider.currentStudent.phoneNumbers && <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.phoneNumber")}</div>
        <div className="application-sub-panel__item-data">
          {this.props.guider.currentStudent.phoneNumbers.length ? this.props.guider.currentStudent.phoneNumbers.map((phone) => {
            return <span className="application-sub-panel__single-entry" key={phone.number} >
              {phone.defaultNumber ? `*` : null} {phone.number} ({phone.type})
            </span>
          }) : <span className="application-sub-panel__single-entry">{this.props.i18n.text.get("plugin.guider.user.details.label.unknown.phoneNumber")}</span>}
        </div>
      </div>}
      <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.school")}</div>
        <div className="application-sub-panel__item-data">
          <span className="application-sub-panel__single-entry">{this.props.guider.currentStudent.basic.school || this.props.i18n.text.get("plugin.guider.user.details.label.unknown.school")}</span>
        </div>
      </div>
      {this.props.guider.currentStudent.usergroups && <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.studentgroups")}</div>
        <div className="application-sub-panel__item-data">
          {this.props.guider.currentStudent.usergroups.length ? this.props.guider.currentStudent.usergroups.map((usergroup) => {
            return <span className="application-sub-panel__single-entry" key={usergroup.id} >
              {usergroup.name}
            </span>
          }) : <span className="application-sub-panel__single-entry">{this.props.i18n.text.get("plugin.guider.user.details.label.nostudentgroups")}</span>}
        </div>
      </div>}
      {this.props.guider.currentStudent.basic && <div className="application-sub-panel__item application-sub-panel__item--guider-student">
        <div className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.guider.user.details.label.lastLogin")}</div>
        <div className="application-sub-panel__item-data">
          <span className="application-sub-panel__single-entry">{this.props.guider.currentStudent.basic.lastLogin ?
            this.props.i18n.time.format(this.props.guider.currentStudent.basic.lastLogin, "LLL") : "-"}</span>
        </div>
      </div>}
      {this.props.guider.currentStudent.notifications && Object.keys(this.props.guider.currentStudent.notifications).map((notification) => {
        <div className="application-sub-panel__item application-sub-panel__item--notification" key={notification}>
          <div className="application-sub-panel__item-title ">{this.props.i18n.text.get("plugin.guider.user." + notification)}</div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">{this.props.i18n.time.format((this.props.guider.currentStudent.notifications as any)[notification])}</span>
          </div>
        </div>
      })}
    </div>
    //TODO: this was stolen from the dust template, please replace all the classNames, these are for just reference
    //I don't want this file to become too complex, remember anyway that I will be splitting all these into simpler components
    //later once a pattern is defined
    let studentHops = (this.props.guider.currentStudent.hops && this.props.guider.currentStudent.hops.optedIn) ?
      <Hops data={this.props.guider.currentStudent.hops} /> : null;

    //I placed the VOPS in an external file already you can follow it, this is because
    //it is very clear
    let studentVops = null;
    // Removed until it works
    // (this.props.guider.currentStudent.vops && this.props.guider.currentStudent.vops.optedIn) ?
    //        <Vops data={this.props.guider.currentStudent.vops}></Vops> : null;

    let studentWorkspaces = <Workspaces />;

    let formDataGenerator = (file: File, formData: FormData) => {
      formData.append("upload", file);
      formData.append("title", file.name);
      formData.append("description", "");
      formData.append("userIdentifier", this.props.guider.currentStudent.basic.id);
    }

    let files = this.props.guider.currentStudent.basic && <div className="application-sub-panel__body">
      <FileUploader url="/transcriptofrecordsfileupload/" formDataGenerator={formDataGenerator}
        displayNotificationOnError onFileSuccess={(file: File, data: UserFileType) => {
          this.props.addFileToCurrentStudent(data);
        }} hintText={this.props.i18n.text.get("plugin.guider.user.details.files.hint")}
        fileTooLargeErrorText={this.props.i18n.text.get("plugin.guider.user.details.files.fileFieldUpload.fileSizeTooLarge")}
        files={this.props.guider.currentStudent.files} fileIdKey="id" fileNameKey="title" fileUrlGenerator={(f) => `/rest/guider/files/${f.id}/content`}
        deleteDialogElement={FileDeleteDialog} modifier="guider" emptyText={this.props.i18n.text.get("plugin.guider.user.details.files.empty")}
        uploadingTextProcesser={(percent: number) => this.props.i18n.text.get("plugin.guider.user.details.files.uploading", percent)}
        notificationOfSuccessText={this.props.i18n.text.get("plugin.guider.fileUpload.successful")} displayNotificationOnSuccess />
    </div>

    return <>
      <div className="application-sub-panel application-sub-panel--guider-student-header">
        {studentBasicHeader}
        {this.props.guider.currentStudent.labels && this.props.guider.currentStudent.labels.length ? <div className="application-sub-panel__body application-sub-panel__body--labels labels">
          {studentLabels}
        </div> : null}
      </div>
      <div className="application-sub-panel application-sub-panel--student-data-container">
        <div className="application-sub-panel application-sub-panel--student-data-primary">
          {studentBasicInfo}
        </div>
        {/* {studentHops ? <div className="application-sub-panel">
        <h3 className="application-sub-panel__header">{this.props.i18n.text.get("plugin.guider.user.details.hops")}</h3>
        {studentHops}
      </div> : null} */}
        {/* {studentVops ? <div className="application-sub-panel">
        <h3 className="application-sub-panel__header">{this.props.i18n.text.get("plugin.guider.user.details.vops")}</h3>
        {studentVops}
      </div> : null} */}
        <div className="application-sub-panel application-sub-panel--student-data-secondary">
          <h3 className="application-sub-panel__header">{this.props.i18n.text.get("plugin.guider.user.details.workspaces")}</h3>
          <div className="application-sub-panel__body">
            {studentWorkspaces}
          </div>
        </div>
        {/* <div className="application-sub-panel">
        <h3 className="application-sub-panel__header">{this.props.i18n.text.get("plugin.guider.user.details.files")}</h3>
        {files}
      </div> */}
        {/* <div className="application-sub-panel">
        <div className="application-sub-panel__header">{this.props.i18n.text.get("plugin.guider.user.details.statistics")}</div>
        {this.props.guider.currentStudent.activityLogs && this.props.guider.currentStudent.workspaces ? <MainChart workspaces={this.props.guider.currentStudent.workspaces} activityLogs={this.props.guider.currentStudent.activityLogs} /> : null}
      </div> */}
        {this.props.guider.currentState === "LOADING" ? <div className="application-sub-panel loader-empty" /> : null}
      </div>
    </>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ addFileToCurrentStudent, displayNotification }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentStudent);
