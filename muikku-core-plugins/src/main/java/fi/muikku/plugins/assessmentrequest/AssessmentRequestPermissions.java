package fi.muikku.plugins.assessmentrequest;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.muikku.security.DefaultWorkspacePermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class AssessmentRequestPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.STUDENT })
  public static final String CREATE_WORKSPACE_ASSESSMENTREQUEST = "CREATE_WORKSPACE_ASSESSMENTREQUEST";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER } )
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_ASSESSMENTREQUESTS = "LIST_WORKSPACE_ASSESSMENTREQUESTS";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(AssessmentRequestPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(AssessmentRequestPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(AssessmentRequestPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(AssessmentRequestPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(AssessmentRequestPermissions.class, permission);
  }

}
