package fi.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

public class QueryFieldDeleteListener {
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  public void onQueryFieldDelete(@Observes QueryFieldDeleteEvent event) {
    QueryField queryField = event.getQueryField();
    
    List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
    for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
      workspaceMaterialFieldController.deleteWorkspaceMaterialField(workspaceMaterialField);
    }
  }
  
}
