package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Paths;
import java.util.UUID;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.transaction.Transactional;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

@MultipartConfig
@WebServlet("/transcriptofrecordsfileupload/*")
@Transactional
public class TranscriptOfRecordsFileUploadServlet extends HttpServlet {

  private static final long serialVersionUID = 4661251499908326136L;

  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;
  
  public static class NoUploadBasePathSetException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public NoUploadBasePathSetException() {
      super("No upload base path set");
    }
  }
  
  private String getFileUploadBasePath() {
    String basePath = pluginSettingsController.getPluginSetting("transcriptofrecords", "fileUploadBasePath");
    if (basePath == null) {
      throw new NoUploadBasePathSetException();
    }
    
    return basePath;
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String fileUuid = UUID.randomUUID().toString();
    File file = Paths.get(getFileUploadBasePath(), fileUuid).toFile();
    
    if (!sessionController.isLoggedIn()) {
      sendResponse(resp, "Unauthorized", HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }

    String userEntityIdString = req.getPathInfo();
    if (StringUtils.isBlank(userEntityIdString) || !StringUtils.isNumeric(userEntityIdString)) {
      sendResponse(resp, "Invalid user entity id", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    long userEntityId = Long.parseLong(userEntityIdString, 10);
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      sendResponse(resp, "User entity not found", HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    Part part = req.getPart("upload");
    if (part == null) {
      sendResponse(resp, "Missing file", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    long fileSizeLimit = systemSettingsController.getUploadFileSizeLimit();
    if (part.getSize() > fileSizeLimit) {
      sendResponse(resp, "File too large", HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
      return;
    }
    
    FileUtils.copyInputStreamToFile(part.getInputStream(), file);
    
    try {
      transcriptOfRecordsFileController.attachFile(userEntity, file, "title", "description");
      return;
    } catch (Exception ex) {
      file.delete();
    }
  }

  private void sendResponse(HttpServletResponse resp, String message, int status) throws IOException {
    resp.setStatus(status);
    PrintWriter writer = resp.getWriter();
    writer.write(message);
    writer.flush();
  }
}
