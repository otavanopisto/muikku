import Notifications from "../components/base/notifications";
import DisconnectedWarningDialog from "../components/base/disconnect-warning";
import { BrowserRouter, Route } from "react-router-dom";
import * as React from "react";
import "~/sass/util/base.scss";
import { StateType } from "~/reducers";
import { Action, Store } from "redux";
import Websocket from "~/util/websocket";
import * as queryString from "query-string";
import IndexBody from "../components/index/body";
import { loadAnnouncementsAsAClient } from "~/actions/announcements";
import { loadLastMessageThreadsFromServer } from "~/actions/main-function/messages";
import CousePickerBody from "../components/coursepicker/body";
import { loadLoggedUser } from "~/actions/user-index";
import {
  loadWorkspacesFromServer,
  loadUserWorkspaceCurriculumFiltersFromServer,
  setWorkspaceStateFilters,
  loadUserWorkspaceEducationFiltersFromServer,
} from "~/actions/workspaces";
import {
  loadLastWorkspacesFromServer,
  loadUserWorkspacesFromServer,
} from "~/actions/workspaces";
import {
  loadUsers,
  loadUserGroups,
  loadStudyprogrammes,
} from "~/actions/main-function/users";
import { WorkspacesActiveFiltersType } from "~/reducers/workspaces";
import OrganizationAdministrationBody from "../components/organization/body";
import CommunicatorBody from "../components/communicator/body";
import {
  loadNewlyReceivedMessage,
  loadMessageThreads,
  loadMessageThread,
  loadMessagesNavigationLabels,
  loadSignature,
} from "~/actions/main-function/messages";
import DiscussionBody from "../components/discussion/body";
import {
  loadDiscussionAreasFromServer,
  loadDiscussionThreadsFromServer,
  loadDiscussionThreadFromServer,
  setDiscussionWorkpaceId,
  loadSubscribedDiscussionThreadList,
  showOnlySubscribedThreads,
  loadSubscribedDiscussionAreaList,
} from "~/actions/discussion";
import { loadAnnouncement, loadAnnouncements } from "~/actions/announcements";
import AnnouncementsBody from "../components/announcements/body";
import AnnouncerBody from "../components/announcer/body";
import {
  updateLabelFilters,
  updateWorkspaceFilters,
  updateUserGroupFilters,
} from "~/actions/main-function/guider";
import { GuiderActiveFiltersType } from "~/reducers/main-function/guider";
import { loadStudents, loadStudent } from "~/actions/main-function/guider";
import GuiderBody from "../components/guider/body";
import ProfileBody from "../components/profile/body";
import HopsBody from "../components/hops/body";
import {
  loadProfilePropertiesSet,
  loadProfileUsername,
  loadProfileAddress,
  setProfileLocation,
  loadProfileWorklistTemplates,
  loadProfileWorklistSections,
  loadProfilePurchases,
  loadProfileAuthorizations,
} from "~/actions/main-function/profile";
import RecordsBody from "../components/records/body";
import GuardianBody from "../components/guardian/body";
import {
  updateTranscriptOfRecordsFiles,
  updateAllStudentUsersAndSetViewToRecords,
  setLocationToSummaryInTranscriptOfRecords,
  setLocationToStatisticsInTranscriptOfRecords,
  setLocationToInfoInTranscriptOfRecords,
  setLocationToPedagogyFormInTranscriptOfRecords,
} from "~/actions/main-function/records";
import { CKEDITOR_VERSION } from "~/lib/ckeditor";
import { updateStatistics } from "~/actions/main-function/records/statistics";
import { updateSummary } from "~/actions/main-function/records/summary";
import loadOrganizationSummary from "~/actions/organization/summary";
import EvaluationBody from "../components/evaluation/body";
import CeeposDone from "../components/ceepos/done";
import CeeposPay from "../components/ceepos/pay";
import {
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationGradingSystemFromServer,
  loadEvaluationSortFunctionFromServer,
  loadEvaluationWorkspacesFromServer,
  loadListOfImportantAssessmentIdsFromServer,
  loadListOfUnimportantAssessmentIdsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  loadCeeposPurchase,
  loadCeeposPurchaseAndPay,
} from "~/actions/main-function/ceepos";

import { loadDependants } from "~/actions/main-function/dependants";
import { registerLocale } from "react-datepicker";
import { enGB, fi } from "date-fns/locale";
import EasyToUseFunctions from "~/components/easy-to-use-reading-functions/easy-to-use-functions";
import { DiscussionStatePatch } from "~/reducers/discussion";
import { loadUserWorkspaceOrganizationFiltersFromServer } from "~/actions/workspaces/organization";
registerLocale("fi", fi);
registerLocale("enGB", enGB);
import { loadContactGroup } from "~/actions/base/contacts";
import "../locales/i18n";
import i18n from "../locales/i18n";
import { InfoPopperProvider } from "~/components/general/info-popover/context";
import { Announcement, UserWhoAmI } from "~/generated/client";
import Chat from "~/components/chat";
import { ChatWebsocketContextProvider } from "~/components/chat/context/chat-websocket-context";
import { WindowContextProvider } from "~/context/window-context";
import {
  initializeHops,
  loadMatriculationData,
  loadStudyPlanData,
} from "~/actions/main-function/hops/";
import GuardianHopsBody from "~/components/guardian_hops/body";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  MouseTransition,
  MultiBackendOptions,
  TouchTransition,
  DndProvider,
} from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import StudyProgressWebsocketWatcher from "~/components/general/study-progress-websocket-watcher";

const HTML5toTouch: MultiBackendOptions = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

/**
 * MainFunctionProps
 */
interface MainFunctionProps {
  store: Store<StateType>;
  websocket: Websocket;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).USES_HISTORY_API = true;

/**
 * MainFunction
 */
export default class MainFunction extends React.Component<
  MainFunctionProps,
  Record<string, unknown>
> {
  private prevPathName: string;
  private itsFirstTime: boolean;
  private loadedLibs: Array<string>;
  private subscribedChatSettings = false;
  private loadedChatSettings = false;

  rootElementRef = React.createRef<HTMLDivElement>();
  chatControllerRef = React.createRef<HTMLDivElement>();

  /**
   * constructor
   * @param props props
   */
  constructor(props: MainFunctionProps) {
    super(props);
    this.renderIndexBody = this.renderIndexBody.bind(this);
    this.renderCoursePickerBody = this.renderCoursePickerBody.bind(this);
    this.renderCommunicatorBody = this.renderCommunicatorBody.bind(this);
    this.renderOrganizationAdministrationBody =
      this.renderOrganizationAdministrationBody.bind(this);
    this.renderDiscussionBody = this.renderDiscussionBody.bind(this);
    this.renderAnnouncementsBody = this.renderAnnouncementsBody.bind(this);
    this.renderAnnouncerBody = this.renderAnnouncerBody.bind(this);
    this.renderGuiderBody = this.renderGuiderBody.bind(this);
    this.renderGuardianBody = this.renderGuardianBody.bind(this);
    this.renderGuardianHopsBody = this.renderGuardianHopsBody.bind(this);
    this.renderProfileBody = this.renderProfileBody.bind(this);
    this.renderHopsBody = this.renderHopsBody.bind(this);
    this.renderRecordsBody = this.renderRecordsBody.bind(this);
    this.renderEvaluationBody = this.renderEvaluationBody.bind(this);
    this.renderCeeposDoneBody = this.renderCeeposDoneBody.bind(this);
    this.renderCeeposPayBody = this.renderCeeposPayBody.bind(this);
    this.itsFirstTime = true;
    this.loadedLibs = [];

    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  /**
   * loadlib
   * @param url url
   * @param type type
   */
  loadlib(url: string, type?: string) {
    if (this.loadedLibs.indexOf(url) !== -1) {
      return;
    }
    this.loadedLibs.push(url);

    if (type && type === "styleSheet") {
      const styleSheet = document.createElement("link");
      styleSheet.href = url;
      styleSheet.rel = "styleSheet";
      document.head.appendChild(styleSheet);
    } else {
      const script = document.createElement("script");
      script.src = url;
      document.head.appendChild(script);
    }
  }

  /**
   * onHashChange
   */
  onHashChange() {
    if (window.location.pathname.includes("/coursepicker")) {
      this.loadCoursePickerData(
        queryString.parse(window.location.hash.split("?")[1] || "", {
          arrayFormat: "bracket",
        }),
        false,
        false
      );
    } else if (window.location.pathname.includes("/communicator")) {
      this.loadCommunicatorData(
        window.location.hash.replace("#", "").split("/")
      );
    } else if (window.location.pathname.includes("/discussion")) {
      this.loadDiscussionData(window.location.hash.replace("#", "").split("/"));
    } else if (window.location.pathname.includes("/announcements")) {
      this.loadAnnouncementsData(
        parseInt(window.location.hash.replace("#", ""))
      );
    } else if (window.location.pathname.includes("/announcer")) {
      this.loadAnnouncerData(window.location.hash.replace("#", "").split("/"));
    } else if (window.location.pathname.includes("/guider")) {
      this.loadGuiderData();
    } else if (window.location.pathname.includes("/records")) {
      this.loadRecordsData(window.location.hash.replace("#", ""));
    } else if (window.location.pathname.includes("/hops")) {
      this.loadHopsData(window.location.hash.replace("#", ""));
    } else if (window.location.pathname.includes("/guardian_hops")) {
      const hashArray = window.location.hash.replace("#", "").split("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [identifier, tab] = hashArray;

      this.loadHopsData(tab, identifier, true);
    } else if (window.location.pathname.includes("/guardian")) {
      const hashArray = window.location.hash.replace("#", "").split("/");
      const [identifier, tab] = hashArray;

      if (tab) {
        this.loadRecordsData(tab, identifier);
      } else {
        this.loadRecordsData("", identifier);
      }
    } else if (window.location.pathname.includes("/organization")) {
      this.loadCoursePickerData(
        queryString.parse(window.location.hash.split("?")[1] || "", {
          arrayFormat: "bracket",
        }),
        true,
        false
      );
    } else if (window.location.pathname.includes("/profile")) {
      this.loadProfileData(window.location.hash.replace("#", "").split("?")[0]);
    }
  }

  /**
   * updateFirstTime
   */
  updateFirstTime() {
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
  }

  /**
   * loadGuiderData
   */
  loadGuiderData() {
    //This code allows you to use the weird deprecated #userprofile/PYRAMUS-STUDENT-30055%22%3EJuhana type of links
    if (window.location.hash.replace("#", "").indexOf("userprofile") === 0) {
      this.props.store.dispatch(
        loadStudent(
          decodeURIComponent(window.location.hash.split("/")[1]).split('"')[0]
        ) as Action
      );

      // Initialize Hops
      this.props.store.dispatch(
        initializeHops({
          userIdentifier: decodeURIComponent(
            window.location.hash.split("/")[1]
          ).split('"')[0],
        }) as Action
      );
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalData: any = queryString.parse(
      window.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );

    const filters: GuiderActiveFiltersType = {
      workspaceFilters: (originalData.w || []).map((num: string) =>
        parseInt(num)
      ),
      labelFilters: (originalData.l || []).map((num: string) => parseInt(num)),
      userGroupFilters: (originalData.u || []).map((num: string) =>
        parseInt(num)
      ),
      query: originalData.q || "",
    };
    this.props.store.dispatch(loadStudents(filters) as Action);
    if (originalData.c) {
      this.props.store.dispatch(loadStudent(originalData.c) as Action);
      this.props.store.dispatch(
        initializeHops({
          userIdentifier: originalData.c,
        }) as Action
      );
    }
  }

  /**
   * loadRecordsData
   * @param tab records tab
   * @param userId userId
   */
  loadRecordsData(tab: string, userId?: string) {
    const givenLocation = tab;

    if (givenLocation === "summary" || !givenLocation) {
      this.props.store.dispatch(
        setLocationToSummaryInTranscriptOfRecords() as Action
      );
      // Summary needs counselors
      this.props.store.dispatch(
        loadContactGroup("counselors", userId) as Action
      );
      this.props.store.dispatch(updateSummary(userId) as Action);
    } else if (givenLocation === "records") {
      this.props.store.dispatch(
        updateAllStudentUsersAndSetViewToRecords(userId) as Action
      );
    } else if (givenLocation === "pedagogy-form") {
      this.props.store.dispatch(
        setLocationToPedagogyFormInTranscriptOfRecords() as Action
      );
    } else if (givenLocation === "statistics") {
      this.props.store.dispatch(
        setLocationToStatisticsInTranscriptOfRecords() as Action
      );
      this.props.store.dispatch(updateStatistics() as Action);
    } else if (givenLocation === "info") {
      this.props.store.dispatch(
        setLocationToInfoInTranscriptOfRecords() as Action
      );
      this.props.store.dispatch(updateSummary(userId) as Action);
    }
  }

  /**
   * loadHopsData
   * @param tab tab
   * @param userId userId
   * @param guardianHops guardianHops
   */
  loadHopsData(tab: string, userId?: string, guardianHops: boolean = false) {
    const givenLocation = tab;

    // Initializing HOPS
    this.props.store.dispatch(
      initializeHops({
        userIdentifier: userId,
        // Note: Route specific data loading is done after initializing has
        // returned info which type student is being loaded and if current
        // user is editing. If user would be editing all necessary data is already
        // loaded during initializing.
        // eslint-disable-next-line jsdoc/require-jsdoc
        onSuccess: (
          currentUserIsEditing: boolean,
          isUppersecondary: boolean
        ) => {
          if (!currentUserIsEditing) {
            if (
              isUppersecondary &&
              (givenLocation === "matriculation" ||
                (guardianHops && !givenLocation))
            ) {
              this.props.store.dispatch(
                loadMatriculationData({ userIdentifier: userId }) as Action
              );
            }
            if (
              givenLocation === "studyplan" ||
              (guardianHops && !givenLocation)
            ) {
              this.props.store.dispatch(
                loadStudyPlanData({ userIdentifier: userId }) as Action
              );
            }
          }
        },
      }) as Action
    );
  }

  /**
   * loadProfileData
   * @param location location
   */
  loadProfileData(location: string) {
    this.props.store.dispatch(setProfileLocation(location) as Action);
    this.props.store.dispatch(loadProfileAuthorizations() as Action);

    if (location === "work") {
      this.props.store.dispatch(loadProfileWorklistTemplates() as Action);
      this.props.store.dispatch(loadProfileWorklistSections() as Action);
    }

    if (location === "purchases") {
      this.props.store.dispatch(loadProfilePurchases() as Action);
    }
  }

  /**
   * loadAnnouncerData
   * @param location location
   */
  loadAnnouncerData(location: string[]) {
    const actualLocation = location.filter((l) => !!l);
    if (actualLocation.length === 1) {
      this.props.store.dispatch(loadAnnouncements(actualLocation[0]) as Action);
    } else {
      this.props.store.dispatch(
        loadAnnouncement(
          actualLocation[0],
          parseInt(actualLocation[1])
        ) as Action
      );
    }
  }

  /**
   * loadAnnouncementsData
   * @param announcementId announcementId
   */
  loadAnnouncementsData(announcementId: number) {
    this.props.store.dispatch(loadAnnouncement(null, announcementId) as Action);
  }

  /**
   * loadDiscussionData -
   * NOTE because loadDiscussionThreadsFromServer can only run after areas have been loaded, this needs to be so
   * @param location location
   */
  loadDiscussionData(location: string[]) {
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
            // page: parseInt(location[1]),
            threadId: parseInt(location[3]),
            threadPage: parseInt(location[4]) || 1,
          }) as Action
        );
      }
    }
  }

  /**
   * loadCoursePickerData
   * @param originalData originalData
   * @param isOrganization isOrganization
   * @param refresh refresh
   */
  loadCoursePickerData(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalData: any,
    isOrganization: boolean,
    refresh: boolean
  ) {
    const filters: WorkspacesActiveFiltersType = {
      educationFilters: originalData.e || [],
      curriculumFilters: originalData.c || [],
      organizationFilters: originalData.o || [],
      stateFilters: originalData.p || [],
      templates: originalData.t || undefined,
      query: originalData.q || null,
      baseFilter: originalData.b || "ALL_COURSES",
    };
    this.props.store.dispatch(
      loadWorkspacesFromServer(filters, isOrganization, refresh) as Action
    );
  }

  /**
   * loadCommunicatorData
   * @param location location
   */
  loadCommunicatorData(location: string[]) {
    if (location.length === 1) {
      this.props.store.dispatch(
        loadMessageThreads(location[0], null) as Action
      );
    } else {
      this.props.store.dispatch(
        loadMessageThread(location[0], parseInt(location[1])) as Action
      );
    }
  }

  /**
   * renderCoursePickerBody
   * @returns JSX.Element
   */
  renderCoursePickerBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();
      this.props.store.dispatch(
        loadUserWorkspaceCurriculumFiltersFromServer(false) as Action
      );
      this.props.store.dispatch(
        loadUserWorkspaceEducationFiltersFromServer(false) as Action
      );
      this.props.store.dispatch(
        loadUserWorkspaceOrganizationFiltersFromServer() as Action
      );

      const currentLocationData = queryString.parse(
        window.location.hash.split("?")[1] || "",
        { arrayFormat: "bracket" }
      );
      const currentLocationHasData =
        Object.keys(currentLocationData).length > 0 ? true : false;

      if (currentLocationHasData) {
        this.loadCoursePickerData(currentLocationData, false, false);
      }

      const state: StateType = this.props.store.getState();

      /**
       * loadCoursepickerDataByUser
       * @param whoAmI whoAmI
       */
      const loadCoursepickerDataByUser = (whoAmI: UserWhoAmI) => {
        if (!currentLocationHasData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const defaultSelections: any = {};
          if (whoAmI.curriculumIdentifier) {
            defaultSelections["c"] = [whoAmI.curriculumIdentifier];
          }
          if (whoAmI.organizationIdentifier) {
            defaultSelections["o"] = [whoAmI.organizationIdentifier];
          }

          if (defaultSelections.c || defaultSelections.o) {
            location.hash =
              "#?" +
              queryString.stringify(defaultSelections, {
                arrayFormat: "bracket",
              });
          } else {
            this.loadCoursePickerData(currentLocationData, false, false);
          }
        } else {
          this.loadCoursePickerData(currentLocationData, false, false);
        }
      };

      if (state.status.loggedIn) {
        if (Object.keys(state.userIndex.usersBySchoolData).length === 0) {
          this.props.store.dispatch(
            loadLoggedUser((whoAmICallbackValue) => {
              loadCoursepickerDataByUser(whoAmICallbackValue);
            }) as Action
          );
        } else {
          const whoAmI =
            state.userIndex.usersBySchoolData[
              state.status.userSchoolDataIdentifier
            ];
          loadCoursepickerDataByUser(whoAmI);
        }
      } else if (!currentLocationHasData) {
        this.loadCoursePickerData(currentLocationData, false, false);
      }
    }

    return <CousePickerBody />;
  }

  /**
   * renderIndexBody
   * @returns JSX.Element
   */
  renderIndexBody() {
    this.loadlib(
      `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
    );
    this.updateFirstTime();
    if (this.itsFirstTime) {
      const state: StateType = this.props.store.getState();
      this.props.websocket &&
        this.props.websocket
          .restoreEventListeners()
          .addEventListener(
            "Communicator:newmessagereceived",
            loadLastMessageThreadsFromServer.bind(null, 10)
          );
      if (state.status.roles.includes("STUDENT_PARENT")) {
        this.props.store.dispatch(loadDependants() as Action);
      }
      this.props.store.dispatch(
        loadAnnouncementsAsAClient({}, { loadUserGroups: false }) as Action
      );

      this.props.store.getState().status.loggedIn &&
        this.props.store.dispatch(loadLastWorkspacesFromServer() as Action);

      this.props.store.dispatch(loadUserWorkspacesFromServer() as Action);
      this.props.store.dispatch(loadLastMessageThreadsFromServer(10) as Action);
    }
    return <IndexBody />;
  }

  /**
   * renderOrganizationAdministrationBody
   * @returns JSX.Element
   */
  renderOrganizationAdministrationBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      const stateFilters = [
        {
          identifier: "UNPUBLISHED",
          name: i18n.t("labels.workspaces", {
            ns: "workspace",
            context: "unpublished",
          }),
        },
        {
          identifier: "PUBLISHED",
          name: i18n.t("labels.workspaces", {
            ns: "workspace",
            context: "published",
          }),
        },
      ];

      this.props.websocket && this.props.websocket.restoreEventListeners();
      this.props.store.dispatch(
        setWorkspaceStateFilters(true, stateFilters) as Action
      );
      this.props.store.dispatch(
        loadUserWorkspaceCurriculumFiltersFromServer(true) as Action
      );
      this.props.store.dispatch(
        loadUserWorkspaceEducationFiltersFromServer(true) as Action
      );
      this.props.store.dispatch(loadOrganizationSummary() as Action);
      const currentLocationData = queryString.parse(
        window.location.hash.split("?")[1] || "",
        { arrayFormat: "bracket" }
      );
      const currentLocationHasData =
        Object.keys(currentLocationData).length > 0 ? true : false;

      if (currentLocationHasData) {
        this.loadCoursePickerData(currentLocationData, true, false);
      }

      const state: StateType = this.props.store.getState();

      /**
       * loadWorkspacesByUser
       * @param whoAmI whoAmI
       */
      const loadWorkspacesByUser = (whoAmI: UserWhoAmI) => {
        if (!currentLocationHasData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const defaultSelections: any = {
            p: ["PUBLISHED"],
          };
          if (whoAmI.organizationIdentifier) {
            defaultSelections["o"] = [whoAmI.organizationIdentifier];
          }
          if (defaultSelections.c || defaultSelections.o) {
            location.hash =
              "#?" +
              queryString.stringify(defaultSelections, {
                arrayFormat: "bracket",
              });
          } else {
            this.loadCoursePickerData(currentLocationData, true, false);
          }
        } else {
          this.loadCoursePickerData(currentLocationData, true, false);
        }
      };

      if (state.status.loggedIn) {
        if (Object.keys(state.userIndex.usersBySchoolData).length === 0) {
          this.props.store.dispatch(
            loadLoggedUser((whoAmICallbackValue) => {
              loadWorkspacesByUser(whoAmICallbackValue);
            }) as Action
          );
        } else {
          const whoAmI =
            state.userIndex.usersBySchoolData[
              state.status.userSchoolDataIdentifier
            ];
          loadWorkspacesByUser(whoAmI);
        }
      } else if (!currentLocationHasData) {
        this.loadCoursePickerData(currentLocationData, true, false);
      }

      this.props.store.dispatch(
        loadUsers({
          payload: { q: "", firstResult: 0, maxResults: 10 },
        }) as Action
      );
      this.props.store.dispatch(
        loadUserGroups({
          payload: { q: "", firstResult: 0, maxResults: 25 },
        }) as Action
      );
      this.props.store.dispatch(loadStudyprogrammes() as Action);
    }
    return <OrganizationAdministrationBody />;
  }

  /**
   * renderCommunicatorBody
   */
  renderCommunicatorBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket &&
        this.props.websocket
          .restoreEventListeners()
          .addEventListener(
            "Communicator:newmessagereceived",
            loadNewlyReceivedMessage
          );

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.store.dispatch(loadSignature() as Action);

      const currentLocation = window.location.hash.replace("#", "").split("/");
      this.props.store.dispatch(
        loadMessagesNavigationLabels(() => {
          if (currentLocation[0].includes("label")) {
            this.loadCommunicatorData(currentLocation);
          }
        }) as Action
      );

      if (!window.location.hash) {
        window.location.hash = "#inbox";
      } else {
        if (!currentLocation[0].includes("label")) {
          this.loadCommunicatorData(currentLocation);
        }
      }
    }

    return <CommunicatorBody />;
  }

  /**
   * renderDiscussionBody
   * @returns JSX.Element
   */
  renderDiscussionBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.store.dispatch(setDiscussionWorkpaceId(null) as Action);

      this.props.store.dispatch(
        loadDiscussionAreasFromServer(() => {
          //here in the callback
          const currentLocation = window.location.hash
            .replace("#", "")
            .split("/");
          this.loadDiscussionData(currentLocation);
        }) as Action
      );
    }
    return <DiscussionBody />;
  }

  /**
   * renderAnnouncementsBody
   */
  renderAnnouncementsBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.props.store.dispatch(
        loadAnnouncementsAsAClient(
          { hideWorkspaceAnnouncements: false },
          (announcements: Announcement[]) => {
            announcements;
          }
        ) as Action
      );

      const hashId = parseInt(window.location.hash.replace("#", ""));

      if (hashId) {
        this.loadAnnouncementsData(
          parseInt(window.location.hash.replace("#", ""))
        );
      }
    }
    return <AnnouncementsBody />;
  }

  /**
   * renderAnnouncerBody
   * @returns JSX.Element
   */
  renderAnnouncerBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      if (!window.location.hash) {
        window.location.hash = "#active";
      } else {
        this.loadAnnouncerData(
          window.location.hash.replace("#", "").split("/")
        );
      }
    }

    return <AnnouncerBody />;
  }

  /**
   * renderGuiderBody
   */
  renderGuiderBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.props.store.dispatch(updateLabelFilters() as Action);
      this.props.store.dispatch(updateWorkspaceFilters() as Action);

      this.props.store.dispatch(updateUserGroupFilters() as Action);

      this.loadGuiderData();
    }
    return <GuiderBody />;
  }

  /**
   * renderProfileBody
   */
  renderProfileBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );
      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.props.store.dispatch(loadProfileUsername() as Action);

      if (!this.props.store.getState().status.isStudent) {
        this.props.store.dispatch(loadProfilePropertiesSet() as Action);
      } else {
        this.props.store.dispatch(loadProfileAddress() as Action);
      }

      if (!window.location.hash) {
        window.location.hash = "#general";
      } else {
        this.loadProfileData(
          window.location.hash.replace("#", "").split("?")[0]
        );
      }
    }

    return <ProfileBody />;
  }

  /**
   * renderHopsBody
   */
  renderHopsBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.loadHopsData(window.location.hash.replace("#", ""));
    }

    return <HopsBody />;
  }

  /**
   * renderRecordsBody
   */
  renderRecordsBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.props.store.dispatch(
        loadUserWorkspaceCurriculumFiltersFromServer(false) as Action
      );
      this.props.store.dispatch(updateTranscriptOfRecordsFiles() as Action);

      this.loadRecordsData(window.location.hash.replace("#", ""));
    }

    return <RecordsBody />;
  }

  /**
   * renderGuardianBody
   */
  renderGuardianBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      const hashArray = window.location.hash.replace("#", "").split("/");
      const [identifier, tab] = hashArray;
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      const state = this.props.store.getState();

      if (state.dependants.state === "WAIT") {
        this.props.store.dispatch(loadDependants() as Action);
      }

      this.props.websocket && this.props.websocket.restoreEventListeners();

      // If there's an identifier, we can load records data, otherwise it's done in the hash change
      if (identifier) {
        if (tab) {
          this.loadRecordsData(tab, identifier);
        } else {
          this.loadRecordsData("", identifier);
        }
      }
    }
    return <GuardianBody />;
  }

  /**
   * renderGuardianBody
   */
  renderGuardianHopsBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      const hashArray = window.location.hash.replace("#", "").split("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [identifier, tab] = hashArray;
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      const state = this.props.store.getState();

      if (state.dependants.state === "WAIT") {
        this.props.store.dispatch(loadDependants() as Action);
      }

      this.props.websocket && this.props.websocket.restoreEventListeners();

      // If there's an identifier, we can load hops data, otherwise it's done in the hash change
      this.loadHopsData(tab, identifier, true);
    }
    return <GuardianHopsBody />;
  }

  /**
   * renderEvaluationBody
   */
  renderEvaluationBody() {
    this.updateFirstTime();
    if (this.itsFirstTime) {
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );

      this.props.websocket && this.props.websocket.restoreEventListeners();

      this.props.store.dispatch(
        loadEvaluationAssessmentRequestsFromServer() as Action
      );
      this.props.store.dispatch(loadEvaluationWorkspacesFromServer() as Action);
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
    }

    return <EvaluationBody />;
  }

  /**
   * renderCeeposDoneBody
   * @returns JSX.Element
   */
  renderCeeposDoneBody() {
    this.updateFirstTime();

    const locationData = queryString.parse(
      document.location.search.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    if (this.itsFirstTime) {
      this.loadlib(
        "//fonts.googleapis.com/css?family=Exo+2:200,300,400,600,900",
        "styleSheet"
      );
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );
      const id = parseInt(locationData.Id);
      if (id) {
        this.props.store.dispatch(loadCeeposPurchase(id) as Action);
      }
    }

    return <CeeposDone status={parseInt(locationData.Status)} />;
  }

  /**
   * renderCeeposPayBody
   * @returns JSX.Element
   */
  renderCeeposPayBody() {
    this.updateFirstTime();

    if (this.itsFirstTime) {
      this.loadlib(
        "//fonts.googleapis.com/css?family=Exo+2:200,300,400,600,900",
        "styleSheet"
      );
      this.loadlib(
        `//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`
      );
      const locationData = queryString.parse(
        document.location.search.split("?")[1] || "",
        { arrayFormat: "bracket" }
      );
      if (locationData.order) {
        this.props.store.dispatch(
          loadCeeposPurchaseAndPay(parseInt(locationData.order)) as Action
        );
      }
    }

    return <CeeposPay />;
  }

  /**
   * Component render method
   */
  render() {
    return (
      <DndProvider options={HTML5toTouch}>
        <StudyProgressWebsocketWatcher>
          <div id="root">
            <WindowContextProvider>
              <ChatWebsocketContextProvider websocket={this.props.websocket}>
                <Chat />
              </ChatWebsocketContextProvider>
              <InfoPopperProvider>
                <Notifications></Notifications>
                <DisconnectedWarningDialog />
                <EasyToUseFunctions />
                <BrowserRouter>
                  <Route exact path="/" render={this.renderIndexBody} />
                  <Route
                    path="/organization"
                    render={this.renderOrganizationAdministrationBody}
                  />
                  <Route
                    path="/coursepicker"
                    render={this.renderCoursePickerBody}
                  />
                  <Route
                    path="/communicator"
                    render={this.renderCommunicatorBody}
                  />
                  <Route
                    path="/discussion"
                    render={this.renderDiscussionBody}
                  />
                  <Route
                    path="/announcements"
                    render={this.renderAnnouncementsBody}
                  />
                  <Route path="/announcer" render={this.renderAnnouncerBody} />
                  <Route path="/guider" render={this.renderGuiderBody} />
                  <Route path="/guardian" render={this.renderGuardianBody} />
                  <Route
                    path="/guardian_hops"
                    render={this.renderGuardianHopsBody}
                  />
                  <Route path="/profile" render={this.renderProfileBody} />
                  <Route path="/records" render={this.renderRecordsBody} />
                  <Route path="/hops" render={this.renderHopsBody} />
                  <Route
                    path="/evaluation"
                    render={this.renderEvaluationBody}
                  />
                  <Route path="/ceepos/pay" render={this.renderCeeposPayBody} />
                  <Route
                    path="/ceepos/done"
                    render={this.renderCeeposDoneBody}
                  />
                </BrowserRouter>
              </InfoPopperProvider>
            </WindowContextProvider>
          </div>
        </StudyProgressWebsocketWatcher>
      </DndProvider>
    );
  }
}
