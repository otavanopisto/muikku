package fi.muikku.plugins.students;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.users.UserEntity;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.Permit;

@Named
@Stateful
@RequestScoped
@Join (path = "/students/#{studentId}/", to = "/students/studentselected.jsf")
public class StudentViewBackingBean {

  @Parameter
  private Long studentId;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @RequestAction
  @Permit (StudentsViewPermissions.MANAGE_STUDENTS_VIEW_STUDENT)
  public void load() {
  }
  
  public User getUser() {
    return userController.findUserByUserEntity(getUserEntity());
  }
  
  public UserEntity getUserEntity() {
    return userEntityController.findUserEntityById(studentId);
  }
  
  public Long getStudentId() {
    return studentId;
  }

  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }
  
}
