package fi.muikku.model.wall;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import fi.muikku.model.stub.courses.CourseEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseWall extends Wall {

  public CourseEntity getCourse() {
    return course;
  }

  public void setCourse(CourseEntity course) {
    this.course = course;
  }

  @Override
  @Transient
  public WallType getWallType() {
    return WallType.COURSE;
  }
  
  @ManyToOne
  private CourseEntity course;
}
