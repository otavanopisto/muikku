package fi.otavanopisto.muikku.users;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.function.Predicate;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.GroupStaffMember;

public class UserGroupGuidanceController {

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  /**
   * Returns Guidance Couselors of given student which are
   * - members of any role archetype
   * - specified as message receivers if so wanted
   * 
   * @param studentIdentifier
   * @param onlyMessageReceivers
   * @return
   */
  public List<UserEntity> getGuidanceCounselorUserEntities(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers) {
    return getGuidanceCounselorUserEntities(studentIdentifier, EnumSet.allOf(EnvironmentRoleArchetype.class), onlyMessageReceivers);
  }  

  /**
   * Returns Guidance Couselor UserEntity's of given student which are
   * - members of given roles
   * - specified as message receivers if so wanted
   * 
   * @param studentIdentifier
   * @param counselorRoles
   * @param onlyMessageReceivers
   * @return
   */
  public List<UserEntity> getGuidanceCounselorUserEntities(SchoolDataIdentifier studentIdentifier, EnumSet<EnvironmentRoleArchetype> counselorRoles, Boolean onlyMessageReceivers) {
    List<GroupStaffMember> guidanceCounselors = userSchoolDataController.listStudentGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
    
    List<UserEntity> councelorList = new ArrayList<>();
    
    for (GroupStaffMember guidanceCounselor : guidanceCounselors) {
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

  /**
   * Returns all Guidance Counselors of a student.
   * 
   * @param studentIdentifier Students identifier
   * @return
   */
  public List<GroupStaffMember> getGuidanceCounselors(SchoolDataIdentifier studentIdentifier) {
    return getGuidanceCounselors(studentIdentifier, EnumSet.allOf(EnvironmentRoleArchetype.class), null, null);
  }
  
  /**
   * Returns all Guidance Counselors of a student. By default doesn't filter by any roles.
   * 
   * @param studentIdentifier Students identifier
   * @param onlyMessageReceivers if only the counselors with message receiver status are returned
   * @param userEntityFilter filter if there's need for additional restrictions on the Guidance Counselors to return
   * @return
   */
  public List<GroupStaffMember> getGuidanceCounselors(SchoolDataIdentifier studentIdentifier, Boolean onlyMessageReceivers, Predicate<UserEntity> userEntityFilter) {
    return getGuidanceCounselors(studentIdentifier, EnumSet.allOf(EnvironmentRoleArchetype.class), onlyMessageReceivers, userEntityFilter);
  }
  
  /**
   * Returns all Guidance Counselors of a student.
   * 
   * @param studentIdentifier Students identifier
   * @param counselorRoles Roles the Counselor must be in
   * @param onlyMessageReceivers if only the counselors with message receiver status are returned
   * @param userEntityFilter filter if there's need for additional restrictions on the Guidance Counselors to return
   * @return
   */
  public List<GroupStaffMember> getGuidanceCounselors(SchoolDataIdentifier studentIdentifier, EnumSet<EnvironmentRoleArchetype> counselorRoles, Boolean onlyMessageReceivers, Predicate<UserEntity> userEntityFilter) {
    List<GroupStaffMember> guidanceCounselors = userSchoolDataController.listStudentGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
    
    guidanceCounselors.removeIf(guidanceCounselor -> {
      SchoolDataIdentifier gcUserIdentifer = new SchoolDataIdentifier(guidanceCounselor.getUserIdentifier(), guidanceCounselor.getUserSchoolDataSource());
      UserSchoolDataIdentifier gcUserSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(gcUserIdentifer);
      UserEntity gcUserEntity = gcUserSchoolDataIdentifier != null ? gcUserSchoolDataIdentifier.getUserEntity() : null;
      
      // Remove if UserEntity or UserSchoolDataIdentifier could not be found
      if (gcUserEntity == null) {
        return true;
      }
      
      if (userEntityFilter != null && !userEntityFilter.test(gcUserEntity)) {
        return true;
      }
      
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

      return !(isActiveIdentifier && isInRole);
    });
    
    return guidanceCounselors;
  }

}
