package fi.muikku.plugins.workspace;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;

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
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // TODO: Security
    // TODO: Cache

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

    if (material instanceof BinaryMaterial) {
      BinaryMaterial binaryMaterial = (BinaryMaterial) material;

      response.setContentType(binaryMaterial.getContentType());
      ServletOutputStream outputStream = response.getOutputStream();
      try {
        outputStream.write(binaryMaterial.getContent());
      } finally {
        outputStream.flush();
      }
    } else if (material instanceof HtmlMaterial) {
      HtmlMaterial htmlMaterial = (HtmlMaterial) material;

      response.setContentType("text/html; charset=UTF-8");
      ServletOutputStream outputStream = response.getOutputStream();
      try {
        outputStream.write(htmlMaterial.getHtml().getBytes("UTF-8"));
      } finally {
        outputStream.flush();
      }
    }
  }

}
