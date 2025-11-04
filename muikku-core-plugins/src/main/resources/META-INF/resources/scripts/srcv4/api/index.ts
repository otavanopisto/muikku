import {
  AnnouncerApi,
  CeeposApi,
  CommunicatorApi,
  Configuration,
  CoursepickerApi,
  CredentialsApi,
  DiscussionApi,
  EvaluationApi,
  FeedsApi,
  GuiderApi,
  HopsApi,
  HopsUpperSecondaryApi,
  MaterialsApi,
  MatriculationApi,
  MeApi,
  NotesApi,
  OrganizationApi,
  PedagogyApi,
  RecordsApi,
  UserApi,
  UsergroupApi,
  UserpluginApi,
  WorklistApi,
  WorkspaceApi,
  WorkspaceDiscussionApi,
  WorkspaceNotesApi,
  ResponseError,
  FetchError,
  RequiredError,
  AssessmentRequestApi,
  ChatApi,
  type Middleware,
  type ResponseContext,
  ActivitylogsApi,
  StudentCardsApi,
} from "~/generated/client";

/**
 * Handles 204 No Content responses
 * This is needed because the generated code will try to parse value even it doesn't exist.
 * This happens specifically when endpoint returns 200 with possibility of 204 No Content too.
 * Setting value to null or undefined values will skip this parsing and so SyntaxError won't be thrown
 * This is openapi-generator issue and hopefully will be fixed in the future
 */
class NoContentMiddleware implements Middleware {
  /**
   * Handles 204 No Content responses
   * @param context - Response context
   * @returns Response or void
   */
  public post?(context: ResponseContext): Promise<Response | void> {
    if (context.response.status === 204) {
      // change response json to null.
      context.response.json = () => Promise.resolve(null);

      return Promise.resolve(context.response);
    }

    return Promise.resolve(context.response);
  }
}

/**
 * Checks if the given error is a ResponseError
 * @param error error
 * @returns error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResponseError(error: any): error is ResponseError {
  return (error as ResponseError).name === "ResponseError";
}

/**
 * Checks if the given error is a FetchError
 * @param error error
 * @returns error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFetchError(error: any): error is FetchError {
  return (error as FetchError).name === "FetchError";
}

/**
 * Checks if the given error is a RequiredError
 * @param error error
 * @returns error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRequiredError(error: any): error is RequiredError {
  return (error as RequiredError).name === "RequiredError";
}

/**
 * Checks and returns whether error is Api related
 * @param error error
 * @returns error
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMApiError(error: any): error is ResponseError | FetchError {
  return isFetchError(error) || isResponseError(error);
}

const configuration = new Configuration({
  basePath: window.location.origin,
  middleware: [new NoContentMiddleware()],
});

let activitylogsApi: ActivitylogsApi;
let announcerApi: AnnouncerApi;
let chatApi: ChatApi;
let assessmentApi: AssessmentRequestApi;
let ceeposApi: CeeposApi;
let communicatorApi: CommunicatorApi;
let coursepickerApi: CoursepickerApi;
let credentialsApi: CredentialsApi;
let discussionApi: DiscussionApi;
let evaluationApi: EvaluationApi;
let feedsApi: FeedsApi;
let guiderApi: GuiderApi;
let hopsApi: HopsApi;
let hopsUpperSecondaryApi: HopsUpperSecondaryApi;
let materialsApi: MaterialsApi;
let matriculationApi: MatriculationApi;
let meApi: MeApi;
let notesApi: NotesApi;
let organizationApi: OrganizationApi;
let pedagogyApi: PedagogyApi;
let recordsApi: RecordsApi;
let userApi: UserApi;
let usergroupApi: UsergroupApi;
let userpluginApi: UserpluginApi;
let worklistApi: WorklistApi;
let workspaceApi: WorkspaceApi;
let workspaceDiscussionApi: WorkspaceDiscussionApi;
let workspaceNotesApi: WorkspaceNotesApi;
let studentCardApi: StudentCardsApi;

/**
 * Gets initialized WorkspaceApi
 * @returns WorkspaceApi
 */
export function getWorkspaceApi() {
  if (!workspaceApi) {
    workspaceApi = new WorkspaceApi(configuration);
  }
  return workspaceApi;
}

/**
 * Gets initialized ActivitylogsApi
 * @returns ActivitylogsApi
 */
export function getActivitylogsApi() {
  if (!activitylogsApi) {
    activitylogsApi = new ActivitylogsApi(configuration);
  }
  return activitylogsApi;
}

/**
 * Gets initialized AnnouncerApi
 * @returns AnnouncerApi
 */
export function getAnnouncerApi() {
  if (!announcerApi) {
    announcerApi = new AnnouncerApi(configuration);
  }
  return announcerApi;
}

/**
 * Gets initialized ChatApi
 * @returns ChatApi
 */
export function getChatApi() {
  if (!chatApi) {
    chatApi = new ChatApi(configuration);
  }
  return chatApi;
}

/**
 * Gets initialized AssessmentApi
 * @returns AssessmentApi
 */
export function getAssessmentApi() {
  if (!assessmentApi) {
    assessmentApi = new AssessmentRequestApi(configuration);
  }
  return assessmentApi;
}

/**
 * Gets initialized CeeposApi
 * @returns CeeposApi
 */
export function getCeeposApi() {
  if (!ceeposApi) {
    ceeposApi = new CeeposApi(configuration);
  }
  return ceeposApi;
}

/**
 * Gets initialized CommunicatorApi
 * @returns CommunicatorApi
 */
export function getCommunicatorApi() {
  if (!communicatorApi) {
    communicatorApi = new CommunicatorApi(configuration);
  }
  return communicatorApi;
}

/**
 * Gets initialized CoursepickerApi
 * @returns CoursepickerApi
 */
export function getCoursepickerApi() {
  if (!coursepickerApi) {
    coursepickerApi = new CoursepickerApi(configuration);
  }
  return coursepickerApi;
}

/**
 * Gets initialized CredentialsApi
 * @returns CredentialsApi
 */
export function getCredentialsApi() {
  if (!credentialsApi) {
    credentialsApi = new CredentialsApi(configuration);
  }
  return credentialsApi;
}

/**
 * Gets initialized DiscussionApi
 * @returns DiscussionApi
 */
export function getDiscussionApi() {
  if (!discussionApi) {
    discussionApi = new DiscussionApi(configuration);
  }
  return discussionApi;
}

/**
 * Gets initialized EvaluationApi
 * @returns EvaluationApi
 */
export function getEvaluationApi() {
  if (!evaluationApi) {
    evaluationApi = new EvaluationApi(configuration);
  }
  return evaluationApi;
}

/**
 * Gets initialized FeedsApi
 * @returns FeedsApi
 */
export function getFeedsApi() {
  if (!feedsApi) {
    feedsApi = new FeedsApi(configuration);
  }
  return feedsApi;
}

/**
 * Gets initialized GuiderApi
 * @returns GuiderApi
 */
export function getGuiderApi() {
  if (!guiderApi) {
    guiderApi = new GuiderApi(configuration);
  }
  return guiderApi;
}

/**
 * Gets initialized HopsApi
 * @returns HopsApi
 */
export function getHopsApi() {
  if (!hopsApi) {
    hopsApi = new HopsApi(configuration);
  }
  return hopsApi;
}

/**
 * Gets initialized HopsUpperSecondaryApi
 * @returns HopsUpperSecondaryApi
 */
export function getHopsUpperSecondaryApi() {
  if (!hopsUpperSecondaryApi) {
    hopsUpperSecondaryApi = new HopsUpperSecondaryApi(configuration);
  }
  return hopsUpperSecondaryApi;
}

/**
 * Gets initialized MaterialsApi
 * @returns MaterialsApi
 */
export function getMaterialsApi() {
  if (!materialsApi) {
    materialsApi = new MaterialsApi(configuration);
  }
  return materialsApi;
}

/**
 * Gets initialized MatriculationApi
 * @returns MatriculationApi
 */
export function getMatriculationApi() {
  if (!matriculationApi) {
    matriculationApi = new MatriculationApi(configuration);
  }
  return matriculationApi;
}

/**
 * Gets initialized MeApi
 * @returns MeApi
 */
export function getMeApi() {
  if (!meApi) {
    meApi = new MeApi(configuration);
  }
  return meApi;
}

/**
 * Gets initialized NotesApi
 * @returns NotesApi
 */
export function getNotesApi() {
  if (!notesApi) {
    notesApi = new NotesApi(configuration);
  }
  return notesApi;
}

/**
 * Gets initialized OrganizationApi
 * @returns OrganizationApi
 */
export function getOrganizationApi() {
  if (!organizationApi) {
    organizationApi = new OrganizationApi(configuration);
  }
  return organizationApi;
}

/**
 * Gets initialized PedagogyApi
 * @returns PedagogyApi
 */
export function getPedagogyApi() {
  if (!pedagogyApi) {
    pedagogyApi = new PedagogyApi(configuration);
  }
  return pedagogyApi;
}

/**
 * Gets initialized RecordsApi
 * @returns RecordsApi
 */
export function getRecordsApi() {
  if (!recordsApi) {
    recordsApi = new RecordsApi(configuration);
  }
  return recordsApi;
}

/**
 * Gets initialized UserApi
 * @returns UserApi
 */
export function getUserApi() {
  if (!userApi) {
    userApi = new UserApi(configuration);
  }
  return userApi;
}

/**
 * Gets initialized UsergroupApi
 * @returns UsergroupApi
 */
export function getUsergroupApi() {
  if (!usergroupApi) {
    usergroupApi = new UsergroupApi(configuration);
  }
  return usergroupApi;
}

/**
 * Gets initialized UserpluginApi
 * @returns UserpluginApi
 */
export function getUserpluginApi() {
  if (!userpluginApi) {
    userpluginApi = new UserpluginApi(configuration);
  }
  return userpluginApi;
}

/**
 * Gets initialized WorklistApi
 * @returns WorklistApi
 */
export function getWorklistApi() {
  if (!worklistApi) {
    worklistApi = new WorklistApi(configuration);
  }
  return worklistApi;
}

/**
 * Gets initialized WorkspaceDiscussionApi
 * @returns WorkspaceDiscussionApi
 */
export function getWorkspaceDiscussionApi() {
  if (!workspaceDiscussionApi) {
    workspaceDiscussionApi = new WorkspaceDiscussionApi(configuration);
  }
  return workspaceDiscussionApi;
}

/**
 * Gets initialized WorkspaceNotesApi
 * @returns WorkspaceNotesApi
 */
export function getWorkspaceNotesApi() {
  if (!workspaceNotesApi) {
    workspaceNotesApi = new WorkspaceNotesApi(configuration);
  }
  return workspaceNotesApi;
}

/**
 * Gets initialized StudentCardApi
 * @returns StudentCardApi
 */
export function getStudentCardApi() {
  if (!studentCardApi) {
    studentCardApi = new StudentCardsApi(configuration);
  }
  return studentCardApi;
}
