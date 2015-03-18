package fi.muikku.plugins.workspace;

import java.util.Date;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseLengthUnit;
import fi.muikku.schooldata.entity.EducationType;
import fi.muikku.schooldata.entity.Subject;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}", to = "/workspaces/workspace.jsf")
public class WorkspaceIndexBackingBean {

  @Parameter
  private String workspaceUrlName;

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
    workspaceEntityId = workspaceEntity.getId();
    
    WorkspaceMaterial frontPage = workspaceMaterialController.findFrontPage(workspaceEntity);
    if (frontPage != null) {
      workspaceMaterialId = frontPage.getId();
      materialId = frontPage.getMaterialId();
      materialType = "html";
      materialTitle = "Etusivu";
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);

    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.warning(String.format("Could not find workspace for workspaceEntity #%d", workspaceEntity.getId()));
        return NavigationRules.NOT_FOUND;
      }
      
      EducationType educationTypeObject = courseMetaController.findEducationType(workspace.getSchoolDataSource(), workspace.getEducationTypeIdentifier());
      Subject subjectObject = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier());
      CourseLengthUnit lengthUnit = null;
      if ((workspace.getLength() != null) && (workspace.getLengthUnitIdentifier() != null)) {
        lengthUnit = courseMetaController.findCourseLengthUnit(workspace.getSchoolDataSource(), workspace.getLengthUnitIdentifier());
      }
      
      workspaceId = workspaceEntity.getId();
      workspaceName = workspace.getName();
      subject = subjectObject != null ? subjectObject.getName() : null;
      educationType = educationTypeObject != null ? educationTypeObject.getName() : null;
      
      if (lengthUnit != null) {
        courseLength = workspace.getLength();
        courseLengthSymbol = lengthUnit.getSymbol();
      }
      
      beginDate = workspace.getBeginDate() != null ? workspace.getBeginDate().toDate() : null;
      endDate = workspace.getEndDate() != null ? workspace.getEndDate().toDate() : null;
      
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

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

  private WorkspaceEntity getWorkspaceEntity() {
    return workspaceController.findWorkspaceEntityById(workspaceId);
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

  public void visit() {
    workspaceVisitController.visit(getWorkspaceEntity());
  }
  
  public Long getNumVisits() {
    return workspaceVisitController.getNumVisits(getWorkspaceEntity());
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
  
  public Date getBeginDate() {
    return beginDate;
  }
  
  public Date getEndDate() {
    return endDate;
  }
  
  private Long workspaceId;
  private String workspaceName;
  private String contents;
  private long workspaceMaterialId;
  private long materialId;
  private long workspaceEntityId;
  private String materialType;
  private String materialTitle;
  private String subject;
  private String educationType;
  private Double courseLength;
  private String courseLengthSymbol;
  private Date beginDate;
  private Date endDate;
}
