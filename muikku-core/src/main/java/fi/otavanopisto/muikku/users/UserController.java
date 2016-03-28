package fi.otavanopisto.muikku.users;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;

public class UserController {
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  public User createUser(SchoolDataSource schoolDataSource, String firstName, String lastName) {
    return userSchoolDataController.createUser(schoolDataSource, firstName, lastName);
  }

  public User findUserByDataSourceAndIdentifier(String schoolDataSource, String userIdentifier) {
    return userSchoolDataController.findUser(schoolDataSource, userIdentifier);
  }
  
  public User findUserByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String userIdentifier) {
    return userSchoolDataController.findUser(schoolDataSource, userIdentifier);
  }

  public User findUserByIdentifier(SchoolDataIdentifier userIdentifier) {
    if (userIdentifier == null) {
      return null; 
    }
    
    return findUserByDataSourceAndIdentifier(userIdentifier.getDataSource(), userIdentifier.getIdentifier());
  }

  public User findUserByUserEntityDefaults(UserEntity userEntity) {
    return findUserByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
  }

  public List<User> listUsers() {
    return userSchoolDataController.listUsers();
  }
  
  public List<UserAddress> listUserAddresses(User user) {
    return listUserAddresses(new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource()));
  }
  
  public List<UserAddress> listUserAddresses(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listUserAddressses(userIdentifier);
  }

  public List<UserPhoneNumber> listUserPhoneNumbers(User user) {
    return listUserPhoneNumbers(new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource()));
  }
  
  public List<UserPhoneNumber> listUserPhoneNumbers(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listUserPhoneNumbers(userIdentifier);
  }

  public List<UserEmail> listUserEmails(SchoolDataIdentifier userIdentifier) {
    return userSchoolDataController.listUserEmails(userIdentifier);
  }
  
}
