package fi.muikku.schooldata;

import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.schooldata.entity.User;

/**
 * 
 * 
 * Fire UserEvent when User is created, modified or archived
 */
public interface UserSchoolDataController {

  User createUser(UserEntity userEntity, String firstName, String lastName, String email);
  
  User findUser(UserEntity userEntity);
  
}