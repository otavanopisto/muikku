package fi.otavanopisto.muikku.plugins.matriculation;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.security.AbstractMuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class MatriculationPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.STUDENT_PARENT } )
  public static final String MATRICULATION_LIST_EXAMS = "MATRICULATION_LIST_EXAMS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.STUDENT_PARENT } )
  public static final String MATRICULATION_GET_INITIALDATA = "MATRICULATION_GET_INITIALDATA";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.STUDENT } )
  public static final String MATRICULATION_LOAD_DRAFT = "MATRICULATION_LOAD_DRAFT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.STUDENT } )
  public static final String MATRICULATION_SAVE_DRAFT = "MATRICULATION_SAVE_DRAFT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.STUDENT_PARENT } )
  public static final String MATRICULATION_FIND_ENROLLMENT = "MATRICULATION_FIND_ENROLLMENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.STUDENT } )
  public static final String MATRICULATION_SEND_ENROLLMENT = "MATRICULATION_SEND_ENROLLMENT";

  @Override
  public List<String> listPermissions() {
    return listPermissions(MatriculationPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(MatriculationPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(MatriculationPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(MatriculationPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(MatriculationPermissions.class, permission);
  }

}
