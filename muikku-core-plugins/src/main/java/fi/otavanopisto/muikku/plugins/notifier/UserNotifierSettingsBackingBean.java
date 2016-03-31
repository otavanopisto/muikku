package fi.otavanopisto.muikku.plugins.notifier;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.notifier.NotifierAction;
import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.notifier.NotifierMethod;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
public class UserNotifierSettingsBackingBean {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private NotifierController notifierController;

  @Inject
  @Any
  private Instance<NotifierAction> notifierActions;

  @Inject
  @Any
  private Instance<NotifierMethod> notifierMethods;
  
  public List<NotifierAction> listActions() {
    List<NotifierAction> list = new ArrayList<NotifierAction>();
    
    for (NotifierAction action : notifierActions)
      list.add(action);
    
    Collections.sort(list, new Comparator<NotifierAction>() {
      @Override
      public int compare(NotifierAction o1, NotifierAction o2) {
        return o1.getDisplayName().compareTo(o2.getDisplayName());
      }
    });
    
    return list;
  }

  public List<NotifierMethod> listMethods() {
    List<NotifierMethod> list = new ArrayList<NotifierMethod>();
    
    for (NotifierMethod method : notifierMethods)
      list.add(method);
    
    Collections.sort(list, new Comparator<NotifierMethod>() {
      @Override
      public int compare(NotifierMethod o1, NotifierMethod o2) {
        return o1.getDisplayName().compareTo(o2.getDisplayName());
      }
    });

    return list;
  }
  
  public boolean supportsMethod(NotifierAction action, NotifierMethod method) {
    return method.isSupported(action);
  }
  
  @LoggedIn
  public boolean isSelected(NotifierAction action, NotifierMethod method) {
    UserEntity user = sessionController.getLoggedUserEntity();
    
    return notifierController.allowsMessages(user, action, method);
  }
  
}
