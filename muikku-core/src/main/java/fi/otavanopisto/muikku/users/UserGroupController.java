package fi.otavanopisto.muikku.users;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupMembersPayload;
import fi.otavanopisto.muikku.schooldata.payload.StudentGroupPayload;

public class UserGroupController {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;

  public BridgeResponse<StudentGroupPayload> createStudentGroup(String dataSource, StudentGroupPayload studentGroup) {
    return userSchoolDataController.createStudentGroup(dataSource, studentGroup);
  }

  public BridgeResponse<StudentGroupPayload> updateStudentGroup(String dataSource, StudentGroupPayload studentGroup) {
    return userSchoolDataController.updateStudentGroup(dataSource, studentGroup);
  }
  
  public void archiveStudentGroup(String dataSource, String identifier) {
    userSchoolDataController.archiveStudentGroup(dataSource, identifier);
  }
  
  public BridgeResponse<StudentGroupMembersPayload> addStudentGroupMembers(String dataSource, StudentGroupMembersPayload payload) {
    return userSchoolDataController.addStudentGroupMembers(dataSource, payload);
  }

  public BridgeResponse<StudentGroupMembersPayload> removeStudentGroupMembers(String dataSource, StudentGroupMembersPayload payload) {
    return userSchoolDataController.removeStudentGroupMembers(dataSource, payload);
  }
  
  public UserGroup findUserGroup(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource != null) {
      return userSchoolDataController.findUserGroup(schoolDataSource, identifier);
    }
    
    return null;
  }
  
  public UserGroup findUserGroup(SchoolDataSource schoolDataSource, String identifier) {
    return userSchoolDataController.findUserGroup(schoolDataSource, identifier);
  }

  public UserGroup findUserGroup(UserGroupEntity userGroupEntity) {
    return findUserGroup(userGroupEntity.getSchoolDataSource(), userGroupEntity.getIdentifier());
  }
  
  public UserGroup findUserGroup(SchoolDataIdentifier schoolDataIdentifier) {
    return findUserGroup(schoolDataIdentifier.getDataSource(), schoolDataIdentifier.getIdentifier());
  }

}
