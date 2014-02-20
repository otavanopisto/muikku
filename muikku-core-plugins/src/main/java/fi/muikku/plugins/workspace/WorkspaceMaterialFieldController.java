package fi.muikku.plugins.workspace;

import java.util.Collection;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldCreateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldDeleteEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialFieldUpdateEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

@Stateless
@Dependent
public class WorkspaceMaterialFieldController {
  
  @Inject
  private WorkspaceMaterialFieldDAO workspaceMaterialFieldDAO;

  @Inject
  private Event<WorkspaceMaterialFieldCreateEvent> workspaceMaterialFieldCreateEvent;

  @SuppressWarnings("unused")
  @Inject
  private Event<WorkspaceMaterialFieldUpdateEvent> workspaceMaterialFieldUpdateEvent;
  
  @Inject
  private Event<WorkspaceMaterialFieldDeleteEvent> workspaceMaterialFieldDeleteEvent;

  public WorkspaceMaterialField createWorkspaceMaterialField(String name, QueryField queryField, WorkspaceMaterial workspaceMaterial) {
    WorkspaceMaterialField workspaceMaterialField = workspaceMaterialFieldDAO.create(name, queryField, workspaceMaterial);
    workspaceMaterialFieldCreateEvent.fire(new WorkspaceMaterialFieldCreateEvent(workspaceMaterialField));
    return workspaceMaterialField;
  }
  
  public WorkspaceMaterialField findWorkspaceMaterialFieldByWorkspaceMaterialAndName(WorkspaceMaterial workspaceMaterial, String name) {
    return workspaceMaterialFieldDAO.findByWorkspaceMaterialAndName(workspaceMaterial, name); 
  }
  
  public List<WorkspaceMaterialField> listWorkspaceMaterialFieldsByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial){
    return workspaceMaterialFieldDAO.listByWorkspaceMaterial(workspaceMaterial);
  }

  public List<WorkspaceMaterialField> listWorkspaceMaterialFieldsByQueryField(QueryField queryField) {
    return workspaceMaterialFieldDAO.listByQueryField(queryField);
  }

  public void deleteWorkspaceMaterialField(WorkspaceMaterialField workspaceMaterialField) {
    workspaceMaterialFieldDeleteEvent.fire(new WorkspaceMaterialFieldDeleteEvent(workspaceMaterialField));
    workspaceMaterialFieldDAO.delete(workspaceMaterialField);
  }
  
  public String getAssignedFieldName(String workspaceMaterialId, String embedId, String fieldName, Collection<String> assignedNames) {
    StringBuilder fieldNameBuilder = new StringBuilder()
      .append(workspaceMaterialId)
      .append(':');
    
    if (StringUtils.isNotBlank(embedId)) {
      fieldNameBuilder
        .append(embedId)
        .append(':');
    }
    
    fieldNameBuilder
      .append(fieldName)
      .append(':');
    
    int index = 0;
    String assignedFieldName = null;
    do {
      assignedFieldName = fieldNameBuilder.toString() + index;
      index++;
    } while (assignedNames.contains(assignedFieldName));
    
    return assignedFieldName;
  }
  
}
