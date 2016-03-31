package fi.otavanopisto.muikku.events;

import java.io.Serializable;

public class CourseEntityEvent implements Serializable {

  private static final long serialVersionUID = 1717465830973313548L;

  public Long getCourseEntityId() {
    return courseEntityId;
  }

  public void setCourseEntityId(Long courseEntityId) {
    this.courseEntityId = courseEntityId;
  }
  
  private Long courseEntityId;
}
