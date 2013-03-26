package fi.muikku.security.forum;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractPermissionCollection;
import fi.muikku.security.PermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class ForumResourcePermissionCollection extends AbstractPermissionCollection 
    implements PermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  public static final String FORUM_CREATEENVIRONMENTFORUM = "FORUM_CREATEENVIRONMENTFORUM";
  
  @Scope ("FORUM")
  public static final String FORUM_WRITEAREA = "FORUM_WRITEAREA";
  
  @Scope ("FORUM")
  public static final String FORUM_LISTTHREADS = "FORUM_LISTTHREADS";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(ForumResourcePermissionCollection.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(ForumResourcePermissionCollection.class, permission);
  }
}
