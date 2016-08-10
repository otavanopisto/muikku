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
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}", to = "/jsf/workspace/workspace.jsf")
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
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @Inject
  private WorkspaceVisitController workspaceVisitController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
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

    canPublish = sessionController.hasCoursePermission(MuikkuPermissions.PUBLISH_WORKSPACE, workspaceEntity);
    workspaceEntityId = workspaceEntity.getId();
    published = workspaceEntity.getPublished();
    
    if (!published) {
      if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_UNPUBLISHED_WORKSPACE, workspaceEntity)) {
    	  return NavigationRules.NOT_FOUND;
      }
    }

    try {
      WorkspaceMaterial frontPage = workspaceMaterialController.ensureWorkspaceFrontPageExists(workspaceEntity);
      contentNodes = Arrays.asList(workspaceMaterialController.createContentNode(frontPage));
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
      Subject subjectObject = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier());
      CourseLengthUnit lengthUnit = null;
      if ((workspace.getLength() != null) && (workspace.getLengthUnitIdentifier() != null)) {
        lengthUnit = courseMetaController.findCourseLengthUnit(workspace.getSchoolDataSource(), workspace.getLengthUnitIdentifier());
      }
      
      workspaceId = workspaceEntity.getId();
      workspaceName = workspace.getName();
      workspaceNameExtension = workspace.getNameExtension();
      subject = subjectObject != null ? subjectObject.getName() : null;
      educationType = educationTypeObject != null ? educationTypeObject.getName() : null;
      
      if (lengthUnit != null) {
        courseLength = workspace.getLength();
        courseLengthSymbol = lengthUnit.getSymbol();
      }
      
      beginDate = workspace.getBeginDate() != null ? workspace.getBeginDate().toDate() : null;
      endDate = workspace.getEndDate() != null ? workspace.getEndDate().toDate() : null;
      
      if (workspaceType != null) {
        this.workspaceType = workspaceType.getName();
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
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
  
  public String getSubject() {
    return subject;
  }
  
  public String getEducationType() {
    return educationType;
  }
  
  public Double getCourseLength() {
    return courseLength;
  }
  
  public String getCourseLengthSymbol() {
    return courseLengthSymbol;
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
  private String subject;
  private String educationType;
  private Double courseLength;
  private String courseLengthSymbol;
  private Boolean published;
  private Boolean canPublish;
  private Date beginDate;
  private Date endDate;
  private List<ContentNode> contentNodes;
  private String materialsBaseUrl;
  private String announcementsBaseUrl;
}
