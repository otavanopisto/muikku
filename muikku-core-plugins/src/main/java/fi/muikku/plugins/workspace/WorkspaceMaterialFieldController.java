package fi.muikku.plugins.workspace;

import java.util.Collection;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

@Stateless
@Dependent
public class WorkspaceMaterialFieldController {
  
  @Inject
  private WorkspaceMaterialFieldDAO workspaceMaterialFieldDAO;

  public WorkspaceMaterialField createWorkspaceMaterialField(String name, QueryField queryField, WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterialFieldDAO.create(name, queryField, workspaceMaterial);
  }
  
  public List<WorkspaceMaterialField> listWorkspaceMaterialFieldsByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial){
    return workspaceMaterialFieldDAO.listByWorkspaceMaterial(workspaceMaterial);
  }
  
  public WorkspaceMaterialField findWorkspaceMaterialFieldByWorkspaceMaterialAndName(WorkspaceMaterial workspaceMaterial, String name) {
    return workspaceMaterialFieldDAO.findByWorkspaceMaterialAndName(workspaceMaterial, name); 
  }

  public void deleteWorkspaceMaterialField(WorkspaceMaterialField workspaceMaterialField) {
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
