package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.util.ArchivableEntity;
import fi.otavanopisto.security.ContextReference;

@Entity
@Cacheable
@Cache (usage = CacheConcurrencyStrategy.TRANSACTIONAL)
public class WorkspaceEntity implements ArchivableEntity, ContextReference {
  
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
  
  public String getUrlName() {
		return urlName;
	}
  
  public void setUrlName(String urlName) {
		this.urlName = urlName;
	}
  
  public Boolean getPublished() {
    return published;
  }
  
  public void setPublished(Boolean published) {
    this.published = published;
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

	@NotEmpty
	@NotNull
	@Column(nullable = false, unique = true)
	private String urlName;

	@NotNull
  @Column(nullable = false)
  private Boolean published;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived;
  
}