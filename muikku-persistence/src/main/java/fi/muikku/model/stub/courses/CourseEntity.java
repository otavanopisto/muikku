package fi.muikku.model.stub.courses;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.util.ArchivableEntity;
import fi.muikku.model.util.SchoolDataEntity;
import fi.muikku.security.ContextReference;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class CourseEntity implements SchoolDataEntity, ArchivableEntity, ContextReference {
  
  public Long getId() {
    return id;
  }

  @Override
  public SchoolDataSource getDataSource() {
    return dataSource;
  }

  public void setDataSource(SchoolDataSource dataSource) {
    this.dataSource = dataSource;
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

  @ManyToOne
  private SchoolDataSource dataSource;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}