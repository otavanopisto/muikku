package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;

@Dependent
public class NotificationController {

  @Inject
  private Logger logger;

  @Inject
  private Mailer mailer;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;

  public void sendNotification(String subject, String content, UserEntity recipient, List<String> guidanceCounselorEmailAddresses) {
    String studentEmail = userEmailEntityController.getUserDefaultEmailAddress(recipient, Boolean.FALSE);
    if (studentEmail != null) {
      mailer.sendMail(MailType.HTML,
          Arrays.asList(studentEmail),
          guidanceCounselorEmailAddresses == null ? Collections.emptyList() : guidanceCounselorEmailAddresses,
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

  /**
   * Lists email addresses for all study counselors of given student.
   * 
   * @param studentIdentifier
   * @return
   */
  public List<String> listStudyCounselorsEmails(SchoolDataIdentifier studentIdentifier) {
    EnumSet<EnvironmentRoleArchetype> recipientRoles = EnumSet.of(
        EnvironmentRoleArchetype.TEACHER,
        EnvironmentRoleArchetype.ADMINISTRATOR,
        EnvironmentRoleArchetype.MANAGER,
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.STUDY_GUIDER
    );

    // List only guidance counselors that receive messages
    List<UserEntity> guidanceCounselors = userGroupGuidanceController.getGuidanceCounselorUserEntities(studentIdentifier, recipientRoles, true);
    List<String> guidanceCouncelorEmails = new ArrayList<>();
    for (UserEntity guidanceCounselor : guidanceCounselors) {
      String guidanceCounselorEmail = userEmailEntityController.getUserDefaultEmailAddress(guidanceCounselor, false);
      if (StringUtils.isNotBlank(guidanceCounselorEmail)) {
        guidanceCouncelorEmails.add(guidanceCounselorEmail);
      }
    }
    return guidanceCouncelorEmails;
  }

}