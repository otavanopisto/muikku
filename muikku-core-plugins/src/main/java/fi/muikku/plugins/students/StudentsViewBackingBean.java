package fi.muikku.plugins.students;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.security.Permit;


@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
      id = "students-index", 
      pattern = "/students/", 
      viewId = "/students/index.jsf")
})

public class StudentsViewBackingBean {
  
  @URLAction
  @Permit (StudentsViewPermissions.MANAGE_STUDENTS)
  public void load() {
  }
  
}
