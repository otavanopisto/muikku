package fi.otavanopisto.muikku.plugins.chat;

import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import fi.otavanopisto.muikku.events.LoginEvent;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.users.UserEntityController;

@WebListener
public class ChatSessionListener implements HttpSessionListener {

  @Inject
  private HttpServletRequest httpRequest;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private ChatController chatController;

  public void onLogin(@Observes LoginEvent loginEvent) {
    HttpSession session = httpRequest.getSession(false);
    if (session != null) {
      UserEntity userEntity = userEntityController.findUserEntityById(loginEvent.getUserEntityId());
      chatController.processSessionCreated(userEntity, session.getId());
    }
  }
  
  @Override
  public void sessionDestroyed(HttpSessionEvent se) {
    chatController.processSessionDestroyed(se.getSession().getId());
  }

}
