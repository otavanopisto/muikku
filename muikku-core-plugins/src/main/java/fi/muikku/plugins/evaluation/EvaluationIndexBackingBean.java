package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.plugins.workspace.ContentNode;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.CourseLengthUnit;
import fi.muikku.schooldata.entity.EducationType;
import fi.muikku.schooldata.entity.Subject;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.session.SessionController;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserEntityController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation", to = "/jsf/evaluation/index.jsf")
@LoggedIn
public class EvaluationIndexBackingBean {
  
  @Inject
  private Logger logger;
  
  @Parameter ("workspaceEntityId")
  private Long workspaceEntityId;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private GradingController gradingController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private EnvironmentUserController environmentUserController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @RequestAction
  public String init() {
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(sessionController.getLoggedUserEntity());
    if (environmentUser == null) {
      return NavigationRules.ACCESS_DENIED;  
    }
    
    switch (environmentUser.getRole().getArchetype()) {
      case TEACHER:
      case ADMINISTRATOR:
      case MANAGER:
      break;
      default:
        return NavigationRules.ACCESS_DENIED;  
    }
    
    Long loggedUserEntityId = sessionController.getLoggedUserEntity().getId();
    
    ArrayList<WorkspaceItem> items = new ArrayList<>();
    
    for (WorkspaceEntity workspaceEntity : workspaceController.listWorkspaceEntitiesByUser(sessionController.getLoggedUserEntity())) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      CourseIdentifier courseIdentifier = courseMetaController.findCourseIdentifier(workspace.getSchoolDataSource(), workspace.getCourseIdentifierIdentifier());
      if (courseIdentifier != null) {
        if (workspaceEntity.getId().equals(getWorkspaceEntityId())) {
          items.add(0, new WorkspaceItem(workspaceEntity.getId(), courseIdentifier.getCode(), workspace.getName()));
        } else {
          items.add(new WorkspaceItem(workspaceEntity.getId(), courseIdentifier.getCode(), workspace.getName()));
        }
      }
    }
    
    workspaceItems = Collections.unmodifiableList(items);
    
    if (getWorkspaceEntityId() == null && !workspaceItems.isEmpty()) {
      workspaceEntityId = workspaceItems.get(0).getWorkspaceEntityId();
    }
    
    if (workspaceEntityId == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    List<GradingScale> gradingScales = new ArrayList<>();
    for (fi.muikku.schooldata.entity.GradingScale gradingScale : gradingController.listGradingScales()) {
      List<GradingScaleGrade> gradingScaleGrades = new ArrayList<>();
      
      for (fi.muikku.schooldata.entity.GradingScaleItem gradingScaleItem : gradingController.listGradingScaleItems(gradingScale)) {
        gradingScaleGrades.add(new GradingScaleGrade(gradingScaleItem.getIdentifier(), gradingScaleItem.getSchoolDataSource(), gradingScaleItem.getName()));
      }
      
      gradingScales.add(new GradingScale(gradingScale.getIdentifier(), gradingScale.getSchoolDataSource(), gradingScale.getName(), gradingScaleGrades));
    }
    
    try {
      this.gradingScales = new ObjectMapper().writeValueAsString(gradingScales);
    } catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Grading scales serialization failed", e);
      return NavigationRules.INTERNAL_ERROR;
    }
    
    try {
      assignments = new ObjectMapper().writeValueAsString(createAssignments(evaluationController.getAssignmentContentNodes(workspaceEntity, true)));
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to load assignments", e);
      return NavigationRules.INTERNAL_ERROR;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.warning(String.format("Could not find workspace for workspaceEntity #%d", workspaceEntity.getId()));
        return NavigationRules.NOT_FOUND;
      }
      
      WorkspaceType workspaceType = workspaceController.findWorkspaceType(workspace.getSchoolDataSource(), workspace.getWorkspaceTypeId()); 
      EducationType educationTypeObject = StringUtils.isBlank(workspace.getEducationTypeIdentifier()) ? null : courseMetaController.findEducationType(workspace.getSchoolDataSource(), workspace.getEducationTypeIdentifier());
      Subject subjectObject = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier());
      CourseLengthUnit lengthUnit = null;
      if ((workspace.getLength() != null) && (workspace.getLengthUnitIdentifier() != null)) {
        lengthUnit = courseMetaController.findCourseLengthUnit(workspace.getSchoolDataSource(), workspace.getLengthUnitIdentifier());
      }
      
      workspaceName = workspace.getName();
      subject = subjectObject != null ? subjectObject.getName() : null;
      educationType = educationTypeObject != null ? educationTypeObject.getName() : null;
      
      if (lengthUnit != null) {
        courseLength = workspace.getLength();
        courseLengthSymbol = lengthUnit.getSymbol();
      }

      if (workspaceType != null) {
        this.workspaceType = workspaceType.getName();
      }
      
      List<User> teacherUsers = workspaceController.listUsersByWorkspaceEntityAndRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.TEACHER);
      List<Assessor> assessors = new ArrayList<>(teacherUsers.size());
      for (User teacherUser : teacherUsers) {
        UserEntity teacherUserEntity = userEntityController.findUserEntityByUser(teacherUser);
        if (teacherUserEntity != null) {
          assessors.add(new Assessor(
            teacherUserEntity.getId(), 
            String.format("%s, %s", teacherUser.getLastName(), teacherUser.getFirstName()),
            teacherUserEntity.getId().equals(loggedUserEntityId)
          ));
        }
      }
      
      Collections.sort(assessors, new Comparator<Assessor>() {
        @Override
        public int compare(Assessor o1, Assessor o2) {
          return o1.getDisplayName().compareTo(o2.getDisplayName());
        }
      });
      
      try {
        this.assessors = new ObjectMapper().writeValueAsString(assessors);
      } catch (JsonProcessingException e) {
        logger.log(Level.SEVERE, "Teacher list serialization failed", e);
        return NavigationRules.INTERNAL_ERROR;
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    workspaceStudentCount = workspaceController.countWorkspaceUserEntitiesByWorkspaceRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.STUDENT);
    
    return null;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  public List<WorkspaceItem> getWorkspaceItems() {
    return workspaceItems;
  }
  
  public String getGradingScales() {
    return gradingScales;
  }
  
  public String getAssessors() {
    return assessors;
  }
  
  public String getWorkspaceName() {
    return workspaceName;
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
  
  public String getAssignments() {
    return assignments;
  }

  public Long getWorkspaceStudentCount() {
    return workspaceStudentCount;
  }
  
  private List<Assignment> createAssignments(List<ContentNode> assignmentNodes) {
    List<Assignment> result = new ArrayList<>(assignmentNodes.size());
    for (ContentNode assignmentNode : assignmentNodes) {
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(assignmentNode.getWorkspaceMaterialId());
      result.add(new Assignment(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(), assignmentNode.getTitle(), assignmentNode.getHtml(), assignmentNode.getType()));
    }
    
    return result;
  }

  private String workspaceName;
  private String workspaceType;
  private String subject;
  private String educationType;
  private Double courseLength;
  private String courseLengthSymbol;
  private List<WorkspaceItem> workspaceItems;
  private String gradingScales;
  private String assessors;
  private String assignments;
  private Long workspaceStudentCount;

  public static class Assignment {
    
    public Assignment(Long workspaceMaterialId, Long materialId, String title, String html, String type) {
      this.materialId = materialId;
      this.workspaceMaterialId = workspaceMaterialId;
      this.title = title;
      this.html = html;
      this.type = type;
    }
    
    public Long getWorkspaceMaterialId() {
      return workspaceMaterialId;
    }
    
    public Long getMaterialId() {
      return materialId;
    }
    
    public String getTitle() {
      return title;
    }
    
    public String getHtml() {
      return html;
    }
    
    public String getType() {
      return type;
    }
    
    private Long workspaceMaterialId;
    private Long materialId;
    private String title;
    private String html;
    private String type;
  }
  
  public static class WorkspaceItem {

    public WorkspaceItem(Long workspaceEntityId, String code, String title) {
      super();
      this.workspaceEntityId = workspaceEntityId;
      this.code = code;
      this.title = title;
    }

    public String getCode() {
      return code;
    }

    public void setCode(String code) {
      this.code = code;
    }

    public String getTitle() {
      return title;
    }

    public void setTitle(String title) {
      this.title = title;
    }
    
    public Long getWorkspaceEntityId() {
      return workspaceEntityId;
    }
    
    public void setWorkspaceEntityId(Long workspaceEntityId) {
      this.workspaceEntityId = workspaceEntityId;
    }

    private String code;
    private String title;
    private Long workspaceEntityId;
  }

  public static class GradingScale {
    
    public GradingScale(String id, String dataSource, String name, List<GradingScaleGrade> grades) {
      this.id = id;
      this.dataSource = dataSource;
      this.name = name;
      this.grades = grades;
    }
    
    public String getId() {
      return id;
    }
    
    public String getDataSource() {
      return dataSource;
    }
    
    public String getName() {
      return name;
    }
    
    public List<GradingScaleGrade> getGrades() {
      return grades;
    }

    private String id;
    private String dataSource;
    private String name;
    private List<GradingScaleGrade> grades;
  }
  
  public static class GradingScaleGrade {
    
    public GradingScaleGrade(String id, String dataSource, String name) {
      this.id = id;
      this.dataSource = dataSource;
      this.name = name;
    }
    
    public String getId() {
      return id;
    }
    
    public String getDataSource() {
      return dataSource;
    }
    
    public String getName() {
      return name;
    }
    
    private String id;
    private String dataSource;
    private String name;
  }

  public static class Assessor {
    
    public Assessor(Long userEntityId, String displayName, Boolean selected) {
      this.userEntityId = userEntityId;
      this.displayName = displayName;
      this.selected = selected;
    }
    
    public Long getUserEntityId() {
      return userEntityId;
    }
    
    public void setUserEntityId(Long userEntityId) {
      this.userEntityId = userEntityId;
    }
    
    public String getDisplayName() {
      return displayName;
    }
    
    public void setDisplayName(String displayName) {
      this.displayName = displayName;
    }
    
    public Boolean getSelected() {
      return selected;
    }
    
    public void setSelected(Boolean selected) {
      this.selected = selected;
    }
    
    private Long userEntityId;
    private String displayName;
    private Boolean selected;
  }
}
