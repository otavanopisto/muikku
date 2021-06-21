package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.io.FileNotFoundException;
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
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.dao.base.SystemSettingDAO;
import fi.otavanopisto.muikku.model.base.SystemSetting;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialAudioFieldAnswerClipDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerFileDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;

public class FileAnswerUtils {
  
  public static final String FILE_SETTING_ENABLED = "fileanswers.storageEnabled";
  public static final String FILE_SETTING_FOLDER = "fileanswers.storageFolder";
  public static final String FILE_SETTING_LASTID = "fileanswers.lastId";
  public static final String AUDIO_SETTING_ENABLED = "audioanswers.storageEnabled";
  public static final String AUDIO_SETTING_FOLDER = "audioanswers.storageFolder";
  public static final String AUDIO_SETTING_LASTID = "audioanswers.lastId";

  @Inject
  private Logger logger;

  @Inject
  private SystemSettingDAO systemSettingDAO;
  
  @Inject
  private WorkspaceMaterialFileFieldAnswerFileDAO workspaceMaterialFileFieldAnswerFileDAO;

  @Inject
  private WorkspaceMaterialAudioFieldAnswerClipDAO workspaceMaterialAudioFieldAnswerClipDAO;
  
  public Long getLastEntityId(FileAnswerType type) {
    SystemSetting idSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_LASTID : AUDIO_SETTING_LASTID);
    return idSetting == null || !NumberUtils.isNumber(idSetting.getValue()) ? 0L : Long.valueOf(idSetting.getValue());
  }
  
  public void setLastEntityId(FileAnswerType type, Long id) {
    String settingKey = type == FileAnswerType.FILE ? FILE_SETTING_LASTID : AUDIO_SETTING_LASTID;
    SystemSetting idSetting = systemSettingDAO.findByKey(settingKey);
    if (idSetting == null) {
      systemSettingDAO.create(settingKey, id.toString());
    }
    else {
      systemSettingDAO.update(idSetting, id.toString());
    }
  }
  
  public boolean isFileSystemStorageEnabled(FileAnswerType type) {
    SystemSetting enabledSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_ENABLED : AUDIO_SETTING_ENABLED);
    return enabledSetting != null && Boolean.valueOf(enabledSetting.getValue());
  }
  
  public byte[] getFileContent(FileAnswerType type, Long userEntityId, String fileId) throws IOException {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid fetch parameters: %s %s of user %d", type, fileId, userEntityId));
      throw new IllegalArgumentException("Invalid fetch parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_FOLDER : AUDIO_SETTING_FOLDER);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      throw new IOException(String.format("%s storage folder not set", type));
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    if (answerFile.exists()) {
      return Files.readAllBytes(answerFile.toPath());
    }
    else {
      logger.warning(String.format("%s %s of user %d not found", type, fileId, userEntityId));
      throw new FileNotFoundException(); 
    }
  }
  
  public String getFileContentType(FileAnswerType type, Long userEntityId, String fileId) throws IOException {
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_FOLDER : AUDIO_SETTING_FOLDER);
    if (fileFolderSetting != null) {
      java.nio.file.Path path = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId);
      return Files.probeContentType(path);
    }
    return null;
  }
  
  public void storeFileToFileSystem(FileAnswerType type, Long userEntityId, String fileId, byte[] content) throws IOException {
    if (userEntityId == null || fileId == null || content == null) {
      logger.severe(String.format("Invalid store parameters or no file content: file %s of user %d", fileId, userEntityId));
      throw new IllegalArgumentException("Invalid store parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_FOLDER : AUDIO_SETTING_FOLDER);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      throw new IOException(String.format("%s storage folder not set", type));
    }
    java.io.File fileFolder = Paths.get(fileFolderSetting.getValue()).toFile();
    if (!fileFolder.exists() || !fileFolder.isDirectory()) {
      throw new IOException(String.format("%s storage folder %s is not a directory", type, fileFolderSetting.getValue()));
    }
    java.io.File userFolder = Paths.get(fileFolder.getPath(), userEntityId.toString()).toFile();
    if (!userFolder.exists()) {
      logger.info(String.format("Creating user %s folder %s", type, userFolder.getPath()));
      if (!userFolder.mkdir()) {
        throw new IOException(String.format("Failed to create user %s folder %s", type, userFolder.getPath()));
      }
    }
    java.io.File answerFile = Paths.get(userFolder.getPath(), fileId).toFile();
    if (answerFile.exists()) {
      throw new IOException(String.format("User %s %s already exists", type, answerFile.getPath()));
    }
    FileOutputStream fileOutputStream = null;
    try {
      fileOutputStream = new FileOutputStream(answerFile);
      IOUtils.write(content, fileOutputStream);
      fileOutputStream.flush();
      fileOutputStream.close();
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, String.format("Failed to create user %s %s", type, answerFile.getPath()), e);
      throw new IOException("Failed to store file data", e);
    }
  }
  
  public boolean isFileInFileSystem(FileAnswerType type, Long userEntityId, String fileId) {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid check existence parameters: file %s of user %d", fileId, userEntityId));
      throw new IllegalArgumentException("Invalid check parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_FOLDER : AUDIO_SETTING_FOLDER);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      logger.warning("Storage folder not set");
      return false;
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    return answerFile.exists();
  }
  
  public void removeFileFromFileSystem(FileAnswerType type, Long userEntityId, String fileId) throws IOException {
    if (userEntityId == null || fileId == null) {
      logger.severe(String.format("Invalid remove parameters: file %s of user %d", fileId, userEntityId));
      throw new IllegalArgumentException("Invalid remove parameters");
    }
    SystemSetting fileFolderSetting = systemSettingDAO.findByKey(type == FileAnswerType.FILE ? FILE_SETTING_FOLDER : AUDIO_SETTING_FOLDER);
    if (fileFolderSetting == null || StringUtils.isBlank(fileFolderSetting.getValue())) {
      logger.warning(String.format("%s storage folder not set", type));
      throw new IOException("Storage folder not set");
    }
    java.io.File answerFile = Paths.get(fileFolderSetting.getValue(), userEntityId.toString(), fileId).toFile();
    if (!answerFile.exists()) {
      logger.warning(String.format("%s %s to be removed is not found", type, answerFile.getPath()));
      throw new IOException("File to remove not found");
    }
    if (!answerFile.delete()) {
      logger.warning(String.format("Failed to delete %s %s", type, answerFile.getPath()));
      throw new IOException("File removal failed");
    }
  }
  
  public int relocateToFileSystem(WorkspaceMaterialFileFieldAnswer answer) throws IOException {
    int totalBytes = 0;
    Long userEntityId = answer.getReply().getUserEntityId();
    List<WorkspaceMaterialFileFieldAnswerFile> files = workspaceMaterialFileFieldAnswerFileDAO.listByFieldAnswer(answer);
    for (WorkspaceMaterialFileFieldAnswerFile file : files) {
      if (file.getContent() != null) {
        int bytes = file.getContent().length;
        storeFileToFileSystem(FileAnswerType.FILE, userEntityId, file.getFileId(), file.getContent());
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

  public int relocateToFileSystem(WorkspaceMaterialAudioFieldAnswer answer) throws IOException {
    int totalBytes = 0;
    Long userEntityId = answer.getReply().getUserEntityId();
    List<WorkspaceMaterialAudioFieldAnswerClip> clips = workspaceMaterialAudioFieldAnswerClipDAO.listByFieldAnswer(answer);
    for (WorkspaceMaterialAudioFieldAnswerClip clip : clips) {
      if (clip.getContent() != null) {
        int bytes = clip.getContent().length;
        storeFileToFileSystem(FileAnswerType.AUDIO, userEntityId, clip.getClipId(), clip.getContent());
        workspaceMaterialAudioFieldAnswerClipDAO.updateContent(clip,  null);
        logger.info(String.format("Relocated audio %s (%s) of user %d to file system (%d bytes)",
            clip.getClipId(),
            clip.getFileName(),
            userEntityId,
            bytes));
        totalBytes += bytes;
      }
    }
    return totalBytes;
  }

}
