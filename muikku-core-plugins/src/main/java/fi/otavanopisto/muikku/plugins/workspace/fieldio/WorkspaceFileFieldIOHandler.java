package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceFileFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    File[] files = null;
    
    try {
      files = new ObjectMapper().readValue(value, File[].class);
    } catch (IOException e) {
      throw new WorkspaceFieldIOException("Could not unmarshal field reply", e);
    }
    
    WorkspaceMaterialFileFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer == null) {
      fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialFileFieldAnswer(field, reply);
    }
    
    if (files.length > 0) {
      
      // TODO: support for multiple files
//      if (files.length != 1) {
//        throw new WorkspaceFieldIOException("File field does not support multiple files");
//      } 
        
      for (File file : files) {
        try {
          if (StringUtils.isNotBlank(file.getId())) {
            if (!StringUtils.equals(file.getOriginalId(), file.getId())) {
              byte[] fileData = TempFileUtils.getTempFileData(file.getId());
              if (fileData == null) {
                throw new WorkspaceFieldIOException("Temp file does not exist");
              }
              
              if (StringUtils.isNotBlank(file.getOriginalId())) {
                // original id exists, so we are updating an existing file
                WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(file.getOriginalId());
                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileFileId(fieldAnswerFile, file.getId());
                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileContentType(fieldAnswerFile, file.getContentType());
                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileFileName(fieldAnswerFile, file.getName());
                workspaceMaterialFieldAnswerController.updateWorkspaceMaterialFileFieldAnswerFileContent(fieldAnswerFile, fileData);
              } else {
                // original id not found, so it's a new file
                workspaceMaterialFieldAnswerController.createWorkspaceMaterialFileFieldAnswerFile(fieldAnswer, fileData, file.getContentType(), file.getId(), file.getName());
              }
              
              TempFileUtils.deleteTempFile(file.getId());
            }
          } else {
            // original id exists but id does not, file has been removed
            if (StringUtils.isNotBlank(file.getOriginalId())) {
              WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(file.getOriginalId());
              if (fieldAnswerFile != null) {
                workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFileFieldAnswerFile(fieldAnswerFile);
              }
            }
          }
        } catch (IOException e) {
          throw new WorkspaceFieldIOException("Failed to retrieve file data", e);
        }
      }
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException{
    List<File> result = new ArrayList<>();
    
    WorkspaceMaterialFileFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerByFieldAndReply(field, reply);
    
    if (fieldAnswer != null) {
      List<WorkspaceMaterialFileFieldAnswerFile> answerFiles = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer(fieldAnswer);
      for (WorkspaceMaterialFileFieldAnswerFile answerFile : answerFiles) {
        result.add(new File(null, answerFile.getFileId(), answerFile.getFileName(), answerFile.getContentType()));
      }
    }
    
    try {
      return new ObjectMapper().writeValueAsString(result);
    } catch (IOException e) {
      throw new WorkspaceFieldIOException("Could not marshal file file response", e);
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.file";
  }
  
  @SuppressWarnings("unused")
  private static class File {
    
    public File() {
    }
    
    public File(String id, String originalId, String name, String contentType) {
      this.id = id;
      this.originalId = originalId;
      this.name = name;
      this.contentType = contentType;
    }

    public String getId() {
      return id;
    }
    
    public void setId(String id) {
      this.id = id;
    }
    
    public String getOriginalId() {
      return originalId;
    }
    
    public void setOriginalId(String originalId) {
      this.originalId = originalId;
    }
    
    public String getContentType() {
      return contentType;
    }
    
    public void setContentType(String contentType) {
      this.contentType = contentType;
    }
    
    public String getName() {
      return name;
    }
    
    public void setName(String name) {
      this.name = name;
    }
    
    private String id;
    private String originalId;
    private String name;
    private String contentType;
  }

}
