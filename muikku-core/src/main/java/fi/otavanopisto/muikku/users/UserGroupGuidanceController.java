package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
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

  /**
   * Returns a (pseudo) random Guidance Couselor of given student which is member of any role archetype.
   * 
   * Prefers to return a Guidance Counselor which is a message receiver, but if none are found
   * tries to find one that isn't a message receiver. If none are still found, null is returned.
   * 
   * @param studentIdentifier
   * @return
   */
  public UserEntity getGuidanceCounselorPreferMessageReceiver(SchoolDataIdentifier studentIdentifier) {
    // TODO We are potentially loading two lists in order to just get one member out of them, could this be optimized?
    List<UserEntity> guidanceCounselors = getGuidanceCounselors(studentIdentifier, true);
    if (CollectionUtils.isNotEmpty(guidanceCounselors)) {
      return guidanceCounselors.get(0);
    }
    
    guidanceCounselors = getGuidanceCounselors(studentIdentifier, false);
    return CollectionUtils.isNotEmpty(guidanceCounselors) ? guidanceCounselors.get(0) : null;
  }

  /**
   * Returns a (pseudo) random Guidance Couselor of given student which is
   * - member of any role archetype
   * - specified as message receiver if so wanted
   * 
   * @param studentIdentifier
   * @param onlyMessageReceivers
   * @return
   */
  public UserEntity getGuidanceCounselor(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    List<UserEntity> guidanceCounselors = getGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
    return CollectionUtils.isNotEmpty(guidanceCounselors) ? guidanceCounselors.get(0) : null;
  }
  
  /**
   * Returns Guidance Couselors of given student which are
   * - members of any role archetype
   * - specified as message receivers if so wanted
   * 
   * @param studentIdentifier
   * @param onlyMessageReceivers
   * @return
   */
  public List<UserEntity> getGuidanceCounselors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    return getGuidanceCounselors(studentIdentifier, EnumSet.allOf(EnvironmentRoleArchetype.class), onlyMessageReceivers);
  }  

  /**
   * Returns Guidance Couselors of given student which are
   * - members of given roles
   * - specified as message receivers if so wanted
   * 
   * @param studentIdentifier
   * @param counselorRoles
   * @param onlyMessageReceivers
   * @return
   */
  public List<UserEntity> getGuidanceCounselors(SchoolDataIdentifier studentIdentifier, EnumSet<EnvironmentRoleArchetype> counselorRoles, Boolean onlyMessageReceivers) {
    List<GroupUser> guidanceCounselors = userSchoolDataController.listStudentGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
    
    List<UserEntity> councelorList = new ArrayList<>();
    
    for (GroupUser guidanceCounselor : guidanceCounselors) {
      SchoolDataIdentifier gcUserIdentifer = new SchoolDataIdentifier(guidanceCounselor.getUserIdentifier(), guidanceCounselor.getUserSchoolDataSource());
      UserSchoolDataIdentifier gcUserSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(gcUserIdentifer);
      UserEntity gcUserEntity = gcUserSchoolDataIdentifier.getUserEntity();
      
      // Check that the default UserSchoolDataIdentifier is the default at the moment - if it isn't, skip it because the group user isn't the active anymore
      boolean isActiveIdentifier = gcUserIdentifer.equals(gcUserEntity.defaultSchoolDataIdentifier());

      // Restrict to specified roles 
      boolean isInRole = false;
      
      if (gcUserSchoolDataIdentifier.getRoles() != null) {
        for (EnvironmentRoleEntity roleEntity : gcUserSchoolDataIdentifier.getRoles()) {
          if (counselorRoles.contains(roleEntity.getArchetype())) {
            isInRole = true;
            break;
          }
        }
      }
      
      if (isActiveIdentifier && isInRole) {
        councelorList.add(gcUserEntity);
      }
    }
    
    return councelorList;
  }
  
}
