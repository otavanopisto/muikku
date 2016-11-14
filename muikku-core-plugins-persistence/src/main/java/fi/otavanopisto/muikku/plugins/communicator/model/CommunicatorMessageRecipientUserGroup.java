package fi.otavanopisto.muikku.plugins.communicator.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CommunicatorMessageRecipientUserGroup extends CommunicatorMessageRecipientGroup {

  public Long getUserGroupEntityId() {
    return userGroupEntityId;
  }

  public void setUserGroupEntityId(Long userGroupEntityId) {
    this.userGroupEntityId = userGroupEntityId;
  }

  @Column (nullable = false)
  @NotNull
  private Long userGroupEntityId;
}
