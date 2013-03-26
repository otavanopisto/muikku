package fi.muikku.model.courses;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.util.ArchivableEntity;

@Entity
public class CourseImpl implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public CourseEntity getCourseEntity() {
    return courseEntity;
  }

  public void setCourseEntity(CourseEntity courseEntity) {
    this.courseEntity = courseEntity;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @NotEmpty
  private String name;
  
  private String description;
  
  @ManyToOne
  private CourseEntity courseEntity;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
