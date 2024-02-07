/* eslint-disable @typescript-eslint/no-explicit-any */
import Notifications from "../components/base/notifications";
import DisconnectedWarningDialog from "../components/base/disconnect-warning";
import { BrowserRouter, Route } from "react-router-dom";
import * as React from "react";
import "~/sass/util/base.scss";
import { Store } from "react-redux";
import { StateType } from "~/reducers";
import { Action } from "redux";
import Websocket from "~/util/websocket";
import titleActions from "~/actions/base/title";
import WorkspaceHomeBody from "~/components/workspace/workspaceHome";
import WorkspaceHelpBody from "~/components/workspace/workspaceHelp";
import WorkspaceDiscussionBody from "~/components/workspace/workspaceDiscussions";
import WorkspaceAnnouncementsBody from "~/components/workspace/workspaceAnnouncements";
import WorkspaceAnnouncerBody from "~/components/workspace/workspaceAnnouncer";
import WorkspaceMaterialsBody from "~/components/workspace/workspaceMaterials";
import WorkspaceJournalBody from "~/components/workspace/workspaceJournal";
import WorkspaceManagementBody from "~/components/workspace/workspaceManagement";
import WorkspaceUsersBody from "~/components/workspace/workspaceUsers";
import WorkspacePermissionsBody from "~/components/workspace/workspacePermissions";
import { RouteComponentProps } from "react-router";
import {
  setCurrentWorkspace,
  loadStaffMembersOfWorkspace,
  updateLastWorkspaces,
  loadStudentsOfWorkspace,
  loadWorkspaceDetailsInCurrentWorkspace,
  loadWorkspaceTypes,
  loadCurrentWorkspaceUserGroupPermissions,
  /* loadWorkspaceChatStatus, */
  setAvailableCurriculums,
  loadLastWorkspacesFromServer,
} from "~/actions/workspaces";
import {
  loadAnnouncementsAsAClient,
  loadAnnouncement,
  loadAnnouncements,
} from "~/actions/announcements";
import {
  loadDiscussionAreasFromServer,
  loadDiscussionThreadsFromServer,
  loadDiscussionThreadFromServer,
  setDiscussionWorkpaceId,
  loadSubscribedDiscussionThreadList,
  showOnlySubscribedThreads,
  loadSubscribedDiscussionAreaList,
} from "~/actions/discussion";
import { CKEDITOR_VERSION } from "~/lib/ckeditor";
import { displayNotification } from "~/actions/base/notifications";
import WorkspaceEvaluationBody from "../components/workspace/workspaceEvaluation/index";
import {
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationGradingSystemFromServer,
  loadEvaluationSortFunctionFromServer,
  loadEvaluationWorkspacesFromServer,
  loadListOfImportantAssessmentIdsFromServer,
  loadListOfUnimportantAssessmentIdsFromServer,
  setSelectedWorkspaceId,
} from "~/actions/main-function/evaluation/evaluationActions";
import { registerLocale } from "react-datepicker";
import * as moment from "moment";
import { enGB, fi } from "date-fns/locale";
import EasyToUseFunctions from "~/components/easy-to-use-reading-functions/easy-to-use-functions";
import { DiscussionStatePatch } from "~/reducers/discussion";
import { loadCurrentWorkspaceJournalsFromServer } from "~/actions/workspaces/journals";
import {
  loadWholeWorkspaceHelp,
  loadWholeWorkspaceMaterials,
  loadWorkspaceCompositeMaterialReplies,
  setCurrentWorkspaceMaterialsActiveNodeId,
} from "~/actions/workspaces/material";
import i18n from "../locales/i18n";
import ReadspeakerProvider from "~/components/context/readspeaker-context";
import { ChatWebsocketContextProvider } from "~/components/chat/context/chat-websocket-context";
import Chat from "~/components/chat";
registerLocale("fi", fi);
registerLocale("enGB", enGB);

moment.locale("fi");

/**
 * WorkspaceProps
 */
interface WorkspaceProps {
  store: Store<StateType>;
  websocket: Websocket;
}

/**
 * WorkspaceState
 */
interface WorkspaceState {
  enrollmentDialogOpen: boolean;
  signupDialogOpen: boolean;
}

(window as any).USES_HISTORY_API = true;

/**
 * Workspace
 */
export default class Workspace extends React.Component<
  WorkspaceProps,
  WorkspaceState
> {
  private prevPathName: string;
  private itsFirstTime: boolean;
  private loadedLibs: Array<string>;
  private subscribedChatSettings = false;
  private loadedChatSettings = false;

  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceProps) {
    super(props);

    this.itsFirstTime = true;
    this.loadedLibs = [];

    this.updateFirstTime = this.updateFirstTime.bind(this);
    this.onHashChange = this.onHashChange.bind(this);
    this.renderWorkspaceHome = this.renderWorkspaceHome.bind(this);
    this.renderWorkspaceHelp = this.renderWorkspaceHelp.bind(this);
    this.renderWorkspaceDiscussions =
      this.renderWorkspaceDiscussions.bind(this);
    this.renderWorkspaceAnnouncements =
      this.renderWorkspaceAnnouncements.bind(this);
    this.renderWorkspaceAnnouncer = this.renderWorkspaceAnnouncer.bind(this);
    this.renderWorkspaceMaterials = this.renderWorkspaceMaterials.bind(this);
    this.renderWorkspaceUsers = this.renderWorkspaceUsers.bind(this);
    this.renderWorkspaceJournal = this.renderWorkspaceJournal.bind(this);
    this.renderWorkspaceManagement = this.renderWorkspaceManagement.bind(this);
    this.renderWorkspaceEvaluation = this.renderWorkspaceEvaluation.bind(this);
    this.renderWorkspacePermissions =
      this.renderWorkspacePermissions.bind(this);
    this.loadWorkspaceDiscussionData =
      this.loadWorkspaceDiscussionData.bind(this);
    this.loadWorkspaceAnnouncementsData =
      this.loadWorkspaceAnnouncementsData.bind(this);
    this.loadWorkspaceAnnouncerData =
      this.loadWorkspaceAnnouncerData.bind(this);
    this.loadWorkspaceMaterialsData =
      this.loadWorkspaceMaterialsData.bind(this);
    this.loadWorkspaceUsersData = this.loadWorkspaceUsersData.bind(this);
    this.loadWorkspaceHelpData = this.loadWorkspaceHelpData.bind(this);
    this.closeEnrollmentDialog = this.closeEnrollmentDialog.bind(this);
    this.closeSignupDialog = this.closeSignupDialog.bind(this);

    this.onWorkspaceMaterialsBodyActiveNodeIdChange =
      this.onWorkspaceMaterialsBodyActiveNodeIdChange.bind(this);
    this.onWorkspaceHelpBodyActiveNodeIdChange =
      this.onWorkspaceHelpBodyActiveNodeIdChange.bind(this);

    window.addEventListener("hashchange", this.onHashChange.bind(this));

    this.state = {
      enrollmentDialogOpen: !props.store.getState().status.loggedIn,
      signupDialogOpen: false,
    };
  }

  /**
   * closeEnrollmentDialog
   */
  closeEnrollmentDialog() {
    this.setState({
      enrollmentDialogOpen: false,
    });
  }

  /**
   * closeSignupDialog
   */
  closeSignupDialog() {
    this.setState({
      signupDialogOpen: false,
    });
  }

  /**
   * loadlib
   * @param url url
   * @param onload onload
   */
  loadlib(url: string, onload?: () => void) {
    if (this.loadedLibs.indexOf(url) !== -1) {
      return;
    }
    this.loadedLibs.push(url);

    const script = document.createElement("script");
    script.src = url;
    if (onload) {
      script.onload = onload;
    }
    document.head.appendChild(script);
  }

  /**
   * onHashChange
   */
  onHashChange() {
    if (window.location.pathname.includes("/discussion")) {
      this.loadWorkspaceDiscussionData(
        window.location.hash.replace("#", "").split("/")
      );
    } else if (window.location.pathname.includes("/announcements")) {
      this.loadWorkspaceAnnouncementsData(
        parseInt(window.location.hash.replace("#", ""))
      );
    } else if (window.location.pathname.includes("/announcer")) {
      this.loadWorkspaceAnnouncerData(
        window.location.hash.replace("#", "").split("/")
      );
    } else if (window.location.pathname.includes("/materials")) {
      const hashvalue = window.location.hash.replace("#", "");
      // the scroll can be buggy and it can attempt to load sections
      // like usual browser scrolling that is very unpredictable
      if (!hashvalue.startsWith("s-")) {
        const supposedLoadedSection =
          hashvalue &&
          parseInt(window.location.hash.replace("#", "").replace("p-", ""));
        const signupDialogOn = hashvalue === "signup";
        if (signupDialogOn) {
          this.setState({
            signupDialogOpen: true,
          });
        } else if (supposedLoadedSection) {
          this.loadWorkspaceMaterialsData(supposedLoadedSection);
        } else if (
          this.props.store.getState().workspaces.currentMaterials &&
          this.props.store.getState().workspaces.currentMaterials[0] &&
          this.props.store.getState().workspaces.currentMaterials[0].children[0]
        ) {
          this.loadWorkspaceMaterialsData(
            this.props.store.getState().workspaces.currentMaterials[0]
              .children[0].workspaceMaterialId
          );
        }
      }
    } else if (window.location.pathname.includes("/help")) {
      const hashvalue = window.location.hash.replace("#", "");
      if (!hashvalue.startsWith("s-")) {
        if (window.location.hash.replace("#", "")) {
          this.loadWorkspaceHelpData(
            parseInt(window.location.hash.replace("#", "").replace("p-", ""))
          );
        } else if (
          this.props.store.getState().workspaces.currentMaterials &&
          this.props.store.getState().workspaces.currentMaterials[0] &&
          this.props.store.getState().workspaces.currentMaterials[0].children[0]
        ) {
          this.loadWorkspaceHelpData(
            this.props.store.getState().workspaces.currentMaterials[0]
              .children[0].workspaceMaterialId
          );
        }
      }
    } else if (window.location.pathname.includes("/users")) {
      this.loadWorkspaceUsersData();
    }
  }

  /**
   * onWorkspaceMaterialsBodyActiveNodeIdChange
   * @param newId newId
   */
  onWorkspaceMaterialsBodyActiveNodeIdChange(newId: number) {
    const state: StateType = this.props.store.getState();
    const workspaceNameExtension = state.workspaces.currentWorkspace
      .nameExtension
      ? " (" + state.workspaces.currentWorkspace.nameExtension + ")"
      : "";
    const workspaceName =
      state.workspaces.currentWorkspace.name + workspaceNameExtension;

    if (!newId) {
      history.pushState(null, null, location.origin + location.pathname + "#");
      if (
        state.workspaces.currentMaterials &&
        state.workspaces.currentMaterials[0] &&
        state.workspaces.currentMaterials[0].children[0]
      ) {
        this.loadWorkspaceMaterialsData(
          state.workspaces.currentMaterials[0].children[0].workspaceMaterialId
        );

        if (state.workspaces.currentWorkspace.isCourseMember) {
          this.props.store.dispatch(
            updateLastWorkspaces({
              url: location.origin + location.pathname,
              workspaceId: state.workspaces.currentWorkspace.id,
              workspaceName: workspaceName,
              materialName:
                state.workspaces.currentMaterials[0].children[0].title,
            }) as Action
          );
        }
      }
    } else {
      const newHash = "#p-" + newId;
      // defusing the new id
      if (newHash !== location.hash) {
        // TODO At this point the baseURI goes bad after opening and closing the material editor and scrolling

        const element = document.querySelector(newHash);
        if (element) {
          element.id = "";
        }
        history.pushState(
          null,
          null,
          location.origin + location.pathname + newHash
        );
        if (element) {
          element.id = "p-" + newId;
        }
      }

      this.loadWorkspaceMaterialsData(newId);

      if (state.workspaces.currentWorkspace.isCourseMember) {
        let indexFound = -1;
        const materialChapter = state.workspaces.currentMaterials.find((m) => {
          const index = m.children.findIndex(
            (s) => s.workspaceMaterialId === newId
          );
          if (index !== -1) {
            indexFound = index;
          }
          return index !== -1;
        });
        if (indexFound !== -1) {
          this.props.store.dispatch(
            updateLastWorkspaces({
              url: location.origin + location.pathname + newHash,
              workspaceId: state.workspaces.currentWorkspace.id,
              workspaceName: workspaceName,
              materialName: materialChapter.children[indexFound].title,
            }) as Action
          );
        }
      }
    }
  }

  /**
   * onWorkspaceHelpBodyActiveNodeIdChange
   * @param newId newId
   */
  onWorkspaceHelpBodyActiveNodeIdChange(newId: number) {
    const state: StateType = this.props.store.getState();

    if (!newId) {
      history.pushState(null, null, "#");
      if (
        state.workspaces.currentHelp &&
        state.workspaces.currentHelp[0] &&
        state.workspaces.currentHelp[0].children[0]
      ) {
        this.loadWorkspaceHelpData(
          state.workspaces.currentHelp[0].children[0].workspaceMaterialId
        );
      }
    } else {
      const newHash = "#p-" + newId;
      // defusing the new id
      if (newHash !== location.hash) {
        const element = document.querySelector(newHash);
        if (element) {
          element.id = "";
        }
        history.pushState(null, null, newHash);
        if (element) {
          element.id = "p-" + newId;
        }
      }

      this.loadWorkspaceHelpData(newId);
    }
  }

  /**
   * renderWorkspaceHome
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceHome(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const state = this.props.store.getState();

      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          /**
           * success
           * @param workspace workspace
           */
          success: (workspace) => {
            if (!workspace.staffMembers && state.status.loggedIn) {
              this.props.store.dispatch(
                loadStaffMembersOfWorkspace({ workspace }) as Action
              );
            }
            this.props.store.dispatch(titleActions.updateTitle(workspace.name));
          },
        }) as Action
      );

      this.props.store.dispatch(setAvailableCurriculums() as Action);

      if (
        state.status.loggedIn &&
        state.status.isActiveUser &&
        state.status.permissions.WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS
      ) {
        this.props.store.dispatch(
          loadAnnouncementsAsAClient({
            hideEnvironmentAnnouncements: true,
            workspaceEntityId: state.status.currentWorkspaceId,
          }) as Action
        );
      }
    }

    return (
      <WorkspaceHomeBody workspaceUrl={props.match.params["workspaceUrl"]} />
    );
  }

  /**
   * renderWorkspaceHelp
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceHelp(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(
          i18n.t("labels.instructions", { ns: "workspace" })
        )
      );
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          loadDetails:
            state.status.permissions.WORKSPACE_VIEW_WORKSPACE_DETAILS,
        }) as Action
      );
      this.props.store.dispatch(
        loadWholeWorkspaceHelp(
          state.status.currentWorkspaceId,
          state.status.permissions.WORKSPACE_MANAGE_WORKSPACE,
          (result) => {
            if (!window.location.hash.replace("#", "") && result[0]) {
              this.loadWorkspaceHelpData(result[0].workspaceMaterialId);
            } else if (window.location.hash.replace("#", "")) {
              this.loadWorkspaceHelpData(
                parseInt(
                  window.location.hash.replace("#", "").replace("p-", "")
                )
              );
            }
          }
        ) as Action
      );
    }

    return (
      <WorkspaceHelpBody
        workspaceUrl={props.match.params["workspaceUrl"]}
        onActiveNodeIdChange={this.onWorkspaceHelpBodyActiveNodeIdChange}
      />
    );
  }

  /**
   * renderWorkspaceDiscussions
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceDiscussions(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(i18n.t("labels.discussion"))
      );
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
        }) as Action
      );
      this.props.store.dispatch(
        setDiscussionWorkpaceId(state.status.currentWorkspaceId) as Action
      );

      this.props.store.dispatch(
        loadDiscussionAreasFromServer(() => {
          const currentLocation = window.location.hash
            .replace("#", "")
            .split("/");
          this.loadWorkspaceDiscussionData(currentLocation);
        }) as Action
      );
    }

    return (
      <WorkspaceDiscussionBody
        workspaceUrl={props.match.params["workspaceUrl"]}
      />
    );
  }

  /**
   * renderWorkspaceAnnouncements
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceAnnouncements(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(
          i18n.t("labels.announcements", { ns: "messaging" })
        )
      );

      //Maybe we shouldn't load again, but whatever, maybe it updates
      this.props.store.dispatch(
        loadAnnouncementsAsAClient({
          hideEnvironmentAnnouncements: true,
          workspaceEntityId: state.status.currentWorkspaceId,
        }) as Action
      );

      this.loadWorkspaceAnnouncementsData(
        parseInt(window.location.hash.replace("#", ""))
      );
    }
    return (
      <WorkspaceAnnouncementsBody
        workspaceUrl={props.match.params["workspaceUrl"]}
      />
    );
  }

  /**
   * renderWorkspaceAnnouncer
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceAnnouncer(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(i18n.t("labels.announcer"))
      );
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
        }) as Action
      );

      if (!window.location.hash) {
        window.location.hash = "#active";
      } else {
        this.loadWorkspaceAnnouncerData(
          window.location.hash.replace("#", "").split("/")
        );
      }
    }
    return (
      <WorkspaceAnnouncerBody
        workspaceUrl={props.match.params["workspaceUrl"]}
      />
    );
  }

  /**
   * updateFirstTime
   */
  updateFirstTime() {
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
  }

  /**
   * loadWorkspaceDiscussionData
   * @param location location
   */
  loadWorkspaceDiscussionData(location: string[]) {
    const state = this.props.store.getState();

    // Load subscribed areas and threads every time
    this.props.store.dispatch(loadSubscribedDiscussionAreaList({}) as Action);
    this.props.store.dispatch(loadSubscribedDiscussionThreadList({}) as Action);

    if (location.includes("subs")) {
      if (location.length <= 2) {
        const payload: DiscussionStatePatch = {
          current: state.discussion.current && undefined,
          areaId: undefined,
        };

        this.props.store.dispatch({
          type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
          payload,
        });

        this.props.store.dispatch(
          showOnlySubscribedThreads({ value: true }) as Action
        );
      } else {
        this.props.store.dispatch(
          loadDiscussionThreadFromServer({
            areaId: parseInt(location[1]),
            threadId: parseInt(location[2]),
            threadPage: parseInt(location[3]) || 1,
          }) as Action
        );
      }
    } else {
      state.discussion.subscribedThreadOnly &&
        this.props.store.dispatch(
          showOnlySubscribedThreads({ value: false }) as Action
        );

      if (location.length <= 2) {
        const payload: DiscussionStatePatch = {
          areaId: undefined,
        };

        // As first item of location array is areaId
        // And if there is not area, then redux state must be updated to
        // to indicate this. So setting area id to undefined
        !location[0] &&
          this.props.store.dispatch({
            type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
            payload,
          });

        //The link is expected to be like # none, in this case it will collapse to null, page 1
        //Else it can be #1 in that case it will collapse to area 1, page 1
        //Or otherwise #1/2 in that case it will collapse to area 1 page 2
        this.props.store.dispatch(
          loadDiscussionThreadsFromServer({
            areaId: parseInt(location[0]) || null,
            page: parseInt(location[1]) || 1,
            forceRefresh: true,
          }) as Action
        );
      } else {
        //There will always be an areaId and page designed #1/2/3 where then 3 is the threaid
        //and there can be a page as #1/2/3/4
        this.props.store.dispatch(
          loadDiscussionThreadFromServer({
            areaId: parseInt(location[2]),
            threadId: parseInt(location[3]),
            threadPage: parseInt(location[4]) || 1,
          }) as Action
        );
      }
    }
  }

  /**
   * loadWorkspaceAnnouncementsData
   * @param announcementId announcementId
   */
  loadWorkspaceAnnouncementsData(announcementId: number) {
    this.props.store.dispatch(loadAnnouncement(null, announcementId) as Action);
  }

  /**
   * loadWorkspaceAnnouncerData
   * @param location location
   */
  loadWorkspaceAnnouncerData(location: string[]) {
    const actualLocation = location.filter((l) => !!l);
    const state = this.props.store.getState();
    if (actualLocation.length === 1) {
      this.props.store.dispatch(
        loadAnnouncements(
          actualLocation[0],
          state.status.currentWorkspaceId
        ) as Action
      );
    } else {
      this.props.store.dispatch(
        loadAnnouncement(
          actualLocation[0],
          parseInt(actualLocation[1]),
          state.status.currentWorkspaceId
        ) as Action
      );
    }
  }

  /**
   * loadWorkspaceMaterialsData
   * @param id id
   */
  loadWorkspaceMaterialsData(id: number): void {
    if (id) {
      this.props.store.dispatch(
        setCurrentWorkspaceMaterialsActiveNodeId(id) as Action
      );
    }
  }

  /**
   * loadWorkspaceHelpData
   * @param id id
   */
  loadWorkspaceHelpData(id: number): void {
    if (id) {
      this.props.store.dispatch(
        setCurrentWorkspaceMaterialsActiveNodeId(id) as Action
      );
    }
  }

  /**
   * loadWorkspaceUsersData
   */
  loadWorkspaceUsersData(): void {
    const state = this.props.store.getState();

    this.props.store.dispatch(
      setCurrentWorkspace({
        workspaceId: state.status.currentWorkspaceId,
        /**
         * success
         * @param workspace workspace
         */
        success: (workspace) => {
          if (!workspace.staffMembers && state.status.loggedIn) {
            this.props.store.dispatch(
              loadStaffMembersOfWorkspace({ workspace }) as Action
            );
          }
          if (state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS) {
            this.props.store.dispatch(
              loadStudentsOfWorkspace({
                workspace,
                payload: {
                  q: "",
                  firstResult: 0,
                  maxResults: 10,
                  active: true,
                },
              }) as Action
            );
            this.props.store.dispatch(
              loadStudentsOfWorkspace({
                workspace,
                payload: {
                  q: "",
                  firstResult: 0,
                  maxResults: 10,
                  active: false,
                },
              }) as Action
            );
          }
        },
      }) as Action
    );
  }

  /**
   * renderWorkspaceMaterials
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceMaterials(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const hasLocationHashAndWillHaveToScrollIntoPosition =
        window.location.hash.replace("#", "");
      if (hasLocationHashAndWillHaveToScrollIntoPosition) {
        // super hack in order to deal with the buggy scrolling
        // triggering on scroll when scrolling into view
        // instead of snapping at the anchor
        (window as any).IGNORE_SCROLL_EVENTS = true;
      }

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(
          i18n.t("labels.materials", { ns: "materials" })
        )
      );
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          loadDetails:
            state.status.permissions.WORKSPACE_VIEW_WORKSPACE_DETAILS,
        }) as Action
      );
      this.props.store.dispatch(
        loadWorkspaceCompositeMaterialReplies(
          state.status.currentWorkspaceId
        ) as Action
      );

      state.status.loggedIn &&
        this.props.store.dispatch(loadLastWorkspacesFromServer() as Action);
      this.props.store.dispatch(
        loadWholeWorkspaceMaterials(
          state.status.currentWorkspaceId,
          true,
          (result) => {
            if (
              !hasLocationHashAndWillHaveToScrollIntoPosition &&
              result[0] &&
              result[0].children &&
              result[0].children[0]
            ) {
              this.loadWorkspaceMaterialsData(
                result[0].children[0].workspaceMaterialId
              );
            } else if (hasLocationHashAndWillHaveToScrollIntoPosition) {
              // this is executing on first time
              /**
               * scrollToElement
               */
              const scrollToElement = () => {
                const element = document.querySelector(window.location.hash);
                if (element) {
                  element.scrollIntoView({
                    behavior: "auto",
                    block: "nearest",
                    inline: "start",
                  });
                  return true;
                }

                return false;
              };

              /**
               * checkIsScrolledIntoView
               */
              const checkIsScrolledIntoView = () => {
                const element = document.querySelector(window.location.hash);
                if (!element) {
                  return false;
                }

                const rect = element.getBoundingClientRect();
                const elemTop = rect.top;
                const elemBottom = rect.bottom;

                const isVisible =
                  elemTop < window.innerHeight && elemBottom >= 0;

                return isVisible;
              };

              /**
               * aggressiveSetToScrollPosition
               */
              const aggressiveSetToScrollPosition = () => {
                scrollToElement();
                setTimeout(() => {
                  if (!checkIsScrolledIntoView()) {
                    setTimeout(aggressiveSetToScrollPosition, 10);
                  } else {
                    setTimeout(() => {
                      window.dispatchEvent(new Event("CHECK_LAZY"));
                    }, 500);
                    // now we can restablish the scroll events
                    // and check the lazy loaders so they turn back
                    // on
                    // but because browsers try to be incredibly smart
                    // and want to totally refuse giving me control of scroll
                    // we have to wait 1 second
                    setTimeout(() => {
                      (window as any).IGNORE_SCROLL_EVENTS = false;
                      window.dispatchEvent(new Event("CHECK_LAZY"));
                    }, 1000);
                  }
                }, 10);
              };

              aggressiveSetToScrollPosition();

              this.loadWorkspaceMaterialsData(
                parseInt(
                  window.location.hash.replace("#", "").replace("p-", "")
                )
              );
            }
          }
        ) as Action
      );

      if (
        state.status.loggedIn &&
        state.status.isStudent &&
        !state.status.permissions.WORKSPACE_IS_WORKSPACE_STUDENT
      ) {
        if (!state.status.canCurrentWorkspaceSignup) {
          this.props.store.dispatch(
            displayNotification(
              i18n.t("content.cannotSignUpWarning", { ns: "workspace" }),
              "notice"
            ) as Action
          );
        } else {
          this.props.store.dispatch(
            displayNotification(
              i18n.t("content.notSignedUpWarning", { ns: "materials" }) +
                ` <a href="#signup">${i18n.t("actions.notSignedUpWarning", {
                  ns: "materials",
                })}</a>`,
              "notice"
            ) as Action
          );
        }
      }
    }

    return (
      <WorkspaceMaterialsBody
        workspaceUrl={props.match.params["workspaceUrl"]}
        onActiveNodeIdChange={this.onWorkspaceMaterialsBodyActiveNodeIdChange}
        enrollmentDialogOpen={this.state.enrollmentDialogOpen}
        signupDialogOpen={this.state.signupDialogOpen}
        onCloseSignupDialog={this.closeSignupDialog}
        onCloseEnrollmentDialog={this.closeEnrollmentDialog}
      />
    );
  }

  /**
   * renderWorkspaceUsers
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceUsers(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      this.props.store.dispatch(
        titleActions.updateTitle(i18n.t("labels.users", { ns: "users" }))
      );
      this.loadWorkspaceUsersData();
    }

    return (
      <WorkspaceUsersBody workspaceUrl={props.match.params["workspaceUrl"]} />
    );
  }

  /**
   * renderWorkspaceJournal
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceJournal(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(i18n.t("labels.journal", { ns: "journal" }))
      );
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          /**
           * success
           * @param workspace workspace
           */
          success: (workspace) => {
            if (state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS) {
              this.props.store.dispatch(
                loadStudentsOfWorkspace({
                  workspace,
                  payload: { q: "", maxResults: 500 },
                }) as Action
              );
            }
            if (
              state.journals.state !== "READY" &&
              state.journals.journals.length === 0
            ) {
              if (state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS) {
                // This happens if teacher/admin uses diary
                this.props.store.dispatch(
                  loadCurrentWorkspaceJournalsFromServer() as Action
                );
              } else {
                this.props.store.dispatch(
                  loadCurrentWorkspaceJournalsFromServer(
                    state.status.userId
                  ) as Action
                );
              }
            }
          },
        }) as Action
      );
    }

    return (
      <WorkspaceJournalBody workspaceUrl={props.match.params["workspaceUrl"]} />
    );
  }

  /**
   * renderWorkspaceManagement
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceManagement(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`,
        () => {
          (window as any).CKEDITOR.disableAutoInline = true;
        }
      );

      const state = this.props.store.getState();
      this.props.store.dispatch(
        titleActions.updateTitle(i18n.t("labels.settings", { ns: "common" }))
      );
      this.props.store.dispatch(loadWorkspaceTypes() as Action);
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          /**
           * success
           */
          success: () => {
            this.props.store.dispatch(
              loadCurrentWorkspaceUserGroupPermissions() as Action
            );
            if (state.status.permissions.WORKSPACE_VIEW_WORKSPACE_DETAILS) {
              this.props.store.dispatch(
                loadWorkspaceDetailsInCurrentWorkspace() as Action
              );
            }
            /* this.props.store.dispatch(loadWorkspaceChatStatus() as Action); */
          },
        }) as Action
      );
    }

    return (
      <WorkspaceManagementBody
        workspaceUrl={props.match.params["workspaceUrl"]}
      />
    );
  }

  /**
   * renderWorkspacePermissions
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspacePermissions(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      const state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle("Permissions"));
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          /**
           * success
           */
          success: () => {
            this.props.store.dispatch(
              loadCurrentWorkspaceUserGroupPermissions() as Action
            );
          },
        }) as Action
      );
    }

    return (
      <WorkspacePermissionsBody
        workspaceUrl={props.match.params["workspaceUrl"]}
      />
    );
  }

  /**
   * renderWorkspaceEvaluation
   * @param props props
   * @returns JSX.Element
   */
  renderWorkspaceEvaluation(props: RouteComponentProps<any>) {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      const state = this.props.store.getState();

      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.websocket && this.props.websocket.restoreEventListeners();
      this.props.store.dispatch(
        titleActions.updateTitle(i18n.t("labels.evaluation"))
      );
      this.props.store.dispatch(
        setCurrentWorkspace({
          workspaceId: state.status.currentWorkspaceId,
          /**
           * success
           * @param workspace workspace
           */
          success: (workspace) => {
            this.props.store.dispatch(
              loadCurrentWorkspaceUserGroupPermissions() as Action
            );

            this.props.store.dispatch(
              loadEvaluationAssessmentRequestsFromServer(true) as Action
            );
            this.props.store.dispatch(
              loadEvaluationWorkspacesFromServer() as Action
            );
            this.props.store.dispatch(
              loadListOfImportantAssessmentIdsFromServer() as Action
            );
            this.props.store.dispatch(
              loadListOfUnimportantAssessmentIdsFromServer() as Action
            );
            this.props.store.dispatch(
              loadEvaluationGradingSystemFromServer() as Action
            );
            this.props.store.dispatch(
              loadEvaluationSortFunctionFromServer() as Action
            );

            this.props.store.dispatch(
              setSelectedWorkspaceId({
                workspaceId: workspace.id,
              }) as Action
            );
          },
        }) as Action
      );
    }

    return (
      <WorkspaceEvaluationBody
        workspaceUrl={props.match.params["workspaceUrl"]}
      />
    );
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <ReadspeakerProvider>
        <BrowserRouter>
          <div id="root">
            <ChatWebsocketContextProvider websocket={this.props.websocket}>
              <Chat />
            </ChatWebsocketContextProvider>
            <Notifications></Notifications>
            <DisconnectedWarningDialog />
            <EasyToUseFunctions />

            <Route
              exact
              path="/workspace/:workspaceUrl/"
              render={this.renderWorkspaceHome}
            />
            <Route
              path="/workspace/:workspaceUrl/help"
              render={this.renderWorkspaceHelp}
            />
            <Route
              path="/workspace/:workspaceUrl/discussions"
              render={this.renderWorkspaceDiscussions}
            />
            <Route
              path="/workspace/:workspaceUrl/announcements"
              render={this.renderWorkspaceAnnouncements}
            />
            <Route
              path="/workspace/:workspaceUrl/announcer"
              render={this.renderWorkspaceAnnouncer}
            />
            <Route
              path="/workspace/:workspaceUrl/materials"
              render={this.renderWorkspaceMaterials}
            />
            <Route
              path="/workspace/:workspaceUrl/users"
              render={this.renderWorkspaceUsers}
            />
            <Route
              path="/workspace/:workspaceUrl/journal"
              render={this.renderWorkspaceJournal}
            />
            <Route
              path="/workspace/:workspaceUrl/workspace-management"
              render={this.renderWorkspaceManagement}
            />
            <Route
              path="/workspace/:workspaceUrl/permissions"
              render={this.renderWorkspacePermissions}
            />
            <Route
              path="/workspace/:workspaceUrl/evaluation"
              render={this.renderWorkspaceEvaluation}
            />
          </div>
        </BrowserRouter>
      </ReadspeakerProvider>
    );
  }
}
