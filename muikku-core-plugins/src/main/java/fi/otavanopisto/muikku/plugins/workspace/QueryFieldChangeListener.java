package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;

public class QueryFieldChangeListener {
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;
  
  public void onQueryOrganizerFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.organizer")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }

  public void onQuerySorterFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.sorter")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }

  public void onQuerySelectFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.select")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }

  public void onQueryMultiSelectFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.multiselect")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }
  
  public void onQueryFieldDelete(@Observes QueryFieldDeleteEvent event) {
    QueryField queryField = event.getQueryField();
    List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
    for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
      workspaceMaterialFieldController.deleteWorkspaceMaterialField(workspaceMaterialField, event.getRemoveAnswers());
    }
  }
  
}
