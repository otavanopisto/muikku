package fi.muikku.schooldata.events;

import java.io.Serializable;

public class CourseEvent implements Serializable {

  private static final long serialVersionUID = 4846143398705949785L;

  public Long getCourseEntityId() {
    return courseEntityId;
  }

  public void setCourseEntityId(Long courseEntityId) {
    this.courseEntityId = courseEntityId;
  }
  
  private Long courseEntityId;
}
