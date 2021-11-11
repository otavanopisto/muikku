import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import CKEditor from '~/components/general/ckeditor';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import EnvironmentDialog from '~/components/general/environment-dialog';
import { WorkspaceRecepientType, UserIndexType, UserGroupRecepientType } from '~/reducers/user-index';
import { i18nType } from 'reducers/base/i18n';
import { AnnouncementType } from '~/reducers/announcements';
import { AnyActionType } from '~/actions';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { WorkspacesType } from '~/reducers/workspaces';
import {
  createAnnouncement, CreateAnnouncementTriggerType,
  updateAnnouncement, UpdateAnnouncementTriggerType
} from '~/actions/announcements';
import { StateType } from '~/reducers';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';
import equals = require("deep-equal");

type TargetItemsListType = Array<WorkspaceRecepientType | UserGroupRecepientType>;

interface NewEditAnnouncementProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  announcement?: AnnouncementType,
  userIndex: UserIndexType,
  createAnnouncement: CreateAnnouncementTriggerType,
  updateAnnouncement: UpdateAnnouncementTriggerType,
  status: StatusType,

  workspaceId: number,
  workspaces: WorkspacesType
}

interface NewEditAnnouncementState {
  text: string,
  currentTarget: TargetItemsListType,
  subject: string,
  locked: boolean,
  startDate: any,
  endDate: any
}

class NewEditAnnouncement extends SessionStateComponent<NewEditAnnouncementProps, NewEditAnnouncementState> {
  private baseAnnouncementCurrentTarget: TargetItemsListType;
  constructor(props: NewEditAnnouncementProps) {
    super(props, "new-edit-announcement");
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setTargetItems = this.setTargetItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.baseAnnouncementCurrentTarget = props.announcement ? props.announcement.workspaces.map((w) => {
      //NOTE this workspace type is incomplete, but should do the job regardless
      return {
        type: "workspace",
        value: w
      } as WorkspaceRecepientType;
    }).concat(props.announcement.userGroupEntityIds.filter(id => props.userIndex.groups[id]).map(id => {
      return {
        type: "usergroup",
        value: props.userIndex.groups[id]
      } as UserGroupRecepientType;
    }) as any) : this.getPredefinedWorkspaceByIdToConcat(props);

    this.state = this.getRecoverStoredState({
      text: props.announcement ? props.announcement.content : "",
      currentTarget: this.baseAnnouncementCurrentTarget,
      subject: props.announcement ? props.announcement.caption : "",
      locked: false,
      startDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.startDate) : props.i18n.time.getLocalizedMoment(),
      endDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.endDate) : props.i18n.time.getLocalizedMoment().add(1, "day")
    }, (props.announcement ? props.announcement.id + "-" : "") + (props.workspaceId || ""));
  }
  checkAgainstStoredState() {
    if (this.props.announcement) {
      this.checkStoredAgainstThisState({
        subject: this.props.announcement.caption,
        text: this.props.announcement.content,
        startDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.startDate),
        endDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.endDate)
      }, this.props.announcement.id + "-" + (this.props.workspaceId || ""));

      let userGroupEntityIds = this.state.currentTarget.filter(w => w.type === "usergroup").map(w => (w.value as any).id);
      let workspaceEntityIds = this.state.currentTarget.filter(w => w.type === "workspace").map(w => (w.value as any).id);

      if (JSON.stringify(this.props.announcement.userGroupEntityIds) !== JSON.stringify(userGroupEntityIds) ||
        JSON.stringify(this.props.announcement.workspaceEntityIds) !== JSON.stringify(workspaceEntityIds)) {
        this.forceRecovered();
      }
    } else {
      this.checkStoredAgainstThisState({
        subject: "",
        text: "",
        currentTarget: this.getPredefinedWorkspaceByIdToConcat(this.props),
        startDate: this.props.i18n.time.getLocalizedMoment(),
        endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
      }, this.props.workspaceId || "");
    }
  }
  clearUp() {
    if (!this.props.announcement) {
      this.baseAnnouncementCurrentTarget = this.getPredefinedWorkspaceByIdToConcat(this.props);
      this.setStateAndClear({
        subject: "", text: "",
        startDate: this.props.i18n.time.getLocalizedMoment(),
        endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
        currentTarget: this.baseAnnouncementCurrentTarget
      }, this.props.workspaceId || ""
      );
    } else {
      this.baseAnnouncementCurrentTarget = this.props.announcement.workspaces.map(w => {
        //NOTE this workspace type is incomplete, but should do the job regardless
        return {
          type: "workspace",
          value: w
        } as WorkspaceRecepientType
      });
      this.setStateAndClear({
        subject: this.props.announcement.caption,
        text: this.props.announcement.content,
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.startDate),
        endDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.endDate)
      }, this.props.announcement.id + "-" + (this.props.workspaceId || ""));
    }
  }
  getPredefinedWorkspaceByIdToConcat(props: NewEditAnnouncementProps) {
    if (!props.workspaces || !props.workspaceId || props.announcement) {
      return [];
    }

    let workpaceFound = props.workspaces && props.workspaces.currentWorkspace && props.workspaces.currentWorkspace.id === props.workspaceId
      ? props.workspaces.currentWorkspace :
      (props.workspaces && props.workspaces.availableWorkspaces.concat(props.workspaces.userWorkspaces).find(w => w.id === props.workspaceId));

    if (workpaceFound) {
      return [{
        type: "workspace",
        value: workpaceFound
      } as WorkspaceRecepientType];
    }

    return [];
  }
  componentWillReceiveProps(nextProps: NewEditAnnouncementProps) {
    if ((this.props.announcement && nextProps.announcement && nextProps.announcement.id !== this.props.announcement.id) ||
      (!this.props.announcement && nextProps.announcement) || (nextProps.userIndex !== this.props.userIndex && nextProps.announcement)) {

      let prevBaseAnnouncementCurrentTarget = this.baseAnnouncementCurrentTarget;
      this.baseAnnouncementCurrentTarget = nextProps.announcement.workspaces.map(w => {
        //NOTE this workspace type is incomplete, but should do the job regardless
        return {
          type: "workspace",
          value: w
        } as WorkspaceRecepientType
      }).concat(nextProps.announcement.userGroupEntityIds.filter(id => nextProps.userIndex.groups[id]).map(id => {
        return {
          type: "usergroup",
          value: nextProps.userIndex.groups[id]
        } as UserGroupRecepientType;
      }) as any);

      if (equals(prevBaseAnnouncementCurrentTarget, this.baseAnnouncementCurrentTarget) &&
        equals(this.props.announcement, nextProps.announcement)) {
        return;
      }

      this.setState(this.getRecoverStoredState({
        subject: nextProps.announcement.caption,
        text: nextProps.announcement.content,
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: nextProps.i18n.time.getLocalizedMoment(nextProps.announcement.startDate),
        endDate: nextProps.i18n.time.getLocalizedMoment(nextProps.announcement.endDate)
      }, nextProps.announcement.id + "-" + (nextProps.workspaceId || "")));
    } else if (this.props.announcement && !nextProps.announcement) {
      this.baseAnnouncementCurrentTarget = this.getPredefinedWorkspaceByIdToConcat(nextProps);

      this.setState(this.getRecoverStoredState({
        subject: "",
        text: "",
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: nextProps.i18n.time.getLocalizedMoment(),
        endDate: nextProps.i18n.time.getLocalizedMoment().add(1, "day"),
      }, nextProps.workspaceId || ""));
    } else if (nextProps.workspaceId !== this.props.workspaceId || nextProps.workspaces !== this.props.workspaces && !nextProps.announcement) {
      //Searching for the workspace in current workspace, available workspaces and user workspaces, anywhere possible to find it
      this.baseAnnouncementCurrentTarget = this.getPredefinedWorkspaceByIdToConcat(nextProps);

      this.setState(this.getRecoverStoredState({
        currentTarget: this.baseAnnouncementCurrentTarget,
      }, nextProps.workspaceId || ""));
    }
  }
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, (this.props.announcement ? this.props.announcement.id + "-" : "") + (this.props.workspaceId || ""));
  }
  setTargetItems(currentTarget: TargetItemsListType) {
    this.setStateAndStore({ currentTarget }, (this.props.announcement ? this.props.announcement.id + "-" : "") + (this.props.workspaceId || ""));
  }
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore({ subject: e.target.value }, (this.props.announcement ? this.props.announcement.id + "-" : "") + (this.props.workspaceId || ""));
  }
  createOrModifyAnnouncement(closeDialog: () => any) {
    this.setState({ locked: true });
    if (this.props.announcement) {
      this.props.updateAnnouncement({
        announcement: this.props.announcement,
        update: {
          archived: false,
          caption: this.state.subject,
          content: this.state.text,
          publiclyVisible: this.state.currentTarget.length === 0 ? true : false,
          endDate: this.state.endDate && this.state.endDate.format("YYYY-MM-DD"),
          startDate: this.state.startDate && this.state.startDate.format("YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget.filter(w => w.type === "usergroup").map(w => (w.value as any).id),
          workspaceEntityIds: this.state.currentTarget.filter(w => w.type === "workspace").map(w => (w.value as any).id),
        },
        success: () => {
          this.setStateAndClear({
            ...this.state,
            locked: false
          }, this.props.announcement.id + "-" + (this.props.workspaceId || ""));
          closeDialog();
        },
        fail: () => {
          this.setState({ locked: false });
        }
      });
    } else {
      this.props.createAnnouncement({
        announcement: {
          caption: this.state.subject,
          content: this.state.text,
          publiclyVisible: this.state.currentTarget.length === 0 ? true : false,
          endDate: this.state.endDate && this.state.endDate.format("YYYY-MM-DD"),
          startDate: this.state.startDate && this.state.startDate.format("YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget.filter(w => w.type === "usergroup").map(w => (w.value as any).id),
          workspaceEntityIds: this.state.currentTarget.filter(w => w.type === "workspace").map(w => (w.value as any).id),
        },
        success: () => {
          this.setStateAndClear({
            locked: false, subject: "", text: "",
            startDate: this.props.i18n.time.getLocalizedMoment(),
            endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
            currentTarget: this.getPredefinedWorkspaceByIdToConcat(this.props)
          }, this.props.workspaceId || "");
          closeDialog();
        },
        fail: () => {
          this.setState({ locked: false });
        }
      });
    }
  }
  handleDateChange(stateLocation: string, newDate: any) {
    let nState: any = {};
    nState[stateLocation] = newDate;
    (this.setStateAndClear as any)(nState, (this.props.announcement ? this.props.announcement.id + "-" : "") + (this.props.workspaceId || ""));
  }
  render() {
    let editorTitle: string;
    if (this.props.announcement) {
      editorTitle = this.props.i18n.text.get('plugin.announcer.editannouncement.topic') + " - " + this.props.i18n.text.get('plugin.announcer.createannouncement.content.label');
    } else {
      editorTitle = this.props.i18n.text.get('plugin.announcer.createannouncement.topic') + " - " + this.props.i18n.text.get('plugin.announcer.createannouncement.content.label');
    }

    let content = (closeDialog: () => any) => [
      // FOR DESIGN CHECK https://github.com/Hacker0x01/react-datepicker
      (<div className="env-dialog__row env-dialog__row--new-announcement-options" key="annnouncement-edit-1">
        <div className="env-dialog__form-element-container env-dialog__form-element-container--datepicker">
          <label htmlFor="announcementStartSate" className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.startdate.label')}</label>
          <DatePicker id="announcementStartSate" className="env-dialog__input env-dialog__input--date-picker" selected={this.state.startDate} onChange={this.handleDateChange.bind(this, "startDate")}
            locale={this.props.i18n.time.getLocale()} />
        </div>
        <div className="env-dialog__form-element-container env-dialog__form-element-container--datepicker">
          <label htmlFor="announcementEndDate" className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.enddate.label')}</label>
          <DatePicker id="announcementEndDate" className="env-dialog__input env-dialog__input--date-picker" selected={this.state.endDate} onChange={this.handleDateChange.bind(this, "endDate")}
            locale={this.props.i18n.time.getLocale()} />
        </div>
      </div>),
      (<InputContactsAutofill identifier="announcementRecipients" modifier="new-announcement-recipients" key="annnouncement-edit-2" hasUserPermission={false}
        hasGroupPermission={this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_GROUPS}
        hasWorkspacePermission={this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_WORKSPACES}
        workspacePermissionIsOnlyMyWorkspaces={!this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT}
        selectedItems={this.state.currentTarget}
        onChange={this.setTargetItems}
        autofocus={!this.props.announcement}
        showFullNames={false}
        placeholder={this.props.i18n.text.get('plugin.announcer.createannouncement.target.placeholder')}
        label={this.props.i18n.text.get('plugin.announcer.createannouncement.target.label')} />),
      (
        <div className="env-dialog__row" key="annnouncement-edit-3">
          <div className="env-dialog__form-element-container  env-dialog__form-element-container--title">
            <label htmlFor="announcementTitle" className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.title.label')}</label>
            <input id="announcementTitle" type="text" className="env-dialog__input" value={this.state.subject} onChange={this.onSubjectChange} autoFocus={!!this.props.announcement} />
          </div>
        </div>
      ),
      (
        <div className="env-dialog__row env-dialog__row--ckeditor" key="annnouncement-edit-4">
          <div className="env-dialog__form-element-container">
            <label className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.content.label')}</label>
            <CKEditor editorTitle={editorTitle} onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
          </div>
        </div>
      )
    ]
    let footer = (closeDialog: () => any) => {
      return (
        <div className="env-dialog__actions">
          <Button className="button button--dialog-execute" onClick={this.createOrModifyAnnouncement.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get(this.props.announcement ?
              'plugin.announcer.editannouncement.button.send' : 'plugin.announcer.createannouncement.button.send')}
          </Button>
          <Button buttonModifiers="dialog-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.announcer.createannouncement.button.cancel')}
          </Button>
          {this.recovered ? <Button buttonModifiers="dialog-clear" onClick={this.clearUp} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.announcer.createannouncement.button.clearDraft')}
          </Button> : null}
        </div>
      )
    }

    return <EnvironmentDialog modifier="new-edit-announcement"
      onOpen={this.checkAgainstStoredState}
      title={this.props.announcement ?
        this.props.i18n.text.get('plugin.announcer.editannouncement.topic') :
        this.props.i18n.text.get('plugin.announcer.createannouncement.topic')}
      content={content} footer={footer}>
      {this.props.children}
    </EnvironmentDialog>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    userIndex: state.userIndex,
    status: state.status,

    //For use with workspaces when announcement gives a workspace
    //it needs to be fetched from somewhere, this is set by default
    //when loading
    workspaceId: state.announcements.workspaceId,
    workspaces: state.workspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createAnnouncement, updateAnnouncement }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEditAnnouncement);
