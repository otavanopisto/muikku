package fi.otavanopisto.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationFileStorageUtils;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequestAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@WebServlet(urlPatterns = "/workspaceMaterialAudioEvaluationServlet/*")
public class WorkspaceMaterialAudioEvaluationServlet extends HttpServlet {
  
  private static final long serialVersionUID = -5852968845384722139L;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private EvaluationFileStorageUtils evaluationFileStorageUtils;
  
  @Override
  public void init() throws ServletException {
    super.init();
  }

  @Override
  protected void doHead(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    process(request, response, false);
  }

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    process(request, response, true);
  }

  private void process(HttpServletRequest request, HttpServletResponse response, boolean serveContent)
      throws ServletException, IOException {
    
    if (!sessionController.isLoggedIn()) {
      response.sendError(HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    String clipId = request.getParameter("clipId");

    AudioClip audioClip = getClip(clipId);
    if (audioClip == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    if (audioClip.getWorkspaceEntity() == null) {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    
    if (!sessionController.getLoggedUserEntity().getId().equals(audioClip.getStudentEntityId())) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_STUDENT_ANSWERS, audioClip.getWorkspaceEntity())) {
        response.sendError(HttpServletResponse.SC_FORBIDDEN);
        return;
      }
    }
    
    byte[] content = null;
    if (content == null) {
      Long userEntityId = audioClip.getStudentEntityId();
      try {
        if (evaluationFileStorageUtils.isFileInFileSystem(userEntityId, audioClip.getClipId())) {
          content = evaluationFileStorageUtils.getFileContent(userEntityId, audioClip.getClipId());
        }
        else {
          logger.warning(String.format("Audio %s of user %d not found from file storage", audioClip.getClipId(), userEntityId));
        }
      }
      catch (FileNotFoundException fnfe) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
      }
      catch (IOException e) {
        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return;
      }
    }
    if (content == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    int size = content.length;
    String eTag = DigestUtils.md5Hex(audioClip.getClipId() + ':' + audioClip.getId() + ':' + size);
    
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
      response.setContentType(audioClip.getContentType());
      response.setHeader("Content-Disposition", "attachment; filename=" + audioClip.getFileName());

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
              response.getOutputStream().println(String.format("Content-Type: %s", audioClip.getContentType()));
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

  private AudioClip getClip(String clipId) {
    WorkspaceMaterialEvaluationAudioClip evaluationAudioClip = evaluationController.findEvaluationAudioClip(clipId);
    if (evaluationAudioClip != null) {
      Long studentEntityId = evaluationAudioClip.getEvaluation().getStudentEntityId();
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(evaluationAudioClip.getEvaluation().getWorkspaceMaterialId());
      WorkspaceRootFolder workspaceRootFolder = workspaceMaterial != null ? workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial) : null;
      WorkspaceEntity workspaceEntity = workspaceRootFolder != null ? workspaceEntityController.findWorkspaceEntityById(workspaceRootFolder.getWorkspaceEntityId()) : null;
      return new AudioClip(
          studentEntityId, 
          workspaceEntity, 
          evaluationAudioClip.getId(), 
          evaluationAudioClip.getClipId(), 
          evaluationAudioClip.getFileName(), 
          evaluationAudioClip.getContentType());
    } else {
      SupplementationRequestAudioClip supplementationAudioClip = evaluationController.findSupplementationAudioClip(clipId);
      if (supplementationAudioClip != null) {
        Long studentEntityId = supplementationAudioClip.getSupplementationRequest().getStudentEntityId();
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(supplementationAudioClip.getSupplementationRequest().getWorkspaceMaterialId());
        WorkspaceRootFolder workspaceRootFolder = workspaceMaterial != null ? workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial) : null;
        WorkspaceEntity workspaceEntity = workspaceRootFolder != null ? workspaceEntityController.findWorkspaceEntityById(workspaceRootFolder.getWorkspaceEntityId()) : null;
        return new AudioClip(
            studentEntityId, 
            workspaceEntity, 
            supplementationAudioClip.getId(), 
            supplementationAudioClip.getClipId(), 
            supplementationAudioClip.getFileName(), 
            supplementationAudioClip.getContentType());
      }
    }
    
    // Not found
    return null;
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

  private class AudioClip {
    public AudioClip(Long studentEntityId, WorkspaceEntity workspaceEntity, Long id, String clipId, String fileName, String contentType) {
      this.id = id;
      this.fileName = fileName;
      this.contentType = contentType;
      this.clipId = clipId;
      this.studentEntityId = studentEntityId;
      this.workspaceEntity = workspaceEntity;
    }
    
    public String getContentType() {
      return contentType;
    }

    public String getClipId() {
      return clipId;
    }

    public Long getStudentEntityId() {
      return studentEntityId;
    }

    public WorkspaceEntity getWorkspaceEntity() {
      return workspaceEntity;
    }

    public String getFileName() {
      return fileName;
    }

    public Long getId() {
      return id;
    }

    private final Long id;
    private final String fileName;
    private final String contentType;
    private final String clipId;
    private final Long studentEntityId;
    private final WorkspaceEntity workspaceEntity;
  }
}
