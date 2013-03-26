package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.stub.users.UserEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class SuperUser extends UserEntity {
  
}
