package fi.otavanopisto.muikku.plugins.coursepicker;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;

public class CoursePickerController {

  @Inject 
  private CourseMetaController courseMetaController; 

  public List<Subject> listSubjects() {
    return courseMetaController.listSubjects();
  }
  
}
