package fi.otavanopisto.muikku.users;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.GroupUserType;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.payload.StaffMemberPayload;
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
  
  public List<GroupUser> listUserGroupStaffMembers(UserGroup userGroup) {
    return userSchoolDataController.listGroupUsersByGroupAndType(
        userGroup,
        GroupUserType.STAFF_MEMBER);
  }
  
  public User findUserByGroupUser(GroupUser groupUser) {
    return userSchoolDataController.findUser(
        groupUser.getUserSchoolDataSource(),
        groupUser.getUserIdentifier()
    );
  }
}
