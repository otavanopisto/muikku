package fi.otavanopisto.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.users.UserEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class SuperUser extends UserEntity {
  
}
