package fi.otavanopisto.muikku.plugins.announcer;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
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
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementAttachment;
import fi.otavanopisto.muikku.servlet.BaseUrl;
import fi.otavanopisto.muikku.session.SessionController;

@MultipartConfig
@WebServlet("/announcerAttachmentUploadServlet")
@Transactional
public class AnnouncerAttachmentUploadServlet extends HttpServlet {

  private static final long serialVersionUID = 2018253945748278665L;

  @Inject
  @BaseUrl
  private String baseUrl;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private AnnouncementController announcementController;
  
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    
    if (!sessionController.isLoggedIn()) {
      sendResponse(resp, "Unauthorized", HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }
    
    Part file = req.getPart("upload");
    
    if (file == null) {
      sendResponse(resp, "Missing file", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    if (!file.getContentType().startsWith("image")) {
      sendResponse(resp, "Content type is not supported", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    long fileSizeLimit = systemSettingsController.getUploadFileSizeLimit();
    
    if (file.getSize() > fileSizeLimit) {
      sendResponse(resp, "File too large", HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
      return;
    }
    
    byte[] content = null;
    InputStream input = file.getInputStream();
    try {
      content = IOUtils.toByteArray(input);
    }
    finally {
      IOUtils.closeQuietly(input);
    }
    AnnouncementAttachment announcementAttachment = announcementController.createAttachement(
        file.getContentType(),
        content);
    
    if (announcementAttachment == null) {
      sendResponse(resp, "Could not save attachment", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    
    String uploadedUrl = String.format("%s/rest/announcer/attachment/%s", baseUrl, announcementAttachment.getName());
    
    UploadMeta uploadMeta = new UploadMeta(file.getName(), 1, uploadedUrl);

    resp.setContentType("application/json");
    ServletOutputStream servletOutputStream = resp.getOutputStream();
    try {
      (new ObjectMapper()).writeValue(servletOutputStream, uploadMeta);
    } finally {
      servletOutputStream.flush();
    }
  }
  
  private void sendResponse(HttpServletResponse resp, String message, int status) throws IOException {
    resp.setStatus(status);
    PrintWriter writer = resp.getWriter();
    writer.write(message);
    writer.flush();
  }
  
  public class UploadMeta {
    
    public UploadMeta(String fileName, long uploaded, String url) {
      super();
      this.fileName = fileName;
      this.uploaded = uploaded;
      this.url = url;
    }
    
    public String getFileName() {
      return fileName;
    }
    
    public long getUploaded() {
      return uploaded;
    }
    
    public String getUrl() {
      return url;
    }
    
    private String fileName;
    private long uploaded;
    private String url;
  } 
}
