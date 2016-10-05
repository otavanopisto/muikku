package fi.otavanopisto.muikku.plugins.workspace;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.material.BinaryMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/material-upload", to = "/jsf/workspace/material-upload.jsf")
public class WorkspaceMaterialUploadBackingBean extends AbstractWorkspaceBackingBean {

  @Parameter
  private String workspaceUrlName;

  @Parameter
  private Long folderId;

  @Inject
  private Logger logger;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return "/error/not-found.jsf";
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return "/error/not-found.jsf";
    }

    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceName = workspaceBackingBean.getWorkspaceName();

    return null;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public String getUploadMeta() {
    return uploadMeta;
  }

  public void setUploadMeta(String uploadMeta) {
    this.uploadMeta = uploadMeta;
  }

  public Long getFolderId() {
    return folderId;
  }

  public void setFolderId(Long folderId) {
    this.folderId = folderId;
  }

  public String upload() {
    ObjectMapper objectMapper = new ObjectMapper();

    if (!sessionController.isLoggedIn()) {
      return "/error/internal-error.jsf";
    }

    // Workspace
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return "/error/internal-error.jsf";
    }

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(
        workspaceEntity, sessionController.getLoggedUser());

    if (workspaceUserEntity == null || workspaceUserEntity.getWorkspaceUserRole() == null
        || workspaceUserEntity.getWorkspaceUserRole().getArchetype() != WorkspaceRoleArchetype.TEACHER) {

      return "/error/internal-error.jsf";
    }

    WorkspaceNode parent = null;
    if (getFolderId() != null) {
      WorkspaceFolder workspaceFolder = workspaceMaterialController.findWorkspaceFolderById(getFolderId());
      if (workspaceFolder == null) {
        return "/error/internal-error.jsf";
      }

      WorkspaceRootFolder workspaceRootFolder = workspaceMaterialController
          .findWorkspaceRootFolderByWorkspaceNode(workspaceFolder);
      if (workspaceRootFolder == null) {
        return "/error/internal-error.jsf";
      }

      if (!workspaceRootFolder.getWorkspaceEntityId().equals(workspaceEntityId)) {
        return "/error/internal-error.jsf";
      }
    } else {
      parent = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    }

    try {
      FileMeta[] fileMetas = objectMapper.readValue(getUploadMeta(), FileMeta[].class);
      for (FileMeta fileMeta : fileMetas) {
        String fileId = fileMeta.getId();
        try {
          String contentType = fileMeta.getContentType();
          String fileName = fileMeta.getName();
          byte[] fileData = TempFileUtils.getTempFileData(fileId);
          String license = null;
          
          BinaryMaterial binaryMaterial = binaryMaterialController
              .createBinaryMaterial(fileName, contentType, fileData, license);
          workspaceMaterialController.createWorkspaceMaterial(parent, binaryMaterial);
        } finally {
          TempFileUtils.deleteTempFile(fileId);
        }
      }
    } catch (IOException e) {
      logger.log(Level.SEVERE, "File uploading filed", e);
      return "/error/internal-error.jsf";
    }

    return null;
  }

  private String uploadMeta;
  private Long workspaceEntityId;
  private String workspaceName;

  @SuppressWarnings("unused")
  private static class FileMeta {

    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getContentType() {
      return contentType;
    }

    public void setContentType(String contentType) {
      this.contentType = contentType;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    private String id;
    private String contentType;
    private String name;
  }

}
