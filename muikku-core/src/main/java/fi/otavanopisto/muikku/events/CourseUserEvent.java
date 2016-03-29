package fi.otavanopisto.muikku.events;

import java.io.Serializable;

public class CourseUserEvent implements Serializable {
  
  private static final long serialVersionUID = -930015360788607673L;

  public Long getCourseUserId() {
    return courseUserId;
  }

  public void setCourseUserId(Long courseUserId) {
    this.courseUserId = courseUserId;
  }
  
  private Long courseUserId;
}
