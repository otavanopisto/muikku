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

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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

    Part userIdentifierPart = req.getPart("userIdentifier");
    if (userIdentifierPart == null) {
      sendResponse(resp, "Missing userIdentifier", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    String userIdentifier = "";
    try (InputStream is = userIdentifierPart.getInputStream()) {
      userIdentifier = IOUtils.toString(is, StandardCharsets.UTF_8);
    }

    SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(userIdentifier);
    if (schoolDataIdentifier == null) {
      sendResponse(resp, "Invalid userIdentifier", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(schoolDataIdentifier);
    if (userEntity == null) {
      sendResponse(resp, "User entity not found", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
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
      TranscriptOfRecordsFile file = transcriptOfRecordsFileController.attachFile(
          userEntity,
          is,
          contentType,
          title,
          description);
      String result = (new ObjectMapper()).writeValueAsString(file);
      sendResponse(resp, result, HttpServletResponse.SC_OK);
    }
  }

  private void sendResponse(HttpServletResponse resp, String message, int status) throws IOException {
    resp.setStatus(status);
    PrintWriter writer = resp.getWriter();
    writer.write(message);
    writer.flush();
  }
}
