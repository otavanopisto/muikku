package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.security.AbstractMuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.otavanopisto.muikku.security.DefaultWorkspacePermissionRoles;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class EvaluationResourcePermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  /**
   * Evaluation view
   */

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_VIEW_INDEX = "EVALUATION_VIEW_INDEX";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String EVALUATION_LIST_ALL_WORKSPACES = "EVALUATION_LIST_ALL_WORKSPACES";

  /**
   * Evaluations
   */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER})
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_CREATEWORKSPACEMATERIALEVALUATION = "EVALUATION_CREATEWORKSPACEMATERIALEVALUATION";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER})
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_FINDWORKSPACEMATERIALEVALUATION = "EVALUATION_FINDWORKSPACEMATERIALEVALUATION";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER})
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_LISTWORKSPACEMATERIALEVALUATIONS = "EVALUATION_LISTWORKSPACEMATERIALEVALUATIONS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER})
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_UPDATEWORKSPACEMATERIALEVALUATION = "EVALUATION_UPDATEWORKSPACEMATERIALEVALUATION";

  /**
   * Grading scales
   */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles({EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_LISTGRADINGSCALES = "EVALUATION_LISTGRADINGSCALES";

  @Override
  public List<String> listPermissions() {
    return listPermissions(EvaluationResourcePermissionCollection.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(EvaluationResourcePermissionCollection.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(EvaluationResourcePermissionCollection.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(EvaluationResourcePermissionCollection.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(EvaluationResourcePermissionCollection.class, permission);
  }
  
}