package fi.muikku.plugins.coursepicker;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.schooldata.RoleController;

@Named
@Stateful
@RequestScoped
@Join (path = "/coursepicker/coursepicker", to = "/coursepicker/coursepicker.jsf")
public class CoursePickerBackingBean {
  
  @Inject
  private RoleController roleController;
  
  @PostConstruct
  public void init() {
    List<WorkspaceRoleEntity> workspaceStudentRoles = roleController.listWorkspaceRoleEntitiesByArchetype(WorkspaceRoleArchetype.STUDENT);
    if (workspaceStudentRoles.size() == 1) {
      workspaceStudentRoleId = workspaceStudentRoles.get(0).getId();
    } else {
      // TODO: How to choose correct workspace student role?
      throw new RuntimeException("Multiple workspace student roles found.");
    }
  }
  
  public Long getWorkspaceStudentRoleId() {
    return workspaceStudentRoleId;
  }
  
  private Long workspaceStudentRoleId;
}