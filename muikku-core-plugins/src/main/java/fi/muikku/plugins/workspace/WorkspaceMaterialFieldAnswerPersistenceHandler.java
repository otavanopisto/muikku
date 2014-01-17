package fi.muikku.plugins.workspace;

import java.util.Map;

import org.w3c.dom.Document;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public interface WorkspaceMaterialFieldAnswerPersistenceHandler {

  public String getFieldType();
  public void persistField(String fieldPrefix, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap) throws MaterialQueryIntegrityExeption;
  public void loadField(String fieldPrefix, Document document, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField) throws MaterialQueryIntegrityExeption;
  
}
