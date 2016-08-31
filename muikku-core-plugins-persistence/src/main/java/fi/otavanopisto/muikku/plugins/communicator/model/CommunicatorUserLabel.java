package fi.otavanopisto.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.security.ContextReference;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class CommunicatorUserLabel extends CommunicatorLabel implements ContextReference {
  
  public Long getUserEntity() {
    return userEntity;
  }

  public void setUserEntity(Long userEntity) {
    this.userEntity = userEntity;
  }

  @Override
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @NotEmpty
  private String name;

  @Column (name = "userEntity_id")
  private Long userEntity;
}
