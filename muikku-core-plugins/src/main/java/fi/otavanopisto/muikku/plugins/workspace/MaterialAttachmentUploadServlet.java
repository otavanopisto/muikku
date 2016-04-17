package fi.otavanopisto.muikku.plugins.workspace;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

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
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.material.BinaryMaterialController;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@MultipartConfig
@WebServlet("/materialAttachmentUploadServlet/*")
@Transactional
public class MaterialAttachmentUploadServlet extends HttpServlet {

  private static final long serialVersionUID = 4661251499908326136L;

  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private BinaryMaterialController binaryMaterialController;
  
  @Inject
  private SessionController sessionController;

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String materialUrl = req.getPathInfo();
    if (StringUtils.isBlank(materialUrl)) {
      sendResponse(resp, "Missing material path", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    if (!sessionController.isLoggedIn()) {
      sendResponse(resp, "Unauthorized", HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }
    
    Part file = req.getPart("upload");
    if (file == null) {
      sendResponse(resp, "Missing file", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    long fileSizeLimit = systemSettingsController.getUploadFileSizeLimit();
    if (file.getSize() > fileSizeLimit) {
      sendResponse(resp, "File too large", HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
      return;
    }
    
    WorkspaceMaterial parentWorkspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByRootPath(materialUrl);
    if (parentWorkspaceMaterial == null) {
      sendResponse(resp, "Material not found", HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(parentWorkspaceMaterial);
    if (workspaceRootFolder == null) {
      sendResponse(resp, "Workspace root folder not found", HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceRootFolder.getWorkspaceEntityId());
    if (workspaceEntity == null) {
      sendResponse(resp, "Workspace entity not found", HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity)) {
      sendResponse(resp, "Forbidden", HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    HtmlMaterial parentMaterial = htmlMaterialController.findHtmlMaterialById(parentWorkspaceMaterial.getMaterialId());
    if (parentMaterial == null) {
      sendResponse(resp, "Parent material is not html material", HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    BinaryMaterial uploadedMaterial = binaryMaterialController.createBinaryMaterial(file.getSubmittedFileName(), 
        file.getContentType(), 
        IOUtils.toByteArray(file.getInputStream()));
    
    String uploadedUrl = null;
    
    List<WorkspaceMaterial> parentWorkspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(parentMaterial);
    for (WorkspaceMaterial sharedWorkspaceMaterial : parentWorkspaceMaterials) {
      WorkspaceMaterial uploadedWorkspaceMaterial = workspaceMaterialController.createWorkspaceMaterial(sharedWorkspaceMaterial, uploadedMaterial);
      if (sharedWorkspaceMaterial.getId().equals(parentWorkspaceMaterial.getId())) {
        uploadedUrl = uploadedWorkspaceMaterial.getUrlName();
      }
    }
    
    if (StringUtils.isBlank(uploadedUrl)) {
      sendResponse(resp, "Could not resolve uploaded file url", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      return;
    }

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
