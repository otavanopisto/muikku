package fi.otavanopisto.muikku.model.coursemeta;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.util.ArchivableEntity;

@Entity
public class CourseIdentifierEntity implements ArchivableEntity {
  
  public Long getId() {
    return id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}