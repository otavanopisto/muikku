package fi.otavanopisto.muikku.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.faces.application.FacesMessage;
import javax.faces.application.FacesMessage.Severity;
import javax.faces.context.FacesContext;

public class FacesUtils {

  public static final String POST_REDIRECT_SESSION_KEY = "_POST_REDIRECT_SESSION_KEY_";

  public static void addMessage(Severity severity, String message) {
    FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(severity, message, null));
  }

  public static void addPostRedirectMessage(Severity severity, String message) {
    FacesContext facesContext = FacesContext.getCurrentInstance();
    Map<String, Object> sessionMap = facesContext.getExternalContext().getSessionMap();
    @SuppressWarnings("unchecked")
    List<FacesMessage> messages = (List<FacesMessage>) sessionMap.get(POST_REDIRECT_SESSION_KEY);
    if (messages == null) {
      messages = new ArrayList<>();
      sessionMap.put(POST_REDIRECT_SESSION_KEY, messages);
    }

    messages.add(new FacesMessage(severity, message, null));
  }

}
