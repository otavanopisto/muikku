package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.schooldata.entity.Workspace;

public class SchoolDataEntityInitializerProvider {

  @Inject
  private Instance<SchoolDataWorkspaceInitializer> workspaceInitializers;
  
  public List<Workspace> initWorkspaces(List<Workspace> workspaces) {
    if (!workspaces.isEmpty()) {
      List<SchoolDataWorkspaceInitializer> initializers = new ArrayList<>();
      
      Iterator<SchoolDataWorkspaceInitializer> initializerIterator = workspaceInitializers.iterator();
      while (initializerIterator.hasNext()) {
        initializers.add(initializerIterator.next());
      }
      
      Collections.sort(initializers, new Comparator<SchoolDataWorkspaceInitializer>() {
        
        @Override
        public int compare(SchoolDataWorkspaceInitializer o1, SchoolDataWorkspaceInitializer o2) {
          return o1.getPriority() - o2.getPriority();
        }
        
      }); 
      
      for (SchoolDataWorkspaceInitializer initializer : initializers) {
        initializer.init(workspaces);
      }
    }
    
    return workspaces;
  }
  
}
