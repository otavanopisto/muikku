package fi.muikku.plugins.assessmentrequest;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractPermissionCollection;
import fi.muikku.security.PermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class AssessmentRequestPermissions extends AbstractPermissionCollection implements PermissionCollection {

  @Scope (PermissionScope.WORKSPACE)
  public static final String CREATE_WORKSPACE_ASSESSMENTREQUEST = "CREATE_WORKSPACE_ASSESSMENTREQUEST";
  
  @Scope (PermissionScope.WORKSPACE)
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
}
