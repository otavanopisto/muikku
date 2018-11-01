package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.base.SystemSettingDAO;
import fi.otavanopisto.muikku.model.base.SystemSetting;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerFileDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;

public class FileAnswerUtils {
  
  public static final String SETTING_ENABLED = "fileanswers.storageEnabled";
  public static final String SETTING_FILEFOLDER = "fileanswers.storageFolder";
  public static final String SETTING_LASTID = "fileanswers.lastId";

  @Inject
  private Logger logger;

  @Inject
  private SystemSettingDAO systemSettingDAO;
  
  @Inject
  private WorkspaceMaterialFileFieldAnswerFileDAO workspaceMaterialFileFieldAnswerFileDAO;
  
  public Long getLastEntityId() {
    SystemSetting idSetting = systemSettingDAO.findByKey(SETTING_LASTID);
    return idSetting == null ? 0L : Long.valueOf(idSetting.getValue());
  }
  
  public void setLastEntityId(Long id) {
    SystemSetting idSetting = systemSettingDAO.findByKey(SETTING_LASTID);
    if (idSetting == null) {
      systemSettingDAO.create(SETTING_LASTID, id.toString());
    }
    else {
      systemSettingDAO.update(idSetting, id.toString());
    }
  }
  
  public boolean isFileSystemStorageEnabled() {
    SystemSetting enabledSetting = systemSettingDAO.findByKey(SETTING_ENABLED);
    return enabledSetting != null && Boolean.valueOf(enabledSetting.getValue());
  }
  
  public byte[] getFileContent(Long userEntityId, String fileId) throws IOException {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid fetch parameters: file %s of user %d", fileId, userEntityId));
      return new byte[0];
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(SETTING_FILEFOLDER);
    if (fileFolderSetting != null && !StringUtils.isBlank(fileFolderSetting.getValue())) {
      java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
      if (answerFile.exists()) {
        return Files.readAllBytes(answerFile.toPath());
      }
    }
    logger.warning(String.format("Failed to retrieve file %s of user %d", fileId, userEntityId));
    return new byte[0];
  }
  
  public void storeFileToFileSystem(Long userEntityId, String fileId, byte[] content) throws IOException {
    if (userEntityId == null || fileId == null || content == null) {
      logger.severe(String.format("Invalid store parameters or no file content: file %s of user %d", fileId, userEntityId));
      return;
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(SETTING_FILEFOLDER);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      throw new IOException("File answer storage folder not set");
    }
    java.io.File fileFolder = Paths.get(fileFolderSetting.getValue()).toFile();
    if (!fileFolder.exists() || !fileFolder.isDirectory()) {
      throw new IOException(String.format("File answer storage folder %s is not a directory", fileFolderSetting.getValue()));
    }
    java.io.File userFolder = Paths.get(fileFolder.getPath(), userEntityId.toString()).toFile();
    if (!userFolder.exists()) {
      logger.info(String.format("Creating user file folder %s", userFolder.getPath()));
      if (!userFolder.mkdir()) {
        throw new IOException(String.format("Failed to create user file folder %s", userFolder.getPath()));
      }
    }
    java.io.File answerFile = Paths.get(userFolder.getPath(), fileId).toFile();
    if (answerFile.exists()) {
      throw new IOException(String.format("User file %s already exists", answerFile.getPath()));
    }
    FileOutputStream fileOutputStream = null;
    try {
      fileOutputStream = new FileOutputStream(answerFile);
      IOUtils.write(content, fileOutputStream);
      fileOutputStream.flush();
      fileOutputStream.close();
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, String.format("Failed to create user file %s", answerFile.getPath()), e);
      throw new IOException("Failed to store file data", e);
    }
  }
  
  public void removeFileFromFileSystem(Long userEntityId, String fileId) {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid remove parameters: file %s of user %d", fileId, userEntityId));
      return;
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(SETTING_FILEFOLDER);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      logger.warning("File answer storage folder not set");
      return;
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    if (!answerFile.exists()) {
      logger.warning(String.format("File %s to be removed is not found", answerFile.getPath()));
      return;
    }
    if (!answerFile.delete()) {
      logger.warning(String.format("Failed to delete file %s", answerFile.getPath()));
    }
  }
  
  public int relocateToFileSystem(WorkspaceMaterialFileFieldAnswer answer) throws IOException {
    int totalBytes = 0;
    Long userEntityId = answer.getReply().getUserEntityId();
    List<WorkspaceMaterialFileFieldAnswerFile> files = workspaceMaterialFileFieldAnswerFileDAO.listByFieldAnswer(answer);
    for (WorkspaceMaterialFileFieldAnswerFile file : files) {
      if (file.getContent() != null) {
        int bytes = file.getContent().length;
        storeFileToFileSystem(userEntityId, file.getFileId(), file.getContent());
        workspaceMaterialFileFieldAnswerFileDAO.updateContent(file,  null);
        logger.info(String.format("Relocated file %s (%s) of user %d to file system (%d bytes)",
            file.getFileId(),
            file.getFileName(),
            userEntityId,
            bytes));
        totalBytes += bytes;
      }
    }
    return totalBytes;
  }
  

}
