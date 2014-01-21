package fi.muikku.plugins.workspace.fieldrendering;

import java.io.IOException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

public interface HtmlMaterialFieldRenderer {

  public String getType();
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField) throws JsonParseException, JsonMappingException, IOException ;
  
}
