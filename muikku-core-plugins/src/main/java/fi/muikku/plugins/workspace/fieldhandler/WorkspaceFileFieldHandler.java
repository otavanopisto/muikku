package fi.muikku.plugins.workspace.fieldhandler;

import java.io.IOException;
import java.util.List;
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
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
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
//
//    FileFieldMeta fileFieldMeta = (new ObjectMapper()).readValue(content, FileFieldMeta.class);
//    WorkspaceMaterialFileFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerByFieldAndReply(workspaceMaterialField, workspaceMaterialReply);
//    
//    String parameterName = getHtmlFieldName(workspaceMaterialField.getName());
//    
//    Element inputElement = ownerDocument.createElement("input");
//    inputElement.setAttribute("type", "file");
//    inputElement.setAttribute("class", "muikku-file-input-field");
//    inputElement.setAttribute("name", parameterName);
//    inputElement.setAttribute("placeholder", fileFieldMeta.getHelp());
//    inputElement.setAttribute("title", fileFieldMeta.getHint());
//    
//    if (fieldAnswer != null) {
//      List<WorkspaceMaterialFileFieldAnswerFile> answerFiles = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer(fieldAnswer);
//      inputElement.setAttribute("data-file-count", String.valueOf(answerFiles.size()));
//          
//      for (int i = 0, l = answerFiles.size(); i < l; i++) {
//        WorkspaceMaterialFileFieldAnswerFile answerFile = answerFiles.get(i);
//        inputElement.setAttribute("data-file-" + i + ".file-id", answerFile.getFileId()); 
//        inputElement.setAttribute("data-file-" + i + ".content-type", answerFile.getContentType()); 
//        inputElement.setAttribute("data-file-" + i + ".filename", answerFile.getFileName()); 
//      }
//    }
//
//    Node objectParent = objectElement.getParentNode();
//    objectParent.insertBefore(inputElement, objectElement);
//    objectParent.removeChild(objectElement);
  }

  @Override
  public void persistField(WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String[]> requestParameterMap)
      throws MaterialQueryIntegrityExeption, MaterialQueryPersistanceExeption {
//    
//    String fieldName = getHtmlFieldName(workspaceMaterialField.getName());
//    Integer fileCount = getRequestParameterMapFirstIntegerValue(requestParameterMap, fieldName + "-file-count");
//    if (fileCount == null) {
//      throw new MaterialQueryPersistanceExeption("Invalid request");
//    }
//    
//    WorkspaceMaterialFileFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerByFieldAndReply(workspaceMaterialField, reply);
//
//    if (fileCount > 0) {
//      if (fieldAnswer == null) {
//        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialFileFieldAnswer(workspaceMaterialField, reply);
//      }
//      
//      // TODO: support for multiple files
//      if (fileCount != 1) {
//        throw new MaterialQueryPersistanceExeption("Field does not allow multiple files");
//      } 
//        
//      for (int fileIndex = 0; fileIndex < fileCount; fileIndex++) {
//        String fieldPrefix = fieldName + '.' + fileIndex;
//        
//        String originalFileId = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-original-file-id");
//        String fileId = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-file-id");
//        String contentType = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-content-type");
//        String fileName = getRequestParameterMapFirstValue(requestParameterMap, fieldPrefix + "-filename");
//
//        try {
//          if (StringUtils.isNotBlank(fileId)) {
//            if (!StringUtils.equals(originalFileId, fileId)) {
//              byte[] fileData = TempFileUtils.getTempFileData(fileId);
//              if (fileData == null) {
//                throw new PersistenceException("Temp file does not exist");
//              }
//              
//              if (StringUtils.isNotBlank(originalFileId)) {
//                WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(originalFileId);
//                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileFileId(fieldAnswerFile, fileId);
//                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileContentType(fieldAnswerFile, contentType);
//                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileFileName(fieldAnswerFile, fileName);
//                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileContent(fieldAnswerFile, fileData);
//              } else {
//                workspaceMaterialFieldAnswerController.createWorkspaceMaterialFileFieldAnswerFile(fieldAnswer, fileData, contentType, fileId, fileName);
//              }
//              
//              TempFileUtils.deleteTempFile(fileId);
//            }
//          } else {
//            if (StringUtils.isNotBlank(originalFileId)) {
//              WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(originalFileId);
//              workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFileFieldAnswerFile(fieldAnswerFile);
//            }
//          }
//        } catch (IOException e) {
//          throw new PersistenceException("Failed to retrieve file data", e);
//        }
//      }
//
//    } else {
//
//    }
  }

}
