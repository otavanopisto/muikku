package fi.muikku.plugins.material.coops;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;

import fi.muikku.plugins.material.coops.model.CoOpsSession;

@Stateless
public class CoOpsSessionEventsController {

  public List<Object> createSessionEvents(List<CoOpsSession> sessions, String status) {
    List<Object> result = new ArrayList<Object>();
    
    for (CoOpsSession session : sessions) {
      String sessionId = session.getSessionId();
      String email = sessionId + "@nomail.invalid";
      result.add(new CoOpsSessionEvent(sessionId, sessionId, email, status));
    }
    
    return result;
  }
  
}
