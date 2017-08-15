package fi.otavanopisto.muikku.plugins.data;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;

public class FileController {

  private static final Pattern UUID_PATTERN = Pattern.compile(
      "^" + 
          "[0-9a-f]{8}-" +
          "[0-9a-f]{4}-" +
          "[0-9a-f]{4}-" +
          "[0-9a-f]{4}-" +
          "[0-9a-f]{12}" +
      "$");
  
  @Inject
  private SystemSettingsController settingsController;
  
  /**
   * Creates a file with specified content to file system. The path is defined
   * by system setting and module combination.
   * 
   * Returns the created file name.
   * 
   * @param module module/directory to save the file under
   * @param content file content
   * @return name of the created file
   * @throws IOException if I/O exception occurs while creating the file.
   */
  public String createFile(String module, InputStream content) throws IOException {
    String fileUuid = UUID.randomUUID().toString();
    
    return updateFile(module, fileUuid, content);
  }
  
  /**
   * Updates a file with specified content. The path is defined
   * by system setting, module and file name combination.
   * 
   * Returns the file name.
   * 
   * @param module module/directory to save the file under
   * @param uuid file name
   * @param content file content
   * @return name of the created file
   * @throws IOException if I/O exception occurs while creating the file.
   */
  public String updateFile(String module, String uuid, InputStream content) throws IOException {
    File file = Paths.get(getFilePath(module), uuid).toFile();
    try {
      FileUtils.copyInputStreamToFile(content, file);
      
      return uuid;
    } catch (IOException ex) {
      file.delete();
      throw ex;
    }
  }

  /**
   * Writes file contents to stream.
   * 
   * @param module module where the file is stored
   * @param uuid file name
   * @param stream output stream
   */
  public void outputFileToStream(String module, String uuid, OutputStream stream) {
    if (!UUID_PATTERN.matcher(uuid).matches()) {
      throw new RuntimeException("File name is not a valid UUID");
    }
    
    File file = Paths.get(getFilePath(module), uuid).toFile();
    try {
      FileUtils.copyFile(file, stream);
    } catch (IOException e) {
      // Wrap with unchecked exception to adhere to StreamingOutput interface
      throw new RuntimeException(e);
    }
  }

  private String getFilePath(String module) {
    String basePath = settingsController.getSetting("fileStoragePath");
    if (StringUtils.isBlank(basePath)) {
      throw new RuntimeException("FileController - no base path is set");
    }
    
    if (StringUtils.endsWith(basePath, "/"))
      basePath += module + "/";
    else
      basePath += "/" + module + "/";
    
    return basePath;
  }

}
