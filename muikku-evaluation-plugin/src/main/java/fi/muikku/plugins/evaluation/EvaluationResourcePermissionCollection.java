package fi.muikku.plugins.evaluation;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultWorkspacePermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class EvaluationResourcePermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  public static final String PERMISSIONSCOPE_WORKSPACE = "WORKSPACE";
  
  /**
   * Evaluation view
   */

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_VIEW_INDEX = "EVALUATION_VIEW_INDEX";
  
  /**
   * Evaluations
   */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_CREATEWORKSPACEMATERIALEVALUATION = "EVALUATION_CREATEWORKSPACEMATERIALEVALUATION";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_FINDWORKSPACEMATERIALEVALUATION = "EVALUATION_FINDWORKSPACEMATERIALEVALUATION";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_LISTWORKSPACEMATERIALEVALUATIONS = "EVALUATION_LISTWORKSPACEMATERIALEVALUATIONS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_UPDATEWORKSPACEMATERIALEVALUATION = "EVALUATION_UPDATEWORKSPACEMATERIALEVALUATION";

  /**
   * Assessors and grading scales
   */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({WorkspaceRoleArchetype.TEACHER})
  public static final String EVALUATION_LISTASSESSORS = "EVALUATION_LISTASSESSORS";

  @Scope (PermissionScope.WORKSPACE)
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