package fi.otavanopisto.muikku.plugins.evaluation;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.base.SystemSettingDAO;
import fi.otavanopisto.muikku.model.base.SystemSetting;

public class EvaluationFileStorageUtils {

  private static final String STORAGE_TYPE = "evaluationaudiofiles";
  private static final String STORAGE_ENABLED_VARIABLEKEY = "evaluationaudiofiles.storageEnabled";
  private static final String STORAGE_FOLDER_VARIABLEKEY = "evaluationaudiofiles.storageFolder";
  
  @Inject
  private Logger logger;

  @Inject
  private SystemSettingDAO systemSettingDAO;

  public boolean isFileSystemStorageEnabled() {
    SystemSetting enabledSetting = systemSettingDAO.findByKey(STORAGE_ENABLED_VARIABLEKEY);
    return enabledSetting != null && Boolean.valueOf(enabledSetting.getValue());
  }
  
  public byte[] getFileContent(Long userEntityId, String fileId) throws IOException {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid fetch parameters: %s %s of user %d", STORAGE_TYPE, fileId, userEntityId));
      throw new IllegalArgumentException("Invalid fetch parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(STORAGE_FOLDER_VARIABLEKEY);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      throw new IOException(String.format("%s storage folder not set", STORAGE_FOLDER_VARIABLEKEY));
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    if (answerFile.exists()) {
      return Files.readAllBytes(answerFile.toPath());
    }
    else {
      logger.warning(String.format("%s %s of user %d not found", STORAGE_TYPE, fileId, userEntityId));
      throw new FileNotFoundException(); 
    }
  }
  
  public String getFileContentType(Long userEntityId, String fileId) throws IOException {
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(STORAGE_FOLDER_VARIABLEKEY);
    if (fileFolderSetting != null) {
      java.nio.file.Path path = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId);
      return Files.probeContentType(path);
    }
    return null;
  }
  
  public void storeFileToFileSystem(Long userEntityId, String fileId, byte[] content) throws IOException {
    if (userEntityId == null || fileId == null || content == null) {
      logger.severe(String.format("Invalid store parameters or no file content: file %s of user %d", fileId, userEntityId));
      throw new IllegalArgumentException("Invalid store parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(STORAGE_FOLDER_VARIABLEKEY);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      throw new IOException(String.format("%s storage folder not set", STORAGE_FOLDER_VARIABLEKEY));
    }
    java.io.File fileFolder = Paths.get(fileFolderSetting.getValue()).toFile();
    if (!fileFolder.exists() || !fileFolder.isDirectory()) {
      throw new IOException(String.format("Storage folder %s is not a directory", fileFolderSetting.getValue()));
    }
    java.io.File userFolder = Paths.get(fileFolder.getPath(), userEntityId.toString()).toFile();
    if (!userFolder.exists()) {
      logger.info(String.format("Creating user %s folder %s", STORAGE_TYPE, userFolder.getPath()));
      if (!userFolder.mkdir()) {
        throw new IOException(String.format("Failed to create user %s folder %s", STORAGE_TYPE, userFolder.getPath()));
      }
    }
    java.io.File answerFile = Paths.get(userFolder.getPath(), fileId).toFile();
    if (answerFile.exists()) {
      throw new IOException(String.format("User %s %s already exists", STORAGE_TYPE, answerFile.getPath()));
    }
    FileOutputStream fileOutputStream = null;
    try {
      fileOutputStream = new FileOutputStream(answerFile);
      IOUtils.write(content, fileOutputStream);
      fileOutputStream.flush();
      fileOutputStream.close();
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, String.format("Failed to create user %s %s", STORAGE_TYPE, answerFile.getPath()), e);
      throw new IOException("Failed to store file data", e);
    }
  }
  
  public boolean isFileInFileSystem(Long userEntityId, String fileId) {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid check existence parameters: file %s of user %d", fileId, userEntityId));
      throw new IllegalArgumentException("Invalid check parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(STORAGE_FOLDER_VARIABLEKEY);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      logger.warning("Storage folder not set");
      return false;
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    return answerFile.exists();
  }
  
  public void removeFileFromFileSystem(Long userEntityId, String fileId) throws IOException {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid remove parameters: file %s of user %d", fileId, userEntityId));
      throw new IllegalArgumentException("Invalid remove parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(STORAGE_FOLDER_VARIABLEKEY);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      logger.warning(String.format("%s storage folder not set", STORAGE_FOLDER_VARIABLEKEY));
      throw new IOException("Storage folder not set");
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    if (!answerFile.exists()) {
      logger.warning(String.format("%s %s to be removed is not found", STORAGE_TYPE, answerFile.getPath()));
      throw new IOException("File to remove not found");
    }
    if (!answerFile.delete()) {
      logger.warning(String.format("Failed to delete %s %s", STORAGE_TYPE, answerFile.getPath()));
      throw new IOException("File removal failed");
    }
  }
  
}
