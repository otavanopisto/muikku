package fi.muikku.plugins.notifier;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.model.base.Tag;
import fi.muikku.model.users.UserEntity;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;

@Dependent
@Stateful
public class NotifierController {
  @Inject
  private UserEntityDAO userDAO;

  @Inject
  private SessionController sessionController;

  @Inject
  private fi.muikku.schooldata.UserController userController;
  
  @Inject
  @Any
  private Instance<NotifierStrategy> notifierStrategies;
  
  public void sendNotification(NotifierAction action, UserEntity sender, List<UserEntity> recipients) {
    for (UserEntity recipient : recipients) {
      sendNotification(action, sender, recipient);
    }
  }

  public void sendNotification(NotifierAction action, UserEntity sender, UserEntity recipient) {
    for (NotifierStrategy strategy : notifierStrategies) {
      // dao, recipient, action, strategy
      
      if (allow) {
        strategy.sendNotification(sender, recipient);
      }
    }
  }
}
