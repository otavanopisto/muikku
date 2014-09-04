package fi.muikku.plugins.students;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.security.Permit;


@Named
@Stateful
@RequestScoped
@Join (path = "/students/", to = "/students/index.jsf")
public class StudentsViewBackingBean {
  
  @RequestAction
  @Permit (StudentsViewPermissions.MANAGE_STUDENTS)
  public void load() {
  }
  
}
