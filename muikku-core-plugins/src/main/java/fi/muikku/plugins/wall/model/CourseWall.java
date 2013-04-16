package fi.muikku.plugins.wall.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseWall extends Wall {

  public Long getCourse() {
    return course;
  }

  public void setCourse(Long course) {
    this.course = course;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.COURSE;
  }
  
  @Column (name = "course_id")
  private Long course;
}
