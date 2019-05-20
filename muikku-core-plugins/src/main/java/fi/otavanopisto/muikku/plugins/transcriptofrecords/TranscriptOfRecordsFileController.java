package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.io.FileUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileUploadServlet.NoUploadBasePathSetException;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.dao.TranscriptOfRecordsFileDAO;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;

public class TranscriptOfRecordsFileController {
  
  private static final Pattern UUID_PATTERN = Pattern.compile(
      "^" + 
          "[0-9a-f]{8}-" +
          "[0-9a-f]{4}-" +
          "[0-9a-f]{4}-" +
          "[0-9a-f]{4}-" +
          "[0-9a-f]{12}" +
      "$");
  
  @Inject
  private TranscriptOfRecordsFileDAO transcriptOfRecordsFileDAO;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  private String getFileUploadBasePath() {
    String basePath = pluginSettingsController.getPluginSetting("transcriptofrecords", "fileUploadBasePath");
    if (basePath == null) {
      throw new NoUploadBasePathSetException();
    }
    
    return basePath;
  }
  
  public TranscriptOfRecordsFile attachFile(
      UserEntity student,
      InputStream content,
      String contentType,
      String title,
      String description
  ) throws IOException {
    String fileUuid = UUID.randomUUID().toString();
    File file = Paths.get(getFileUploadBasePath(), fileUuid).toFile();
    try {
      FileUtils.copyInputStreamToFile(content, file);
    } catch (IOException ex) {
      file.delete();
      
      throw new RuntimeException("Couldn't save file", ex);
    }
    
    TranscriptOfRecordsFile torFile = transcriptOfRecordsFileDAO.create(
      student,
      fileUuid,
      contentType,
      title,
      description
    );
    torFile.setSize(file.length());
    return torFile;
  }
  
  public List<TranscriptOfRecordsFile> listFiles(UserEntity student) {
    List<TranscriptOfRecordsFile> files = transcriptOfRecordsFileDAO.listByUserEntity(student);
    for (TranscriptOfRecordsFile file : files) {
      file.setSize(getFileSize(file));
    }
    return files;
  }
  
  public TranscriptOfRecordsFile findFileById(Long id) {
    TranscriptOfRecordsFile file = transcriptOfRecordsFileDAO.findById(id);
    if (file != null) {
      file.setSize(getFileSize(file));
    }
    return file;
  }
  
  public void outputFileToStream(TranscriptOfRecordsFile torFile, OutputStream stream) {
    String fileUuid = torFile.getFileName();
    if (!UUID_PATTERN.matcher(fileUuid).matches()) {
      throw new RuntimeException("File name is not a valid UUID");
    }
    File file = Paths.get(getFileUploadBasePath(), fileUuid).toFile();
    try {
      FileUtils.copyFile(file, stream);
    } catch (IOException e) {
      // Wrap with unchecked exception to adhere to StreamingOutput interface
      throw new RuntimeException(e);
    }
  }

  public void delete(TranscriptOfRecordsFile file) {
    transcriptOfRecordsFileDAO.archive(file);
  }

  private Long getFileSize(TranscriptOfRecordsFile transcriptOfRecordsFile) {
    String fileUuid = transcriptOfRecordsFile.getFileName();
    File file = Paths.get(getFileUploadBasePath(), fileUuid).toFile();
    return file == null ? 0 : file.length();
  }

}