package fi.otavanopisto.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.FileAnswerType;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.FileAnswerUtils;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Transactional
@WebServlet(urlPatterns = "/workspaceAudioAnswerServlet/*")
public class WorkspaceAudioAnswerServlet extends HttpServlet {

  private static final long serialVersionUID = 5462686877426084296L;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Inject
  private FileAnswerUtils fileAnswerUtils;

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
    WorkspaceMaterialAudioFieldAnswerClip answerClip = workspaceMaterialFieldAnswerController.findWorkspaceMaterialAudioFieldAnswerClipByClipId(clipId);
    if (answerClip == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply workspaceMaterialReply = answerClip.getFieldAnswer().getReply();
    WorkspaceMaterial workspaceMaterial = workspaceMaterialReply.getWorkspaceMaterial();
    if (workspaceMaterial == null) {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }

    WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (workspaceRootFolder == null) {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceRootFolder.getWorkspaceEntityId());
    if (workspaceEntity == null) {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }
    
    if (!workspaceMaterialReply.getUserEntityId().equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_STUDENT_ANSWERS, workspaceEntity)) {
        response.sendError(HttpServletResponse.SC_FORBIDDEN);
        return;
      }
    }
    
    byte[] content = answerClip.getContent();
    if (content == null) {
      Long userEntityId = workspaceMaterialReply.getUserEntityId();
      try {
        if (fileAnswerUtils.isFileInFileSystem(FileAnswerType.AUDIO, userEntityId, answerClip.getClipId())) {
          content = fileAnswerUtils.getFileContent(FileAnswerType.AUDIO, workspaceMaterialReply.getUserEntityId(), answerClip.getClipId());
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
    String eTag = DigestUtils.md5Hex(answerClip.getClipId() + ':' + answerClip.getId() + ':' + size);
    
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
      response.setContentType(answerClip.getContentType());
      response.setHeader("Content-Disposition", "attachment; filename=" + answerClip.getFileName());

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
              response.getOutputStream().println(String.format("Content-Type: %s", answerClip.getContentType()));
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
