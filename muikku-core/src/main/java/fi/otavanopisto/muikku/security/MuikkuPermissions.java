package fi.otavanopisto.muikku.security;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.security.Scope;


@ApplicationScoped
public class MuikkuPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String ADMIN = "ADMIN";
  
  @Scope (PermissionScope.PERSONAL)
  public static final String OWNER = "OWNER";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.STUDENT_PARENT })
  public static final String STUDENT_PARENT = "STUDENT_PARENT";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String ACCESS_ALL_ORGANIZATIONS = "ACCESS_ALL_ORGANIZATIONS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String REPRESENT_USER = "REPRESENT_USER";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String CREATE_WORKSPACE = "CREATE_WORKSPACE";
  
  // TODO Not used anywhere :|
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACES = "LIST_WORKSPACES";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.MANAGER })
  public static final String LIST_ALL_UNPUBLISHED_WORKSPACES = "LIST_ALL_UNPUBLISHED_WORKSPACES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER  })
  public static final String LIST_OWN_UNPUBLISHED_WORKSPACES = "LIST_OWN_UNPUBLISHED_WORKSPACES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.MANAGER })
  public static final String LIST_WORKSPACE_TEMPLATES = "LIST_WORKSPACE_TEMPLATES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.TEACHER })
  public static final String LIST_OWN_STUDENT_WORKSPACES = "LIST_OWN_STUDENT_WORKSPACES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String TEACH_WORKSPACE = "TEACH_WORKSPACE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String MANAGE_SETTINGS = "MANAGE_SETTINGS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String MANAGE_PERMISSIONS = "MANAGE_PERMISSIONS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String MANAGE_USERS = "MANAGE_USERS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String MANAGE_MATERIALS = "MANAGE_MATERIALS"; // Edit material content in content editor, including publishing or reverting revisions

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String MANAGE_MATERIAL_PRODUCERS = "MANAGE_MATERIAL_PRODUCERS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String MANAGE_MATERIAL_META = "MANAGE_MATERIAL_META";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String COPY_WORKSPACE = "COPY_WORKSPACE";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String LIST_INACTIVE_STUDENTS = "LIST_INACTIVE_STUDENTS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String ACCESS_MEMBERS_ONLY_WORKSPACE = "ACCESS_MEMBERS_ONLY_WORKSPACE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String ACCESS_EVALUATION = "ACCESS_EVALUATION";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String ACCESS_USER_STATISTICS = "ACCESS_USER_STATISTICS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String GET_WORKSPACE_ACTIVITY = "GET_WORKSPACE_ACTIVITY";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String ACCESS_INTERIM_EVALUATION_REQUESTS = "ACCESS_INTERIM_EVALUATION_REQUESTS";
  
  // User management
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER })
  public static final String CREATE_STAFF_MEMBER = "CREATE_STAFF_MEMBER";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER })
  public static final String UPDATE_STAFF_MEMBER = "UPDATE_STAFF_MEMBER";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER })
  public static final String CREATE_STUDENT = "CREATE_STUDENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER })
  public static final String UPDATE_STUDENT = "UPDATE_STUDENT";
  
  // Worklist
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String CREATE_WORKLISTITEM = "CREATE_WORKLISTITEM";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String UPDATE_WORKLISTITEM = "UPDATE_WORKLISTITEM";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String DELETE_WORKLISTITEM = "DELETE_WORKLISTITEM";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String LIST_WORKLISTITEMS = "LIST_WORKLISTITEMS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String LIST_WORKLISTITEMTEMPLATES = "LIST_WORKLISTITEMTEMPLATES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String ACCESS_WORKLIST_BILLING = "ACCESS_WORKLIST_BILLING";

  /* HOPS */

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String HOPS_GET_STUDENT_STUDY_ACTIVITY = "HOPS_GET_STUDENT_STUDY_ACTIVITY";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String HOPS_GET_STUDENT_COURSE_MATRIX = "HOPS_GET_STUDENT_COURSE_MATRIX";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String HOPS_SUGGEST_WORKSPACES = "HOPS_SUGGEST_WORKSPACES";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String HOPS_VIEW = "HOPS_VIEW";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String HOPS_EDIT = "HOPS_EDIT";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT })
  public static final String HOPS_STUDENT_INFO = "HOPS_STUDENT_INFO";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT })
  public static final String HOPS_CREATE_STUDENT_CHOICES = "HOPS_CREATE_STUDENT_CHOICES";

  /* WORKSPACE */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String WORKSPACE_MANAGEWORKSPACESETTINGS = "WORKSPACE_MANAGEWORKSPACESETTINGS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String REPRESENT_WORKSPACEUSER = "REPRESENT_WORKSPACEUSER";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String EVALUATE_USER = "EVALUATE_USER";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String VIEW_USER_EVALUATION = "VIEW_USER_EVALUATION";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String VIEW_MATERIAL_EVALUATION = "VIEW_MATERIAL_EVALUATION";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String EVALUATE_MATERIAL = "EVALUATE_MATERIAL";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String FIND_STUDENT = "FIND_STUDENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  public static final String LIST_STUDENT_TRANSFER_CREDITS = "LIST_STUDENT_TRANSFER_CREDITS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String LIST_STUDENT_PHONE_NUMBERS = "LIST_STUDENT_PHONE_NUMBERS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String LIST_STUDENT_EMAILS = "LIST_STUDENT_EMAILS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String LIST_STUDENT_ADDRESSES = "LIST_STUDENT_ADDRESSES";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  public static final String UPDATE_STUDENT_ADDRESS = "UPDATE_STUDENT_ADDRESS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_WORKSPACE_MATERIALS = "ACCESS_WORKSPACE_MATERIALS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_WORKSPACE_EVALUATION = "ACCESS_WORKSPACE_EVALUATION";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE = "MANAGE_WORKSPACE";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_UNPUBLISHED_WORKSPACE = "ACCESS_UNPUBLISHED_WORKSPACE";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String PUBLISH_WORKSPACE = "PUBLISH_WORKSPACE";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_MATERIALS = "MANAGE_WORKSPACE_MATERIALS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String REMOVE_ANSWERS = "REMOVE_ANSWERS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_FRONTPAGE = "MANAGE_WORKSPACE_FRONTPAGE";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_HELP = "MANAGE_WORKSPACE_HELP";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String WORKSPACE_MANAGE_PERMISSIONS = "WORKSPACE_MANAGE_PERMISSIONS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_STUDENTS = "LIST_WORKSPACE_STUDENTS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_MEMBERS = "LIST_WORKSPACE_MEMBERS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_MEMBERS = "MANAGE_WORKSPACE_MEMBERS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.STUDENT })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_STAFFMEMBERS = "LIST_WORKSPACE_STAFFMEMBERS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String ARCHIVE_ALL_WORKSPACE_STUDENTS = "ARCHIVE_ALL_WORKSPACE_STUDENTS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT })
  public static final String IS_WORKSPACE_STUDENT = "IS_WORKSPACE_STUDENT";

  @Scope (PermissionScope.WORKSPACE)
  public static final String SHOW_EXAMS = "SHOW_EXAMS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_WORKSPACE_JOURNAL = "ACCESS_WORKSPACE_JOURNAL";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_JOURNAL_COMMENTS = "LIST_WORKSPACE_JOURNAL_COMMENTS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String CREATE_WORKSPACE_JOURNAL_COMMENT = "CREATE_WORKSPACE_JOURNAL_COMMENT";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String EDIT_WORKSPACE_JOURNAL_COMMENT = "EDIT_WORKSPACE_JOURNAL_COMMENT";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String REMOVE_WORKSPACE_JOURNAL_COMMENT = "REMOVE_WORKSPACE_JOURNAL_COMMENT";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_ALL_JOURNAL_ENTRIES = "LIST_ALL_JOURNAL_ENTRIES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String VIEW_WORKSPACE_DETAILS = "VIEW_WORKSPACE_DETAILS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER }) 
  public static final String VIEW_WORKSPACE_FEE = "VIEW_WORKSPACE_FEE";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_DETAILS = "MANAGE_WORKSPACE_DETAILS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_MATERIAL_PRODUCERS = "MANAGE_WORKSPACE_MATERIAL_PRODUCERS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER }) 
  public static final String LIST_MATERIAL_WORKSPACE_MATERIALS = "LIST_MATERIAL_WORKSPACE_MATERIALS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_STUDENT_ANSWERS = "ACCESS_STUDENT_ANSWERS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_USER_WORKSPACE_ACTIVITY = "LIST_USER_WORKSPACE_ACTIVITY";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String ACCESS_STUDENT_FILES = "ACCESS_STUDENT_FILES";
  
  /* USERGROUPS */

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER})
  public static final String CREATE_STUDENT_GROUP = "CREATE_STUDENT_GROUP";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER})
  public static final String UPDATE_STUDENT_GROUP = "UPDATE_STUDENT_GROUP";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER})
  public static final String ARCHIVE_STUDENT_GROUP = "ARCHIVE_STUDENT_GROUP";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String LIST_USER_USERGROUPS = "LIST_USER_USERGROUPS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String LIST_USERGROUP_STAFFMEMBERS = "LIST_USERGROUP_STAFFMEMBERS";
  
  // Assessment requests
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT })
  public static final String REQUEST_WORKSPACE_ASSESSMENT = "REQUEST_WORKSPACE_ASSESSMENT";

  @Override
  public List<String> listPermissions() {
    return listPermissions(MuikkuPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(MuikkuPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(MuikkuPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(MuikkuPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(MuikkuPermissions.class, permission);
  }
  
}
