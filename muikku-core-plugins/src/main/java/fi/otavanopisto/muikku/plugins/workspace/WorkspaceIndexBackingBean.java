package fi.otavanopisto.muikku.plugins.workspace;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceEntityFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/workspace/{workspaceUrlName}", to = "/jsf/workspace/workspace.jsf")
public class WorkspaceIndexBackingBean extends AbstractWorkspaceBackingBean {

  @Parameter
  private String workspaceUrlName;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private WorkspaceBackingBean workspaceBackingBean;

  @Inject
  private WorkspaceVisitController workspaceVisitController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;

  @Inject
  private Logger logger;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);

    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }

    canPublish = sessionController.hasWorkspacePermission(MuikkuPermissions.PUBLISH_WORKSPACE, workspaceEntity);
    workspaceEntityId = workspaceEntity.getId();
    published = workspaceEntity.getPublished();
    
    if (!published) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_UNPUBLISHED_WORKSPACE, workspaceEntity)) {
    	  return NavigationRules.NOT_FOUND;
      }
    }

    try {
      WorkspaceMaterial frontPage = workspaceMaterialController.ensureWorkspaceFrontPageExists(workspaceEntity);
      contentNodes = Arrays.asList(workspaceMaterialController.createContentNode(frontPage, null));
    }
    catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Error loading materials", e);
      return NavigationRules.INTERNAL_ERROR;
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);

    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.warning(String.format("Could not find workspace for workspaceEntity #%d", workspaceEntity.getId()));
        return NavigationRules.NOT_FOUND;
      }
      
      WorkspaceType workspaceType = workspaceController.findWorkspaceType(workspace.getWorkspaceTypeId()); 
      EducationType educationTypeObject = workspace.getEducationTypeIdentifier() == null ? null : courseMetaController.findEducationType(workspace.getEducationTypeIdentifier());
      
      workspaceId = workspaceEntity.getId();
      workspaceName = workspace.getName();
      workspaceNameExtension = workspace.getNameExtension();
      educationType = educationTypeObject != null ? educationTypeObject.getName() : null;
      
      beginDate = workspace.getBeginDate() != null ? Date.from(workspace.getBeginDate().toInstant()) : null;
      endDate = workspace.getEndDate() != null ? Date.from(workspace.getEndDate().toInstant()) : null;
      
      if (workspaceType != null) {
        this.workspaceType = workspaceType.getName();
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    WorkspaceEntityFile customFrontImage = workspaceEntityFileController.findWorkspaceEntityFile(workspaceEntity, "workspace-frontpage-image-cropped");
    hasCustomFrontPageImage = customFrontImage != null;
    customFrontPageImageUrl = hasCustomFrontPageImage ? 
        String.format("/rest/workspace/workspaces/%d/workspacefile/workspace-frontpage-image-cropped", workspaceEntity.getId()) : 
        null;
    
    materialsBaseUrl = String.format("/workspace/%s/materials", workspaceUrlName);
    announcementsBaseUrl = String.format("/workspace/%s/announcements", workspaceUrlName);
    workspaceVisitController.visit(workspaceEntity);
    
    return null;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
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
  
  public String getContents() {
    return contents;
  }

  public long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(long materialId) {
    this.materialId = materialId;
  }

  public String getMaterialType() {
    return materialType;
  }

  public void setMaterialType(String materialType) {
    this.materialType = materialType;
  }

  public String getMaterialTitle() {
    return materialTitle;
  }

  public void setMaterialTitle(String materialTitle) {
    this.materialTitle = materialTitle;
  }

  public long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public String getWorkspaceType() {
    return workspaceType;
  }
  
  public String getEducationType() {
    return educationType;
  }
  
  public Boolean getPublished() {
    return published;
  }
  
  public Boolean getCanPublish() {
    return canPublish;
  }
  
  public Date getBeginDate() {
    return beginDate;
  }
  
  public Date getEndDate() {
    return endDate;
  }
  
  public Date getSignupStart() {
    return signupStart;
  }

  public void setSignupStart(Date signupStart) {
    this.signupStart = signupStart;
  }

  public Date getSignupEnd() {
    return signupEnd;
  }

  public void setSignupEnd(Date signupEnd) {
    this.signupEnd = signupEnd;
  }
  
  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }

  public String getMaterialsBaseUrl() {
    return materialsBaseUrl;
  }

  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }

  public void setWorkspaceNameExtension(String workspaceNameExtension) {
    this.workspaceNameExtension = workspaceNameExtension;
  }

  public String getAnnouncementsBaseUrl() {
    return announcementsBaseUrl;
  }

  public void setAnnouncementsBaseUrl(String announcementsBaseUrl) {
    this.announcementsBaseUrl = announcementsBaseUrl;
  }

  public String getCustomFrontPageImageUrl() {
    return customFrontPageImageUrl;
  }

  public boolean getHasCustomFrontPageImage() {
    return hasCustomFrontPageImage;
  }

  private Long workspaceId;
  private String workspaceName;
  private String workspaceNameExtension;
  private Long workspaceEntityId;
  private String contents;
  private long workspaceMaterialId;
  private long materialId;
  private String materialType;
  private String materialTitle;
  private String workspaceType;
  private String educationType;
  private Boolean published;
  private Boolean canPublish;
  private Date beginDate;
  private Date endDate;
  private Date signupStart;
  private Date signupEnd;
  private List<ContentNode> contentNodes;
  private String materialsBaseUrl;
  private String announcementsBaseUrl;
  private String customFrontPageImageUrl;
  private boolean hasCustomFrontPageImage;
}
