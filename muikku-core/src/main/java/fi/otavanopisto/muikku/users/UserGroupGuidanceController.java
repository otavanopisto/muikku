package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;

public class UserGroupGuidanceController {

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  public List<UserEntity> getGuidanceCouncelors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    List<GroupUser> guidanceCounselors = userSchoolDataController.listStudentGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
    
    List<UserEntity> councelorList = new ArrayList<>();
    
    for (GroupUser guidanceCounselor : guidanceCounselors) {
      SchoolDataIdentifier gcUserIdentifer = new SchoolDataIdentifier(guidanceCounselor.getUserIdentifier(), guidanceCounselor.getUserSchoolDataSource());
      UserSchoolDataIdentifier gcUserSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(gcUserIdentifer);
      UserEntity gcUserEntity = gcUserSchoolDataIdentifier.getUserEntity();
      
      // Check that the default UserSchoolDataIdentifier is the default at the moment - if it isn't, skip it because the group user isn't the active anymore
      if (gcUserIdentifer.equals(gcUserEntity.defaultSchoolDataIdentifier())) {
        councelorList.add(gcUserEntity);
      }
    }
    
    return councelorList;
  }
  
}
