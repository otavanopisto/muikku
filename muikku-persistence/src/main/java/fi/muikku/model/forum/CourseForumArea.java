package fi.muikku.model.forum;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.stub.courses.CourseEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseForumArea extends ForumArea {

  public CourseEntity getCourse() {
    return course;
  }

  public void setCourse(CourseEntity course) {
    this.course = course;
  }
  
  @ManyToOne
  private CourseEntity course;
}
