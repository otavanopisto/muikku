package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.PersistenceException;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.files.TempFileUtils;
import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.MaterialQueryPersistanceExeption;
import fi.muikku.plugins.material.fieldmeta.FileFieldMeta;
import fi.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceFileFieldHandler extends AbstractWorkspaceFieldHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public String getType() {
    return "application/vnd.muikku.field.file";
  }

  @Override
  public void renderField(Document ownerDocument, Element objectElement, String content, WorkspaceMaterialField workspaceMaterialField,
      WorkspaceMaterialReply workspaceMaterialReply) throws JsonParseException, JsonMappingException, IOException {

    FileFieldMeta fileFieldMeta = (new ObjectMapper()).readValue(content, FileFieldMeta.class);
    
    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
    String value = null;
        
    /*WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
    if (fieldAnswer != null) {
      value = fieldAnswer.getValue();
    }*/
    
    Element inputElement = ownerDocument.createElement("input");
    inputElement.setAttribute("type", "file");
    inputElement.setAttribute("class", "muikku-file-input-field");
    inputElement.setAttribute("name", parameterName);
    inputElement.setAttribute("placeholder", fileFieldMeta.getHelp());
    inputElement.setAttribute("title", fileFieldMeta.getHint());
    if (StringUtils.isNotEmpty(value)) {
      inputElement.setTextContent(value);
    }
    
    Node objectParent = objectElement.getParentNode();
    objectParent.insertBefore(inputElement, objectElement);
    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String[]> requestParameterMap)
      throws MaterialQueryIntegrityExeption, MaterialQueryPersistanceExeption {
    
    String fieldName = getHtmlFieldName(workspaceMaterialField.getName());
    Integer fileCount = getRequestParameterMapFirstIntegerValue(requestParameterMap, fieldName + "-file-count");
    if (fileCount == null) {
      throw new MaterialQueryPersistanceExeption("Invalid request");
    }
    
    if (fileCount > 0) {
      // TODO: support for multiple files
      if (fileCount != 1) {
        throw new MaterialQueryPersistanceExeption("Field does not allow multiple files");
      }
      
      for (int fileIndex = 0; fileIndex < fileCount; fileIndex++) {
        String fieldPrefix = fieldName + '.' + fileIndex;
        
        String fileId = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-file-id");
        String contentType = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-content-type");
        String filename = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-filename");
        try {
          byte[] fileData = TempFileUtils.getTempFileData(fileId);
          if (fileData == null) {
            throw new PersistenceException("Temp file does not exist");
          }
  
          System.out.println(fileData.length);
          System.out.println(contentType);
          System.out.println(filename);
          
          TempFileUtils.deleteTempFile(fileId);
        } catch (IOException e) {
          throw new PersistenceException("Failed to retrieve file data", e);
        }
      }
    } else {

    }
  }

}
