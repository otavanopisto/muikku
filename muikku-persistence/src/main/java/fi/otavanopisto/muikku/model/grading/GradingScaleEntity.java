package fi.otavanopisto.muikku.model.grading;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.util.ArchivableEntity;
import fi.otavanopisto.security.ContextReference;

@Entity
public class GradingScaleEntity implements ArchivableEntity, ContextReference {
  
  public Long getId() {
    return id;
  }
  
  public String getIdentifier() {
		return identifier;
	}
  
  public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

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

	@NotEmpty
	@NotNull
	@Column(nullable = false)
	private String identifier;

	@ManyToOne
  private SchoolDataSource dataSource;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}