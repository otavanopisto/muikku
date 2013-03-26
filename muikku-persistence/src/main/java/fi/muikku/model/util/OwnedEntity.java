package fi.muikku.model.util;

import fi.muikku.model.stub.users.UserEntity;

public interface OwnedEntity {

  UserEntity getOwner();
}
