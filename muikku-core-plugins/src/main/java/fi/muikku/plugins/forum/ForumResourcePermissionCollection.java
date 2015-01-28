package fi.muikku.plugins.forum;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class ForumResourcePermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ( { ADMINISTRATOR, MANAGER, HEAD_OF_DPT } )
  public static final String FORUM_CREATEENVIRONMENTFORUM = "FORUM_CREATEENVIRONMENTFORUM";
  
  @Scope ("FORUM")
  @DefaultPermissionRoles ( { ADMINISTRATOR, MANAGER, HEAD_OF_DPT, TEACHER, STUDENT } )
  public static final String FORUM_WRITEAREA = "FORUM_WRITEAREA";
  
  @Scope ("FORUM")
  @DefaultPermissionRoles ( { ADMINISTRATOR, MANAGER, HEAD_OF_DPT, TEACHER, STUDENT } )
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
  
  @Override
  public String[] getDefaultRoles(String permission) throws NoSuchFieldException {
    return getDefaultRoles(ForumResourcePermissionCollection.class, permission);
  }
}
