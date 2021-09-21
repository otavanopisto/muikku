package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

@Dependent
public class NotificationController {

  @Inject
  private Logger logger;

  @Inject
  private Mailer mailer;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserGroupController userGroupController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private UserEntityController userEntityController;

  public void sendNotification(String subject, String content, UserEntity recipient, String guidanceCounselorMail) {
    String studentEmail = userEmailEntityController.getUserDefaultEmailAddress(recipient, Boolean.FALSE);
    if (studentEmail != null) {
      mailer.sendMail(MailType.HTML,
          Arrays.asList(studentEmail),
          guidanceCounselorMail == null ? Collections.emptyList() : Arrays.asList(guidanceCounselorMail),
          Collections.emptyList(),
          subject,
          content);
    }
    else {
      logger.log(Level.WARNING,
          String.format("Cannot send email notification to student %s because no email address was found",
              recipient.getDefaultIdentifier()));
    }
  }
  
  public boolean isNotifiedStudent(OffsetDateTime studyStartDate, OffsetDateTime studyEndDate, OffsetDateTime currentDateTime, int thresholdDays) {
    if ((studyStartDate == null) || (studyEndDate != null))
      return false;
    
    // Earliest point when student may receive the notification is study start date + threshold day count
    OffsetDateTime thresholdDateTime = studyStartDate.plusDays(thresholdDays);
    
    // Furthest point to receive the notification is studyStartDate + thresholdDays + 30 (1 month)
    OffsetDateTime maxThresholdDateTime = studyStartDate.plusDays(thresholdDays + 30);

    // If the threshold date has passed the student is valid target for the notification
    return thresholdDateTime.isBefore(currentDateTime) && maxThresholdDateTime.isAfter(currentDateTime);
  }
  
  public String getStudyCounselorEmail(SchoolDataIdentifier studentIdentifier){
    UserEntity guidanceCounselor = null;
    String guidanceCounselorEmail = null;
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserIdentifier(studentIdentifier);
    
    // #3089: An awkward workaround to use the latest guidance group based on its identifier. Assumes a larger
    // identifier means a more recent entity. A more proper fix would be to sync group creation dates from
    // Pyramus and include them in the Elastic index. Then again, user groups would have to be refactored
    // entirely, as Pyramus handles group members as students (one study programme) while Muikku handles
    // them as user entities (all study programmes)...
    
    userGroupEntities.sort(new Comparator<UserGroupEntity>() {
      public int compare(UserGroupEntity o1, UserGroupEntity o2) {
        long l1 = NumberUtils.toLong(StringUtils.substringAfterLast(o1.getIdentifier(), "-"), -1);
        long l2 = NumberUtils.toLong(StringUtils.substringAfterLast(o2.getIdentifier(), "-"), -1);
        return (int) (l2 - l1);
      }
    });
    
    // Choose the first staff member of the first guidance group as CC recipient for the notification

    userGroupEntities:
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);

      if (userGroup.getIsGuidanceGroup()) {
        List<GroupUser> groupUsers = userGroupController.listUserGroupStaffMembers(userGroup);

        for (GroupUser groupUser : groupUsers) {
          User user = userGroupController.findUserByGroupUser(groupUser);
          guidanceCounselor = userEntityController.findUserEntityByUser(user);
          break userGroupEntities;
        }
      }
    }
    if (guidanceCounselor != null) {
      guidanceCounselorEmail = userEmailEntityController.getUserDefaultEmailAddress(guidanceCounselor, false);
      }
    
    return guidanceCounselorEmail;
  }

}