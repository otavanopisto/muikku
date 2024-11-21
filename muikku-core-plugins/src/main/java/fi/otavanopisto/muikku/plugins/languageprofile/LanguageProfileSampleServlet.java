package fi.otavanopisto.muikku.plugins.languageprofile;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSample;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSampleType;
import fi.otavanopisto.muikku.plugins.languageprofile.rest.LanguageProfileSampleRestModel;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

@MultipartConfig
@WebServlet("/languageProfileSampleServlet/*")
@Transactional
public class LanguageProfileSampleServlet extends HttpServlet {

  private static final long serialVersionUID = 7596527236598190483L;
  
  @Inject
  private LanguageProfileController languageProfileController;

  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserEntityController userEntityController;

  @Override
  protected void doHead(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    process(request, response, false);
  }

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    process(request, response, true);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    if (!sessionController.isLoggedIn()) {
      sendResponse(resp, "Must be logged in", HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    // TODO Permissions
    
    // Upload folder validation
    
    String uploadBasePath = systemSettingsController.getSetting("languageProfile.uploadBasePath");
    if (StringUtils.isEmpty(uploadBasePath)) {
      sendResponse(resp, "languageProfile.uploadBasePath not defined", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    java.io.File fileFolder = Paths.get(uploadBasePath).toFile();
    if (!fileFolder.exists() || !fileFolder.isDirectory()) {
      sendResponse(resp, String.format("languageProfile.uploadBasePath %s is not a directory", uploadBasePath), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
    
    // Language profile
    
    Part userEntityIdPart = req.getPart("userEntityId");
    if (userEntityIdPart == null) {
      sendResponse(resp, "Missing userEntityId", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    Long userEntityId = null;
    InputStream input = userEntityIdPart.getInputStream();
    try {
      userEntityId = NumberUtils.createLong(IOUtils.toString(input, StandardCharsets.UTF_8)); 
    }
    catch (Exception e) {
      sendResponse(resp, String.format("Error parsing userEntityId: %s", e.getMessage()), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    finally {
      IOUtils.closeQuietly(input);
    }
    if (userEntityId == null) {
      sendResponse(resp, "Missing userEntityId", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    LanguageProfile profile = languageProfileController.findByUserEntityId(userEntityId);
    if (profile == null) {
      sendResponse(resp, "LanguageProfile not found", HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    // Language

    Part languagePart = req.getPart("language");
    if (languagePart == null) {
      sendResponse(resp, "Missing language", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    String language = null;
    input = languagePart.getInputStream();
    try {
      language = IOUtils.toString(input, StandardCharsets.UTF_8); 
    }
    catch (Exception e) {
      sendResponse(resp, String.format("Error parsing language: %s", e.getMessage()), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    finally {
      IOUtils.closeQuietly(input);
    }
    if (StringUtils.isEmpty(language)) {
      sendResponse(resp, "Missing language", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    // Sample type

    Part typePart = req.getPart("type");
    if (typePart == null) {
      sendResponse(resp, "Missing type", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    LanguageProfileSampleType type = null;
    input = typePart.getInputStream();
    try {
      type = LanguageProfileSampleType.valueOf(IOUtils.toString(input, StandardCharsets.UTF_8)); 
    }
    catch (Exception e) {
      sendResponse(resp, String.format("Error parsing type: %s", e.getMessage()), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    finally {
      IOUtils.closeQuietly(input);
    }
    if (type == null || type == LanguageProfileSampleType.TEXT) {
      sendResponse(resp, "Missing or invalid type", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    // File name

    String fileName = null;
    Part fileNamePart = req.getPart("fileName");
    if (fileNamePart != null) {
      input = fileNamePart.getInputStream();
      try {
        fileName = IOUtils.toString(input, StandardCharsets.UTF_8); 
      }
      catch (Exception e) {
        sendResponse(resp, String.format("Error parsing file name: %s", e.getMessage()), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return;
      }
      finally {
        IOUtils.closeQuietly(input);
      }
    }

    // Student + folder
    
    UserEntity userEntity = userEntityController.findUserEntityById(profile.getUserEntityId());
    if (userEntity == null) {
      sendResponse(resp, "UserEntity not found", HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    java.io.File userFolder = Paths.get(fileFolder.getPath(), userEntity.getId().toString()).toFile();
    if (!userFolder.exists()) {
      if (!userFolder.mkdir()) {
        sendResponse(resp, String.format("Failed to create user folder %s", userFolder.getPath()), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      }
    }
    
    // Binary

    Part filePart = req.getPart("file");
    if (filePart == null) {
      sendResponse(resp, "Missing file", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    long fileSizeLimit = systemSettingsController.getUploadFileSizeLimit();
    if (filePart.getSize() > fileSizeLimit) {
      sendResponse(resp, "File too large", HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
      return;
    }
    String contentType = filePart.getContentType();
    input = filePart.getInputStream();
    try {
      String fileUuid = UUID.randomUUID().toString();
      if (StringUtils.isEmpty(fileName)) {
        fileName = fileUuid;
      }
      java.io.File sampleFile = Paths.get(userFolder.getPath(), fileUuid).toFile();
      if (sampleFile.exists()) {
        throw new IOException(String.format("File %s already exists", sampleFile.getPath()));
      }
      FileUtils.copyInputStreamToFile(input, sampleFile);
      if (StringUtils.isEmpty(contentType)) {
        contentType = Files.probeContentType(sampleFile.toPath());
      }
      
      LanguageProfileSample sample = languageProfileController.createSample(profile, language, type, fileUuid, fileName, contentType);
      LanguageProfileSampleRestModel model = new LanguageProfileSampleRestModel();
      model.setFileName(sample.getFileName());
      model.setId(sample.getId());
      model.setLanguage(sample.getLanguage());
      model.setLastModified(sample.getLastModified());
      model.setType(sample.getType());
      model.setValue(sample.getValue());
      String result = (new ObjectMapper()).writeValueAsString(model);
      sendResponse(resp, result, HttpServletResponse.SC_OK);
    }
    catch (Exception e) {
      sendResponse(resp, String.format("Error parsing file: %s", e.getMessage()), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    finally {
      IOUtils.closeQuietly(input);
    }
  }

  private void sendResponse(HttpServletResponse resp, String message, int status) throws IOException {
    resp.setStatus(status);
    PrintWriter writer = resp.getWriter();
    writer.write(message);
    writer.flush();
  }
  
  private void process(HttpServletRequest request, HttpServletResponse response, boolean serveContent)
      throws ServletException, IOException {
    
    if (!sessionController.isLoggedIn()) {
      response.sendError(HttpServletResponse.SC_FORBIDDEN);
      return;
    }
    
    // TODO Permissions

    String basePath = systemSettingsController.getSetting("languageProfile.uploadBasePath");
    if (StringUtils.isEmpty(basePath)) {
      sendResponse(response, "languageProfile.uploadBasePath not defined", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    Long sampleId = Long.valueOf(request.getParameter("sampleId"));
    LanguageProfileSample sample = languageProfileController.findSampleById(sampleId);
    if (sample == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    if (sample.getType() == LanguageProfileSampleType.TEXT) {
      response.setContentType(sample.getContentType());
      try {
        response.getOutputStream().write(sample.getValue().getBytes("UTF-8"));
      }
      finally {
        response.getOutputStream().flush();
      }
      return;
    }
    java.io.File sampleFile = Paths.get(basePath, sample.getLanguageProfile().getUserEntityId().toString(), sample.getFileId()).toFile();
    if (!sampleFile.exists()) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    byte[] content = Files.readAllBytes(sampleFile.toPath());
    String eTag = DigestUtils.md5Hex(sample.getId() + ':' + sample.getLastModified().toString());
    response.setHeader("ETag", eTag);
    String ifNoneMatch = request.getHeader("If-None-Match");
    if (!StringUtils.equals(ifNoneMatch, eTag)) {
      response.setStatus(HttpServletResponse.SC_OK);

      // Byte range support

      List<Range> ranges = new ArrayList<Range>();
      String range = request.getHeader("Range");
      if (range != null) {
        if (!range.matches("^bytes=\\d*-\\d*(,\\d*-\\d*)*$")) {
          response.setHeader("Content-Range", "bytes */" + content.length);
          response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
          return;
        }
        for (String part : range.substring(6).split(",")) {
          String startStr = StringUtils.substringBefore(part, "-");
          String endStr = StringUtils.substringAfter(part, "-");
          int start = NumberUtils.isDigits(startStr) ? NumberUtils.toInt(startStr) : -1;
          int end = NumberUtils.isDigits(endStr) ? NumberUtils.toInt(endStr) : -1;
          if (start == -1) {
            start = content.length - end;
            end = content.length - 1;
          }
          else if (end == -1 || end > content.length - 1) {
            end = content.length - 1;
          }
          if (start > end) {
            response.setHeader("Content-Range", "bytes */" + content.length);
            response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
            return;
          }
          ranges.add(new Range(start, end, content.length));
        }
      }

      response.setHeader("Accept-Ranges", "bytes");
      response.setContentType(sample.getContentType());
      response.setHeader("Content-Disposition", "attachment; filename=" + sample.getFileName());

      try {
        if (ranges.isEmpty()) {
          // Entire file
          if (serveContent) {
            response.setHeader("Content-Length", String.valueOf(content.length));
            response.getOutputStream().write(content);
          }
        }
        else if (ranges.size() == 1) {
          // Single byte range
          Range r = ranges.get(0);
          response.setHeader("Content-Range", String.format("bytes %d-%d/%d", r.start, r.end, r.total));
          response.setHeader("Content-Length", String.valueOf(r.length));
          response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
          if (serveContent) {
            response.getOutputStream().write(content, r.start, r.length);
          }
        }
        else {
          // Multiple byte ranges
          response.setContentType("multipart/byteranges; boundary=MULTIPART_BYTERANGES");
          response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
          if (serveContent) {
            for (Range r : ranges) {
              response.getOutputStream().println();
              response.getOutputStream().println("--MULTIPART_BYTERANGES");
              response.getOutputStream().println(String.format("Content-Type: %s", sample.getContentType()));
              response.getOutputStream().println(String.format("Content-Range: bytes %d-%d/%d", r.start, r.end, r.total));
              response.getOutputStream().write(content, r.start, r.length);
            }
            response.getOutputStream().println();
            response.getOutputStream().println("--MULTIPART_BYTERANGES--");
          }
        }
      }
      finally {
        response.getOutputStream().flush();
      }
    }
    else {
      response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
    }
  }

  protected class Range {
    public Range(int start, int end, int total) {
      this.start = start;
      this.end = end;
      this.length = end - start + 1;
      this.total = total;
    }
    int start;
    int end;
    int length;
    int total;
  }

}
