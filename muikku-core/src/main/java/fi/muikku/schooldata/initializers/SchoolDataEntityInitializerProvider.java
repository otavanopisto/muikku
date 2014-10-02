package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserRole;
import fi.muikku.schooldata.entity.Workspace;

public class SchoolDataEntityInitializerProvider {

  @Inject
  private Instance<SchoolDataWorkspaceInitializer> workspaceInitializers;
  
  @Inject
  private Instance<SchoolDataUserInitializer> userInitializers;

  @Inject
  private Instance<SchoolDataRoleInitializer> roleInitializers;

  @Inject
  private Instance<SchoolDataUserRoleInitializer> userRoleInitializers;
  
  public List<Workspace> initWorkspaces(List<Workspace> workspaces) {
    if (!workspaces.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(workspaceInitializers.iterator())) {
        ((SchoolDataWorkspaceInitializer) initializer).init(workspaces);
      }
    }
    
    return workspaces;
  }

  public List<User> initUsers(List<User> users) {
    if (!users.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(userInitializers.iterator())) {
        ((SchoolDataUserInitializer) initializer).init(users);
      }
    }
    
    return users;
  }

  public List<Role> initRoles(List<Role> roles) {
    if (!roles.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(roleInitializers.iterator())) {
        ((SchoolDataRoleInitializer) initializer).init(roles);
      }
    }
    
    return roles;
  }

  public List<UserRole> initUserRoles(List<UserRole> userRoles) {
    if (!userRoles.isEmpty()) {
      for (SchoolDataEntityInitializer initializer : getSortedInitializers(userRoleInitializers.iterator())) {
        ((SchoolDataUserRoleInitializer) initializer).init(userRoles);
      }
    }
    
    return userRoles;
  }
  
  private List<? extends SchoolDataEntityInitializer> getSortedInitializers(Iterator<? extends SchoolDataEntityInitializer> iterator) {
    List<SchoolDataEntityInitializer> initializers = new ArrayList<>();
    
    while (iterator.hasNext()) {
      initializers.add(iterator.next());
    }
    
    return sortInitializers(initializers);
  }

  private List<SchoolDataEntityInitializer> sortInitializers(List<SchoolDataEntityInitializer> initializers) {
    Collections.sort(initializers, new Comparator<SchoolDataEntityInitializer>() {
      
      @Override
      public int compare(SchoolDataEntityInitializer o1, SchoolDataEntityInitializer o2) {
        return o1.getPriority() - o2.getPriority();
      }
    });
    
    return initializers;
  } 
  
}
