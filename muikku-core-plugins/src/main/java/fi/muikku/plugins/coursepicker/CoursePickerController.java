package fi.muikku.plugins.coursepicker;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.entity.Subject;

@Dependent
@Stateful
@Named("CoursePicker")
public class CoursePickerController {

  @Inject 
  private CourseMetaController courseMetaController; 

  public List<Subject> listSubjects() {
    return courseMetaController.listSubjects();
  }
  
}
