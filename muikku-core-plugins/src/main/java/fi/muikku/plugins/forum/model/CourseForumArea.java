package fi.muikku.plugins.forum.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseForumArea extends ForumArea {

  public Long getCourse() {
    return course;
  }

  public void setCourse(Long course) {
    this.course = course;
  }
  
  @Column (name = "course_id")
  private Long course;
}
