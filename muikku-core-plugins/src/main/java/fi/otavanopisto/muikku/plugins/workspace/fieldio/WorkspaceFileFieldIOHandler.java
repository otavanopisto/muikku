package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

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
  private Logger logger;

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
    
    List<WorkspaceMaterialFileFieldAnswerFile> currentFiles = workspaceMaterialFieldAnswerController.listWorkspaceMaterialFileFieldAnswerFilesByFieldAnswer(fieldAnswer);
    Set<String> currentFileIds = new HashSet<String>();
    for (WorkspaceMaterialFileFieldAnswerFile currentFile : currentFiles) {
      currentFileIds.add(currentFile.getFileId());
    }
    
    for (File file : files) {
      try {
        String fileId = file.getFileId();
        if (StringUtils.isBlank(fileId)) {
          throw new WorkspaceFieldIOException("Blank fileId");
        }
        if (currentFileIds.contains(fileId)) {
          // Existing file
          currentFileIds.remove(fileId);
        }
        else {
          // New file
          byte[] fileData = TempFileUtils.getTempFileData(fileId);
          if (fileData == null) {
            throw new WorkspaceFieldIOException("Temp file does not exist");
          }
          logger.info(String.format("Creating new file answer %s (%s)", fileId, file.getName()));
          workspaceMaterialFieldAnswerController.createWorkspaceMaterialFileFieldAnswerFile(fieldAnswer, fileData, file.getContentType(), fileId, file.getName());
        }
      } catch (IOException e) {
        throw new WorkspaceFieldIOException("Failed to store file data", e);
      }
    }
    
    // Removed files
    for (String removedId : currentFileIds) {
      WorkspaceMaterialFileFieldAnswerFile fieldAnswerFile = workspaceMaterialFieldAnswerController.findWorkspaceMaterialFileFieldAnswerFileByFileId(removedId);
      if (fieldAnswerFile != null) {
        logger.info(String.format("Removing existing file answer %s (%s)", removedId, fieldAnswerFile.getFileName()));
        workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialFileFieldAnswerFile(fieldAnswerFile);
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
        result.add(new File(answerFile.getFileId(), answerFile.getFileName(), answerFile.getContentType()));
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
    
    public File(String fileId, String name, String contentType) {
      this.fileId = fileId;
      this.name = name;
      this.contentType = contentType;
    }

    public String getFileId() {
      return fileId;
    }
    
    public void setFileId(String fileId) {
      this.fileId = fileId;
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
    
    private String fileId;
    private String name;
    private String contentType;
  }

}
