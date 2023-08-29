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
} from "../generated/client";

const configuration = new Configuration({
  basePath: window.location.origin,
});

/**
 * Utility class for loading api with predefined configuration
 */
export default class MApi {
  /**
   * Get initialized AnnouncerApi API
   *
   * @returns initialized ForumApi API
   */
  public static getAnnouncerApi() {
    return new AnnouncerApi(configuration);
  }

  /**
   * Gets initialized Ceepos API
   *
   * @returns initialized workspaces API
   */
  public static getCeeposApi() {
    return new CeeposApi(configuration);
  }

  /**
   * Get initialized CommunicatorApi API
   *
   * @returns initialized ForumApi API
   */
  public static getCommunicatorApi() {
    return new CommunicatorApi(configuration);
  }

  /**
   * Get initialized Coursepicker API
   *
   * @returns initialized ForumApi API
   */
  public static getCoursepickerApi() {
    return new CoursepickerApi(configuration);
  }

  /**
   * Get initialized CredentialsApi API
   *
   * @returns initialized CredentialsApi API
   */
  public static getCredentialsApi() {
    return new CredentialsApi(configuration);
  }

  /**
   * Get initialized Discussion API
   *
   * @returns initialized ForumApi API
   */
  public static getDiscussionApi() {
    return new DiscussionApi(configuration);
  }

  /**
   * Get initialized EvaluationApi API
   *
   * @returns initialized EvaluationApi API
   */
  public static getEvaluationApi() {
    return new EvaluationApi(configuration);
  }

  /**
   * Gets initialized Feeds API
   *
   * @returns initialized whoAmI API
   */
  public static getFeedsApi() {
    return new FeedsApi(configuration);
  }

  /**
   * Get initialized GuiderApi API
   *
   * @returns initialized GuiderApi API
   */
  public static getGuiderApi() {
    return new GuiderApi(configuration);
  }

  /**
   * Gets initialized HopsApi API
   *
   * @returns initialized HopsApi API
   */
  public static getHopsApi() {
    return new HopsApi(configuration);
  }

  /**
   * Gets initialized HopsUpperSecondaryApi API
   *
   * @returns initialized HopsUpperSecondaryApi API
   */
  public static getHopsUpperSecondaryApi() {
    return new HopsUpperSecondaryApi(configuration);
  }

  /**
   * Get initialized MaterialsApi API
   *
   * @returns initialized MaterialsApi API
   */
  public static getMaterialsApi() {
    return new MaterialsApi(configuration);
  }

  /**
   * Get initialized MatriculationApi API
   *
   * @returns initialized MatriculationApi API
   */
  public static getMatriculationApi() {
    return new MatriculationApi(configuration);
  }

  /**
   * Gets initialized MeApi API
   *
   * @returns initialized MeApi API
   */
  public static getMeApi() {
    return new MeApi(configuration);
  }

  /**
   * Get initialized NotesApi API
   *
   * @returns initialized NotesApi API
   */
  public static getNotesApi() {
    return new NotesApi(configuration);
  }

  /**
   * Get initialized OrganizationApi API
   *
   * @returns initialized OrganizationApi API
   */
  public static getOrganizationApi() {
    return new OrganizationApi(configuration);
  }

  /**
   * Get initialized PedagogyApi API
   *
   * @returns initialized PedagogyApi API
   */
  public static getPedagogyApi() {
    return new PedagogyApi(configuration);
  }

  /**
   * Gets initialized RecordsApi API
   *
   * @returns initialized RecordsApi API
   */
  public static getRecordsApi() {
    return new RecordsApi(configuration);
  }

  /**
   * Get initialized UserApi API
   *
   * @returns initialized UserApi API
   */
  public static getUserApi() {
    return new UserApi(configuration);
  }

  /**
   * Get initialized UsergroupApi API
   *
   * @returns initialized UsergroupApi API
   */
  public static getUsergroupApi() {
    return new UsergroupApi(configuration);
  }

  /**
   * Get initialized UserpluginApi API
   *
   * @returns initialized UserpluginApi API
   */
  public static getUserpluginApi() {
    return new UserpluginApi(configuration);
  }

  /**
   * Get initialized Worklist API
   *
   * @returns initialized Worklist API
   */
  public static getWorklistApi() {
    return new WorklistApi(configuration);
  }

  /**
   * Gets initialized workspaces API
   *
   * @returns initialized workspaces API
   */
  public static getWorkspacesApi() {
    return new WorkspaceApi(configuration);
  }

  /**
   * Get initialized WorkspaceDiscussionApi API
   *
   * @returns initialized WorkspaceDiscussionApi API
   */
  public static getWorkspaceDiscussionApi() {
    return new WorkspaceDiscussionApi(configuration);
  }

  /**
   * Gets initialized workspace notes API
   *
   * @returns initialized workspace notes API
   */
  public static getWorkspaceNotesApi() {
    return new WorkspaceNotesApi(configuration);
  }

  /**
   * Gets initialized discussions API
   *
   * @returns initialized workspaces API
   */
  /* public static getDiscussionApi() {
    return new DiscussionApi();
  } */
}
