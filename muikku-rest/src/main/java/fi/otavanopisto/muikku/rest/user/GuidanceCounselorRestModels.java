package fi.otavanopisto.muikku.rest.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.rest.model.GuidanceCounselorRestModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GroupStaffMember;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public class GuidanceCounselorRestModels {

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  /**
   * Returns a List of GuidanceCounselorRestModels which are the Guidance Counselors
   * of given Student.
   * 
   * @param studentIdentifier the Student's SchoolDataIdentifier
   * @param properties the properties needed in result set
   * @return
   */
  public List<GuidanceCounselorRestModel> getGuidanceCounselorRestModels(SchoolDataIdentifier studentIdentifier, String[] properties) {
    return getGuidanceCounselorRestModels(studentIdentifier, properties, null);
  }
  
  /**
   * Returns a List of GuidanceCounselorRestModels which are the Guidance Counselors
   * of given Student.
   * 
   * @param studentIdentifier the Student's SchoolDataIdentifier
   * @param properties the properties needed in result set
   * @param userEntityFilter Filter to specify, if there's external filter requirements to the UserEntities of Guidance Counselors that are listed
   * @return
   */
  public List<GuidanceCounselorRestModel> getGuidanceCounselorRestModels(SchoolDataIdentifier studentIdentifier, String[] properties, Predicate<UserEntity> userEntityFilter) {
    List<GroupStaffMember> guidanceCouncelors = userGroupGuidanceController.getGuidanceCounselors(studentIdentifier, false, userEntityFilter);
    
    List<GuidanceCounselorRestModel> guidanceCounselorRestModels = new ArrayList<>();

    for (GroupStaffMember guidanceCounselor : guidanceCouncelors) {
      SchoolDataIdentifier gcUserIdentifer = new SchoolDataIdentifier(guidanceCounselor.getUserIdentifier(), guidanceCounselor.getUserSchoolDataSource());
      UserSchoolDataIdentifier gcUserSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(gcUserIdentifer);
      UserEntity userEntity = gcUserSchoolDataIdentifier != null ? gcUserSchoolDataIdentifier.getUserEntity() : null;
      
      if (userEntity == null) {
        continue;
      }

      boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);
      SchoolDataIdentifier schoolDataIdentifier = userEntity.defaultSchoolDataIdentifier();
      UserEntityName userEntityName = userEntityController.getName(userEntity, true);
      String email = userEmailEntityController.getUserDefaultEmailAddress(schoolDataIdentifier, false);

      Map<String, String> propertyMap = new HashMap<String, String>();
      if (ArrayUtils.isNotEmpty(properties)) {
        for (String propertyName : properties) {
          UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userEntity, propertyName);
          propertyMap.put(propertyName, userEntityProperty == null ? null : userEntityProperty.getValue());
        }
      }

      guidanceCounselorRestModels.add(new GuidanceCounselorRestModel(
          userEntity.defaultSchoolDataIdentifier().toId(),
          userEntity.getId(),
          userEntityName.getFirstName(),
          userEntityName.getLastName(),
          email,
          propertyMap,
          hasImage,
          guidanceCounselor.isGroupAdvisor(),
          guidanceCounselor.isStudyAdvisor()));
    }
    
    return guidanceCounselorRestModels;
  }
  
}
