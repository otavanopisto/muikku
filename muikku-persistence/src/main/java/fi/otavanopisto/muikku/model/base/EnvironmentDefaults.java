package fi.otavanopisto.muikku.model.base;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;

@Entity
public class EnvironmentDefaults {

  public Long getId() {
    return id;
  }

  public EnvironmentRoleEntity getDefaultUserRole() {
    return defaultUserRole;
  }

  public void setDefaultUserRole(EnvironmentRoleEntity defaultUserRole) {
    this.defaultUserRole = defaultUserRole;
  }

  public WorkspaceRoleEntity getDefaultCourseCreatorRole() {
    return defaultCourseCreatorRole;
  }

  public void setDefaultCourseCreatorRole(WorkspaceRoleEntity defaultCourseCreatorRole) {
    this.defaultCourseCreatorRole = defaultCourseCreatorRole;
  }
  
  public Integer getHttpPort() {
    return httpPort;
  }
  
  public void setHttpPort(Integer httpPort) {
    this.httpPort = httpPort;
  }
  
  public Integer getHttpsPort() {
    return httpsPort;
  }
  
  public void setHttpsPort(Integer httpsPort) {
    this.httpsPort = httpsPort;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private EnvironmentRoleEntity defaultUserRole;

  @ManyToOne
  private WorkspaceRoleEntity defaultCourseCreatorRole;

  @Column (nullable = false)
  @NotNull
  private Integer httpPort;

  @Column (nullable = false)
  @NotNull
  private Integer httpsPort;
}
