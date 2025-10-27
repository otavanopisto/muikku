import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { UserIndexState, ContactRecipientType } from "~/reducers/user-index";
import { AnyActionType } from "~/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "~/sass/elements/datepicker/datepicker.scss";
import { WorkspacesState } from "~/reducers/workspaces";
import {
  createAnnouncement,
  CreateAnnouncementTriggerType,
  updateAnnouncement,
  UpdateAnnouncementTriggerType,
} from "~/actions/announcements";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import { outputCorrectDatePickerLocale } from "../../../helper-functions/locale";
import equals = require("deep-equal");
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { localize } from "~/locales/i18n";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement, Role } from "~/generated/client";

/**
 * TargetItemsListType
 */
type TargetItemsListType = Array<ContactRecipientType>;

/**
 * NewEditAnnouncementProps
 */
interface NewEditAnnouncementProps extends WithTranslation {
  children: React.ReactElement<any>;
  announcement?: Announcement;
  userIndex: UserIndexState;
  createAnnouncement: CreateAnnouncementTriggerType;
  updateAnnouncement: UpdateAnnouncementTriggerType;
  displayNotification: DisplayNotificationTriggerType;
  status: StatusType;
  workspaceId: number;
  workspaces: WorkspacesState;
}

/**
 * NewEditAnnouncementState
 */
interface NewEditAnnouncementState {
  text: string;
  currentTarget: TargetItemsListType;
  subject: string;
  locked: boolean;
  startDate: Date;
  endDate: Date;
  pinned?: boolean;
}

/**
 * NewEditAnnouncement
 */
class NewEditAnnouncement extends SessionStateComponent<
  NewEditAnnouncementProps,
  NewEditAnnouncementState
> {
  private baseAnnouncementCurrentTarget: TargetItemsListType;

  /**
   * constructor
   * @param props props
   */
  constructor(props: NewEditAnnouncementProps) {
    super(props, "new-edit-announcement");
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setTargetItems = this.setTargetItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    this.handlePinnedChange = this.handlePinnedChange.bind(this);
    this.baseAnnouncementCurrentTarget = props.announcement
      ? props.announcement.workspaces
          .map(
            (w) =>
              //NOTE this workspace type is incomplete, but should do the job regardless
              ({
                type: "workspace",
                value: w,
              }) as ContactRecipientType
          )
          .concat(
            props.announcement.userGroupEntityIds
              .filter((id) => props.userIndex.groups[id])
              .map(
                (id) =>
                  ({
                    type: "usergroup",
                    value: props.userIndex.groups[id],
                  }) as ContactRecipientType
              ) as any
          )
      : this.getPredefinedWorkspaceByIdToConcat(props);

    this.state = this.getRecoverStoredState(
      {
        text: props.announcement ? props.announcement.content : "",
        currentTarget: this.baseAnnouncementCurrentTarget,
        subject: props.announcement ? props.announcement.caption : "",
        locked: false,
        pinned: props.announcement ? props.announcement.pinned : false,
        startDate: props.announcement
          ? localize
              .getLocalizedMoment(this.props.announcement.startDate)
              .toDate()
          : localize.getLocalizedMoment().toDate(),
        endDate: props.announcement
          ? localize
              .getLocalizedMoment(this.props.announcement.endDate)
              .toDate()
          : localize.getLocalizedMoment().add(1, "day").toDate(),
      },
      (props.announcement ? props.announcement.id + "-" : "") +
        (props.workspaceId || "")
    );
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: NewEditAnnouncementProps) {
    if (
      (this.props.announcement &&
        nextProps.announcement &&
        nextProps.announcement.id !== this.props.announcement.id) ||
      (!this.props.announcement && nextProps.announcement) ||
      (nextProps.userIndex !== this.props.userIndex && nextProps.announcement)
    ) {
      const prevBaseAnnouncementCurrentTarget =
        this.baseAnnouncementCurrentTarget;
      this.baseAnnouncementCurrentTarget = nextProps.announcement.workspaces
        .map(
          (w) =>
            //NOTE this workspace type is incomplete, but should do the job regardless
            ({
              type: "workspace",
              value: w,
            }) as ContactRecipientType
        )
        .concat(
          nextProps.announcement.userGroupEntityIds
            .filter((id) => nextProps.userIndex.groups[id])
            .map(
              (id) =>
                ({
                  type: "usergroup",
                  value: nextProps.userIndex.groups[id],
                }) as ContactRecipientType
            ) as any
        );

      if (
        equals(
          prevBaseAnnouncementCurrentTarget,
          this.baseAnnouncementCurrentTarget
        ) &&
        equals(this.props.announcement, nextProps.announcement)
      ) {
        return;
      }

      this.setState(
        this.getRecoverStoredState(
          {
            subject: nextProps.announcement.caption,
            text: nextProps.announcement.content,
            currentTarget: this.baseAnnouncementCurrentTarget,
            pinned: nextProps.announcement.pinned,
            startDate: localize
              .getLocalizedMoment(nextProps.announcement.startDate)
              .toDate(),
            endDate: localize
              .getLocalizedMoment(nextProps.announcement.endDate)
              .toDate(),
          },
          nextProps.announcement.id + "-" + (nextProps.workspaceId || "")
        )
      );
    } else if (this.props.announcement && !nextProps.announcement) {
      this.baseAnnouncementCurrentTarget =
        this.getPredefinedWorkspaceByIdToConcat(nextProps);
      this.setState(
        this.getRecoverStoredState(
          {
            subject: "",
            text: "",
            pinned: false,
            currentTarget: this.baseAnnouncementCurrentTarget,
            startDate: localize.getLocalizedMoment().toDate(),
            endDate: localize.getLocalizedMoment().add(1, "day").toDate(),
          },
          nextProps.workspaceId || ""
        )
      );
    } else if (
      nextProps.workspaceId !== this.props.workspaceId ||
      (nextProps.workspaces !== this.props.workspaces &&
        !nextProps.announcement)
    ) {
      //Searching for the workspace in current workspace, available workspaces and user workspaces, anywhere possible to find it
      this.baseAnnouncementCurrentTarget =
        this.getPredefinedWorkspaceByIdToConcat(nextProps);

      this.setState(
        this.getRecoverStoredState(
          {
            currentTarget: this.baseAnnouncementCurrentTarget,
          },
          nextProps.workspaceId || ""
        )
      );
    }
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    if (this.props.announcement) {
      this.checkStoredAgainstThisState(
        {
          subject: this.props.announcement.caption,
          text: this.props.announcement.content,
          pinned: this.props.announcement.pinned,
          startDate: localize
            .getLocalizedMoment(this.props.announcement.startDate)
            .toDate(),
          endDate: localize
            .getLocalizedMoment(this.props.announcement.endDate)
            .toDate(),
        },
        this.props.announcement.id + "-" + (this.props.workspaceId || "")
      );

      const userGroupEntityIds = this.state.currentTarget
        .filter((w) => w.type === "usergroup")
        .map((w) => (w.value as any).id);
      const workspaceEntityIds = this.state.currentTarget
        .filter((w) => w.type === "workspace")
        .map((w) => (w.value as any).id);

      if (
        JSON.stringify(this.props.announcement.userGroupEntityIds) !==
          JSON.stringify(userGroupEntityIds) ||
        JSON.stringify(this.props.announcement.workspaceEntityIds) !==
          JSON.stringify(workspaceEntityIds)
      ) {
        this.forceRecovered();
      }
    } else {
      this.checkStoredAgainstThisState(
        {
          subject: "",
          text: "",
          pinned: false,
          currentTarget: this.getPredefinedWorkspaceByIdToConcat(this.props),
          startDate: localize.getLocalizedMoment().toDate(),
          endDate: localize.getLocalizedMoment().add(1, "day").toDate(),
        },
        this.props.workspaceId || ""
      );
    }
  }

  /**
   * clearUp
   */
  clearUp() {
    if (!this.props.announcement) {
      this.baseAnnouncementCurrentTarget =
        this.getPredefinedWorkspaceByIdToConcat(this.props);
      this.setStateAndClear(
        {
          subject: "",
          text: "",
          pinned: false,
          startDate: localize.getLocalizedMoment().toDate(),
          endDate: localize.getLocalizedMoment().add(1, "day").toDate(),
          currentTarget: this.baseAnnouncementCurrentTarget,
        },
        this.props.workspaceId || ""
      );
    } else {
      this.baseAnnouncementCurrentTarget =
        this.props.announcement.workspaces.map(
          (w) =>
            //NOTE this workspace type is incomplete, but should do the job regardless
            ({
              type: "workspace",
              value: w,
            }) as ContactRecipientType
        );
      this.setStateAndClear(
        {
          subject: this.props.announcement.caption,
          text: this.props.announcement.content,
          currentTarget: this.baseAnnouncementCurrentTarget,
          pinned: this.props.announcement.pinned,
          startDate: localize
            .getLocalizedMoment(this.props.announcement.startDate)
            .toDate(),
          endDate: localize
            .getLocalizedMoment(this.props.announcement.endDate)
            .toDate(),
        },
        this.props.announcement.id + "-" + (this.props.workspaceId || "")
      );
    }
  }

  /**
   * getPredefinedWorkspaceByIdToConcat
   * @param props props
   * @returns list of ContactRecipientType
   */
  getPredefinedWorkspaceByIdToConcat(props: NewEditAnnouncementProps) {
    if (!props.workspaces || !props.workspaceId || props.announcement) {
      return [];
    }

    const workpaceFound =
      props.workspaces &&
      props.workspaces.currentWorkspace &&
      props.workspaces.currentWorkspace.id === props.workspaceId
        ? props.workspaces.currentWorkspace
        : props.workspaces &&
          props.workspaces.availableWorkspaces
            .concat(props.workspaces.userWorkspaces)
            .find((w) => w.id === props.workspaceId);

    if (workpaceFound) {
      return [
        {
          type: "workspace",
          value: workpaceFound,
        } as ContactRecipientType,
      ];
    }

    return [];
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore(
      { text },
      (this.props.announcement ? this.props.announcement.id + "-" : "") +
        (this.props.workspaceId || "")
    );
  }

  /**
   * setTargetItems
   * @param currentTarget currentTarget
   */
  setTargetItems(currentTarget: TargetItemsListType) {
    this.setStateAndStore(
      { currentTarget },
      (this.props.announcement ? this.props.announcement.id + "-" : "") +
        (this.props.workspaceId || "")
    );
  }

  /**
   * onSubjectChange
   * @param e e
   */
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore(
      { subject: e.target.value },
      (this.props.announcement ? this.props.announcement.id + "-" : "") +
        (this.props.workspaceId || "")
    );
  }

  /**
   * createOrModifyAnnouncement
   * @param closeDialog closeDialog
   */
  createOrModifyAnnouncement(closeDialog: () => any) {
    this.setState({ locked: true });

    if (this.props.status.roles.includes(Role.Teacher)) {
      if (this.state.currentTarget.length <= 0) {
        this.props.displayNotification(
          this.props.i18n.t("validation.targetGroup", { ns: "messaging" }),
          "error"
        );

        this.setState({ locked: false });

        return;
      }
    }

    if (this.props.announcement) {
      this.props.updateAnnouncement({
        announcement: this.props.announcement,
        update: {
          archived: false,
          caption: this.state.subject,
          content: this.state.text,
          pinned: this.state.pinned,
          publiclyVisible: this.state.currentTarget.length === 0 ? true : false,
          endDate:
            this.state.endDate &&
            localize.date(this.state.endDate, "YYYY-MM-DD"),
          startDate:
            this.state.startDate &&
            localize.date(this.state.startDate, "YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget
            .filter((w) => w.type === "usergroup")
            .map((w) => (w.value as any).id),
          workspaceEntityIds: this.state.currentTarget
            .filter((w) => w.type === "workspace")
            .map((w) => (w.value as any).id),
        },
        /**
         * success - set and clear state and close dialog
         */
        success: () => {
          this.setStateAndClear(
            {
              ...this.state,
              locked: false,
              pinned: false,
            },
            this.props.announcement.id + "-" + (this.props.workspaceId || "")
          );
          closeDialog();
        },
        /**tollanen näyttäs tekevän sen värin
:thumbsup:
Click to react
:eyes:
Click to react
:smile:
Click to react
Add Reaction
Edit
Forward
More
NEW

         * If fail set locked false
         */
        fail: () => {
          this.setState({ locked: false });
        },
      });
    } else {
      this.props.createAnnouncement({
        announcement: {
          caption: this.state.subject,
          content: this.state.text,
          pinned: this.state.pinned,
          publiclyVisible: this.state.currentTarget.length === 0 ? true : false,
          endDate:
            this.state.endDate &&
            localize.date(this.state.endDate, "YYYY-MM-DD"),
          startDate:
            this.state.startDate &&
            localize.date(this.state.startDate, "YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget
            .filter((w) => w.type === "usergroup")
            .map((w) => (w.value as any).id),
          workspaceEntityIds: this.state.currentTarget
            .filter((w) => w.type === "workspace")
            .map((w) => (w.value as any).id),
        },
        /**
         * success - set and clear state and closedialog
         */
        success: () => {
          this.setStateAndClear(
            {
              locked: false,
              subject: "",
              text: "",
              startDate: localize.getLocalizedMoment().toDate(),
              endDate: localize.getLocalizedMoment().add(1, "day").toDate(),
              currentTarget: this.getPredefinedWorkspaceByIdToConcat(
                this.props
              ),
            },
            this.props.workspaceId || ""
          );
          closeDialog();
        },

        /**
         * fail - set locked false
         */
        fail: () => {
          this.setState({ locked: false });
        },
      });
    }
  }

  /**
   * handleDateChange
   * @param stateLocation stateLocation
   * @param newDate newDate
   */
  handleDateChange(stateLocation: string, newDate: Date) {
    const nState: any = {};
    nState[stateLocation] = newDate;
    this.setStateAndStore(
      nState,
      (this.props.announcement ? this.props.announcement.id + "-" : "") +
        (this.props.workspaceId || "")
    );
  }

  /**
   * handlePinnedChange
   * @param e event
   */
  handlePinnedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pinned = e.target.checked;
    this.setStateAndStore(
      { pinned },
      (this.props.announcement ? this.props.announcement.id + "-" : "") +
        (this.props.workspaceId || "")
    );
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    let editorTitle: string;
    if (this.props.announcement) {
      editorTitle =
        this.props.i18n.t("labels.edit", { context: "announcement" }) +
        " - " +
        this.props.i18n.t("labels.content");
    } else {
      editorTitle =
        this.props.i18n.t("labels.create", {
          context: "announcement",
        }) +
        " - " +
        this.props.i18n.t("labels.content");
    }

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => any) => [
      // FOR DESIGN CHECK https://github.com/Hacker0x01/react-datepicker
      <div
        className="env-dialog__row env-dialog__row--dates"
        key="annnouncement-edit-1"
      >
        <div className="env-dialog__form-element-container">
          <label htmlFor="announcementStartSate" className="env-dialog__label">
            {this.props.i18n.t("labels.beginDate")}
          </label>
          <DatePicker
            id="announcementStartSate"
            className="env-dialog__input env-dialog__input--date-picker"
            selected={this.state.startDate}
            onChange={this.handleDateChange.bind(this, "startDate")}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
          />
        </div>
        <div className="env-dialog__form-element-container">
          <label htmlFor="announcementEndDate" className="env-dialog__label">
            {this.props.i18n.t("labels.endDate")}
          </label>
          <DatePicker
            id="announcementEndDate"
            className="env-dialog__input env-dialog__input--date-picker"
            selected={this.state.endDate}
            onChange={this.handleDateChange.bind(this, "endDate")}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
          />
        </div>
        <div className="env-dialog__form-element-container env-dialog__form-element-container--pinned-thread">
          <input
            id="announcementPinned"
            type="checkbox"
            className="env-dialog__input"
            checked={this.state.pinned}
            onChange={this.handlePinnedChange}
          />
          <label
            htmlFor="announcementPinned"
            className="env-dialog__input-label"
          >
            {this.props.i18n.t("labels.pinAnnouncement", { ns: "messaging" })}
          </label>
        </div>
      </div>,
      <InputContactsAutofill
        identifier="announcementRecipients"
        modifier="new-announcement-recipients"
        key="annnouncement-edit-2"
        hasUserPermission={false}
        hasGroupPermission={
          this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_GROUPS
        }
        hasWorkspacePermission={
          this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_WORKSPACES
        }
        workspacePermissionIsOnlyMyWorkspaces={
          !this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT
        }
        selectedItems={this.state.currentTarget}
        onChange={this.setTargetItems}
        autofocus={!this.props.announcement}
        showFullNames={false}
        placeholder={this.props.i18n.t("labels.search", {
          ns: "messaging",
          context: "target",
        })}
        label={this.props.i18n.t("labels.target", { ns: "messaging" })}
        required={this.props.status.roles.includes(Role.Teacher)}
      />,
      <div className="env-dialog__row" key="annnouncement-edit-3">
        <div className="env-dialog__form-element-container  env-dialog__form-element-container--title">
          <label htmlFor="announcementTitle" className="env-dialog__label">
            {this.props.i18n.t("labels.title", {
              ns: "messaging",
              context: "announcement",
            })}
          </label>
          <input
            id="announcementTitle"
            type="text"
            className="env-dialog__input"
            value={this.state.subject}
            onChange={this.onSubjectChange}
            autoFocus={!!this.props.announcement}
          />
        </div>
      </div>,
      <div
        className="env-dialog__row env-dialog__row--ckeditor"
        key="annnouncement-edit-4"
      >
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.content")}
          </label>
          <CKEditor editorTitle={editorTitle} onChange={this.onCKEditorChange}>
            {this.state.text}
          </CKEditor>
        </div>
      </div>,
    ];

    /**
     * footer
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          className="button button--dialog-execute"
          onClick={this.createOrModifyAnnouncement.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.t("actions.save")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.t("actions.remove", { context: "draft" })}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-edit-announcement"
        onOpen={this.checkAgainstStoredState}
        title={
          this.props.announcement
            ? this.props.i18n.t("labels.edit", {
                context: "announcement",
              })
            : this.props.i18n.t("labels.create", {
                context: "announcement",
              })
        }
        content={content}
        footer={footer}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    userIndex: state.userIndex,
    status: state.status,

    //For use with workspaces when announcement gives a workspace
    //it needs to be fetched from somewhere, this is set by default
    //when loading
    workspaceId: state.announcements.workspaceId,
    workspaces: state.workspaces,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { createAnnouncement, updateAnnouncement, displayNotification },
    dispatch
  );
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(NewEditAnnouncement)
);
