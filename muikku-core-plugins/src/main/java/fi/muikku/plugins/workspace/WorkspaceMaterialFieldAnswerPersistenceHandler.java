package fi.muikku.plugins.workspace;

import java.util.Map;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public interface WorkspaceMaterialFieldAnswerPersistenceHandler {

  public String getFieldType();
  public void persistField(String fieldPrefix, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap);
  
}
