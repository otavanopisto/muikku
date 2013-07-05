package fi.muikku.schooldata.local;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.dao.courses.CourseImplDAO;
import fi.muikku.events.Created;
import fi.muikku.model.courses.CourseImpl;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.CourseSchoolDataController;
import fi.muikku.schooldata.entity.Course;
import fi.muikku.schooldata.events.CourseEvent;

@RequestScoped
@LocalSchoolDataController
public class LocalCourseController implements CourseSchoolDataController {
  
  @Inject
  private CourseImplDAO courseImplDAO;

  @Inject
  @Created
  private Event<CourseEvent> courseCreatedEvent;
  
  @Override
  public Course createCourse(CourseEntity courseEntity, String name, UserEntity creator) {
    CourseImpl courseImpl = courseImplDAO.create(courseEntity, name, "");

    fireCourseCreatedEvent(courseEntity);
    
    return CourseIntfImpl.fromEntity(courseImpl);
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

  private void fireCourseCreatedEvent(CourseEntity courseEntity) {
    CourseEvent courseEvent = new CourseEvent();
    courseEvent.setCourseEntityId(courseEntity.getId());
    courseCreatedEvent.fire(courseEvent);
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
