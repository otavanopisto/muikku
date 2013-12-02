package fi.muikku.plugins.students;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;

import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;


@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
      id = "students", 
      pattern = "/students/#{studentViewBackingBean.studentId}/", 
      viewId = "/students/studentselected.jsf")
})

public class StudentViewBackingBean {
  
  @Inject
  private UserController userController;
  
  public User getUser() {
    return userController.findUser(getUserEntity());
  }
  
  public UserEntity getUserEntity() {
    return userController.findUserEntityById(studentId);
  }
  
  public Long getStudentId() {
    return studentId;
  }

  public void setStudentId(Long studentId) {
    this.studentId = studentId;
  }
  
  private Long studentId;
}
