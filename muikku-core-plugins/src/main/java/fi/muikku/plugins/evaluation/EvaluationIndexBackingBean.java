package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.session.SessionController;
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
  
  @RequestAction
  public String init() {
    // TODO: Logged in as teacher?
    
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
  
  private List<WorkspaceItem> workspaceItems;
  private String gradingScales;
  
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

}
