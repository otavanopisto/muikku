package fi.muikku.schooldata.local;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.courses.CourseImplDAO;
import fi.muikku.model.courses.CourseImpl;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.schooldata.CourseSchoolDataController;
import fi.muikku.schooldata.entity.Course;

@RequestScoped
@LocalSchoolDataController
public class LocalCourseController implements CourseSchoolDataController {
  
  @Inject
  private CourseImplDAO courseImplDAO;

  @Override
  public Course createCourse(CourseEntity courseEntity, String name, UserEntity creator) {
    return CourseIntfImpl.fromEntity(courseImplDAO.create(courseEntity, name, ""));
  }

  @Override
  public Course findCourse(CourseEntity courseEntity) {
    return CourseIntfImpl.fromEntity(courseImplDAO.findByCourseEntity(courseEntity));
  }

  @Override
  public List<Course> listAll() {
    List<Course> courses = new ArrayList<Course>();
    
    List<CourseImpl> list = courseImplDAO.listAll();
    
    for (CourseImpl impl : list)
      courses.add(CourseIntfImpl.fromEntity(impl));
    
    return courses;
  }
  
  private static class CourseIntfImpl implements Course {

  	public CourseIntfImpl(String name, String description) {
			this.name = name;
      this.description = description;
		}
  	
		@Override
		public String getName() {
			return name;
		}

		@Override
		public void setName(String name) {
			this.name = name;
		}
		
		public static Course fromEntity(CourseImpl courseImpl) {
			return new CourseIntfImpl(courseImpl.getName(), courseImpl.getDescription());
		}
  	
		@Override
  	public String getDescription() {
  	  return description;
  	}
		
    private String description;
		private String name;
  }
  
}
