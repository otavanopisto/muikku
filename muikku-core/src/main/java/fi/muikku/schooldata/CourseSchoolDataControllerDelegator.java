package fi.muikku.schooldata;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.schooldata.entity.Course;

@RequestScoped
@Stateful
public class CourseSchoolDataControllerDelegator 
    extends SchoolDataController<CourseSchoolDataController> 
    implements CourseSchoolDataController {

  // TODO: rights / model???
  
  @Override
  public Course createCourse(CourseEntity courseEntity, String name, UserEntity creator) {
    CourseSchoolDataController controller = getSchoolDataController(courseEntity);
    return controller.createCourse(courseEntity, name, creator);
  }

  @Override
  public Course findCourse(CourseEntity courseEntity) {
    CourseSchoolDataController controller = getSchoolDataController(courseEntity);
    return controller.findCourse(courseEntity);
  }

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Override
  public List<Course> listAll() {
    SchoolDataSource local = schoolDataSourceDAO.findByIdentifier("LOCAL");
    CourseSchoolDataController schoolDataController = getSchoolDataController(local);
    
    return schoolDataController.listAll();
  }
  
}
