package fi.otavanopisto.muikku.plugins.workspace;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;

@WebServlet(urlPatterns = "/workspaceBinaryMaterialsServlet/*")
public class WorkspaceBinaryMaterialServlet extends HttpServlet {

  private static final long serialVersionUID = -1646354401770429428L;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceController workspaceController;

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
    String workspaceUrl = request.getParameter("workspaceUrlName");
    String materialPath = request.getParameter("workspaceMaterialUrlName");

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrl);
    if (workspaceEntity == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, materialPath);
    if (workspaceMaterial == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    Material material = workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);

    int materialSize = material instanceof BinaryMaterial ? ((BinaryMaterial) material).getContent().length : material instanceof HtmlMaterial ? ((HtmlMaterial) material).getHtml().length() : 0;
    String eTag = DigestUtils.md5Hex(material.getTitle() + ':' + material.getId() + ':' + materialSize + ':' + material.getVersion());

    response.setHeader("ETag", eTag);
    String ifNoneMatch = request.getHeader("If-None-Match");
    if (!StringUtils.equals(ifNoneMatch, eTag)) {
      response.setStatus(HttpServletResponse.SC_OK);
      if (material instanceof BinaryMaterial) {
        BinaryMaterial binaryMaterial = (BinaryMaterial) material;
        byte[] data = binaryMaterial.getContent();
        
        // Byte range support
        
        Range full = new Range(0, data.length - 1, data.length);
        List<Range> ranges = new ArrayList<Range>();
        String range = request.getHeader("Range");
        if (range != null) {
          if (!range.matches("^bytes=\\d*-\\d*(,\\d*-\\d*)*$")) {
            response.setHeader("Content-Range", "bytes */" + data.length);
            response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
            return;
          }
          if (ranges.isEmpty()) {
            for (String part : range.substring(6).split(",")) {
              int start = NumberUtils.toInt(StringUtils.substringBefore(part, "-"));
              int end = NumberUtils.toInt(StringUtils.substringAfter(part, "-"));
              if (start == -1) {
                start = data.length - end;
                end = data.length - 1;
              }
              else if (end == -1 || end > data.length - 1) {
                end = data.length - 1;
              }
              if (start > end) {
                response.setHeader("Content-Range", "bytes */" + data.length);
                response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
                return;
              }
              ranges.add(new Range(start, end, data.length));
            }
          }
        }

        response.setHeader("Accept-Ranges", "bytes");
        response.setContentType(binaryMaterial.getContentType());

        try {
          if (ranges.isEmpty() || ranges.get(0) == full) {
            // Entire file
            Range r = full;
            if (serveContent) {
              response.setHeader("Content-Length", String.valueOf(r.length));
              response.getOutputStream().write(data, r.start, r.length);
            }
          }
          else if (ranges.size() == 1) {
            // Single byte range
            Range r = ranges.get(0);
            response.setHeader("Content-Range", String.format("bytes %d-%d/%d", r.start, r.end, r.total));
            response.setHeader("Content-Length", String.valueOf(r.length));
            response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
            if (serveContent) {
              response.getOutputStream().write(data, r.start, r.length);
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
                response.getOutputStream().println(String.format("Content-Type: %s", binaryMaterial.getContentType()));
                response.getOutputStream().println(String.format("Content-Range: bytes %d-%d/%d", r.start, r.end, r.total));
                response.getOutputStream().write(data, r.start, r.length);
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
      else if (material instanceof HtmlMaterial) {
        HtmlMaterial htmlMaterial = (HtmlMaterial) material;
        byte[] data = htmlMaterial.getHtml().getBytes("UTF-8");
        response.setContentLength(data.length);
        response.setContentType("text/html; charset=UTF-8");
        try {
          response.getOutputStream().write(data);
        }
        finally {
          response.getOutputStream().flush();
        }
      }
    } else {
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
