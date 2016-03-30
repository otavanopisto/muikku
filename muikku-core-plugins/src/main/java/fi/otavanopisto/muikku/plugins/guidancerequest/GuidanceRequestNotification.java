package fi.otavanopisto.muikku.plugins.guidancerequest;

import java.io.Serializable;
import java.text.MessageFormat;

import javax.enterprise.inject.Default;
import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.notifier.NotifierAction;
import fi.otavanopisto.muikku.notifier.NotifierContext;
import fi.otavanopisto.muikku.plugins.guidancerequest.GuidanceRequest;
import fi.otavanopisto.muikku.plugins.notifier.email.NotifierEmailContent;
import fi.otavanopisto.muikku.plugins.notifier.email.NotifierEmailMessageComposer;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Default
@NotifierEmailContent(GuidanceRequestNotification.NAME)
public class GuidanceRequestNotification implements NotifierAction, NotifierEmailMessageComposer, Serializable {

  private static final long serialVersionUID = 1445819086020273477L;

  public static final String NAME = "guidancerequest-new";
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;

  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Override
  public String getEmailSubject(NotifierContext context) {
    GuidanceRequest guidanceRequest = getGuidanceRequest(context);
    UserEntity student = userEntityController.findUserEntityById(guidanceRequest.getStudent());
    User user = userController.findUserByDataSourceAndIdentifier(student.getDefaultSchoolDataSource(), student.getDefaultIdentifier());
    String userName = user.getFirstName() + " " + user.getLastName();
    
    String caption = localeController.getText(sessionController.getLocale(), "plugin.guidancerequest.newGuidanceRequest.mail.subject");

    return MessageFormat.format(caption, userName);
  }

  @Override
  public String getEmailContent(NotifierContext context) {
    GuidanceRequest guidanceRequest = getGuidanceRequest(context);
    UserEntity student = userEntityController.findUserEntityById(guidanceRequest.getStudent());
    User user = userController.findUserByDataSourceAndIdentifier(student.getDefaultSchoolDataSource(), student.getDefaultIdentifier());
    String userName = user.getFirstName() + " " + user.getLastName();
    
    String content = localeController.getText(sessionController.getLocale(), "plugin.guidancerequest.newGuidanceRequest.mail.content");
    
    return MessageFormat.format(content, userName, guidanceRequest.getMessage());
  }

  @Override
  public MailType getEmailMimeType(NotifierContext context) {
    return MailType.PLAINTEXT;
  }

  private GuidanceRequest getGuidanceRequest(NotifierContext context) {
    return (GuidanceRequest) context.getParameter("guidanceRequest");
  }
  
  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public String getDisplayName() {
    return "Ohjauspyyntö - uusi ohjauspyyntö";
  }

}
