package fi.muikku.plugins.notifier.impl;

import javax.inject.Inject;

import fi.muikku.controller.EnvironmentSettingsController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.notifier.NotifierAction;
import fi.muikku.plugins.notifier.NotifierEmailMessageComposer;
import fi.muikku.plugins.notifier.NotifierStrategy;
import fi.muikku.schooldata.UserController;

public class NotifierEmailStrategy implements NotifierStrategy {

  @Inject
  private Mailer mailer;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @Inject
  private UserController userController;
  
  @Override
  public String getName() {
    return "email";
  }

  @Override
  public String getDisplayName() {
    // TODO: localize
    return "Email";
  }

  @Override
  public void sendNotification(NotifierAction action, UserEntity sender, UserEntity recipient) {
    NotifierEmailMessageComposer message = (NotifierEmailMessageComposer) action;
    
    mailer.sendMail(environmentSettingsController., to, message.getEmailSubject(), message.getEmailContent());
  }

  @Override
  public boolean isSupported(NotifierAction action) {
    return action instanceof NotifierEmailMessageComposer;
  }

}
