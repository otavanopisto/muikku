package fi.muikku.plugins.workspace.fieldio;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public interface WorkspaceFieldIOHandler {

  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value);
  
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply);
  
  public String getType();
  
}
