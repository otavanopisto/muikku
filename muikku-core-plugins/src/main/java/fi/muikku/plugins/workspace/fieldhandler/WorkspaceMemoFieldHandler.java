package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.fieldmeta.MemoField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceMemoFieldHandler implements WorkspaceFieldHandler {

  @Override
  public String getType() {
    return "application/vnd.muikku.field.memo";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

    MemoField memoField = (new ObjectMapper()).readValue(content, MemoField.class);
    
    Element textAreaElement = ownerDocument.createElement("textarea");
    textAreaElement.setAttribute("name", memoField.getName());
    textAreaElement.setAttribute("cols", String.valueOf(memoField.getColumns()));
    textAreaElement.setAttribute("rows", String.valueOf(memoField.getRows()));
    textAreaElement.setAttribute("placeholder", memoField.getHelp());
    textAreaElement.setAttribute("title", memoField.getHint());
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(textAreaElement, objectElement);
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap)
      throws MaterialQueryIntegrityExeption {
  }

}
