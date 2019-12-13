package fi.otavanopisto.muikku.users;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserAddress;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;
import fi.otavanopisto.muikku.schooldata.entity.UserPhoneNumber;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;

public class UserController {
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  public BridgeResponse<StaffMemberPayload> createStaffMember(String dataSource, StaffMemberPayload staffMember) {
    return userSchoolDataController.createStaffMember(dataSource, staffMember);
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
  
  public void updateUserAddress(
      SchoolDataIdentifier studentIdentifier,
      SchoolDataIdentifier addressIdentifier,
      String street,
      String postalCode,
      String city,
      String country
  ) {
    userSchoolDataController.updateUserAddress(studentIdentifier, addressIdentifier, street, postalCode, city, country);
  }

  public void updateUser(User user) {
    userSchoolDataController.updateUser(user);
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
