package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "dataSource_id", "identifier" } )   
  }    
)
public class OrganizationEntity {

  public Long getId() {
    return id;
  }

  @Transient
  public SchoolDataIdentifier schoolDataIdentifier() {
    return new SchoolDataIdentifier(getIdentifier(), getDataSource().getIdentifier());
  }
  
  public SchoolDataSource getDataSource() {
    return dataSource;
  }

  public void setDataSource(SchoolDataSource dataSource) {
    this.dataSource = dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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

  public OrganizationWorkspaceVisibility getWorkspaceVisibility() {
    return workspaceVisibility;
  }

  public void setWorkspaceVisibility(OrganizationWorkspaceVisibility workspaceVisibility) {
    this.workspaceVisibility = workspaceVisibility;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private SchoolDataSource dataSource;

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String identifier;

  @NotNull
  @Column (nullable = false)
  @NotEmpty
  private String name;
  
  @Column (nullable = false)
  @Enumerated (EnumType.STRING)
  private OrganizationWorkspaceVisibility workspaceVisibility;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;

}