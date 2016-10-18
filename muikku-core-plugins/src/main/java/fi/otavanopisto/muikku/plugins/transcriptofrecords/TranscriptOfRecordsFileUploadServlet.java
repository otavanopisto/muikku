package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.transaction.Transactional;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

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

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    if (!sessionController.isLoggedIn()) {
      sendResponse(resp, "Must be logged in", HttpServletResponse.SC_FORBIDDEN);
      return;
    }
    
    if (!sessionController.hasEnvironmentPermission(TranscriptofRecordsPermissions.TRANSCRIPT_OF_RECORDS_FILE_UPLOAD)) {
      sendResponse(resp, "Insufficient permissions", HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    String userEntityIdString = req.getPathInfo().replaceFirst("/", "");
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
    
    Part titlePart = req.getPart("title");
    if (titlePart == null) {
      sendResponse(resp, "Missing title", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    String title = "";
    try (InputStream is = titlePart.getInputStream()) {
      title = IOUtils.toString(is, StandardCharsets.UTF_8);
    }

    Part descriptionPart = req.getPart("description");
    if (descriptionPart == null) {
      sendResponse(resp, "Missing description", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    String description = "";
    try (InputStream is = descriptionPart.getInputStream()) {
      description = IOUtils.toString(is, StandardCharsets.UTF_8);
    }
    
    Part uploadPart = req.getPart("upload");
    if (uploadPart == null) {
      sendResponse(resp, "Missing file", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    String contentType = uploadPart.getContentType();

    long fileSizeLimit = systemSettingsController.getUploadFileSizeLimit();
    if (uploadPart.getSize() > fileSizeLimit) {
      sendResponse(resp, "File too large", HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
      return;
    }
    
    try (InputStream is = uploadPart.getInputStream()){
      transcriptOfRecordsFileController.attachFile(
          userEntity,
          is,
          contentType,
          title,
          description);
      sendResponse(resp, "File uploaded", HttpServletResponse.SC_OK);
    }
  }

  private void sendResponse(HttpServletResponse resp, String message, int status) throws IOException {
    resp.setStatus(status);
    PrintWriter writer = resp.getWriter();
    writer.write(message);
    writer.flush();
  }
}
