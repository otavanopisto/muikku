package fi.muikku.plugins.seeker.defaultproviders;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.controller.CourseController;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.plugins.seeker.DefaultSeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.schooldata.entity.Course;
import fi.muikku.session.SessionController;

public class CourseSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private CourseController courseController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    return seekerify(courseController.listCourses(sessionController.getEnvironment()), searchTerm);
  }

  private List<SeekerResult> seekerify(List<CourseEntity> courses, String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();

    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.courses");

    for (CourseEntity c : courses) {
      Course c2 = courseController.findCourse(c);
      
      // TODO remove
      if ((c2.getName().toLowerCase().contains(searchTerm)) || (c2.getDescription().toLowerCase().contains(searchTerm)))
        result.add(new DefaultSeekerResultImpl(c2.getName(), caption, "/course/index.jsf?courseId=" + c.getId(), ""));
    }
    
    return result;
  }
  
}
