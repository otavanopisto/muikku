package fi.muikku.schooldata.initializers;

import java.util.List;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.schooldata.entity.Workspace;

public class SchoolDataEntityInitializerProvider {

  @Inject
  private Instance<SchoolDataWorkspaceInitializer> workspaceInitializers;
  
  public List<Workspace> initWorkspaces(List<Workspace> workspaces) {
    if (!workspaces.isEmpty()) {
      for (SchoolDataWorkspaceInitializer initializer : workspaceInitializers) {
        initializer.init(workspaces);
      }
    }
    
    return workspaces;
  }
  
}
