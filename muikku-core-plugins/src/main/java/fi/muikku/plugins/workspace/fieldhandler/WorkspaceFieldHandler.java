package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public interface WorkspaceFieldHandler {

  public String getType();

  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField, WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException, MaterialQueryIntegrityExeption;

  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String[]> requestParameterMap) throws MaterialQueryIntegrityExeption;
  
}
