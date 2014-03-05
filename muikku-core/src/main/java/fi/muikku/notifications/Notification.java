package fi.muikku.notifications;

import javax.faces.application.FacesMessage;

public class Notification extends FacesMessage {
  
  private static final long serialVersionUID = -1332821330587218960L;

  public Notification(NotificationSeverity severity, String message) {
    super(getMessageSeverity(severity), message, null);
    this.severity = severity;
  }
  
  public NotificationSeverity getNotificationSeverity() {
    return severity;
  }
  
  private static Severity getMessageSeverity(NotificationSeverity severity) {
    switch (severity) {
      case ERROR:
        return SEVERITY_ERROR;
      case FATAL:
        return SEVERITY_FATAL;
      case WARN:
        return SEVERITY_WARN;
      case INFO:
      case LOADING:
      case SUCCESS:
      break;
    }
    
    return SEVERITY_INFO;
  }
 
  private NotificationSeverity severity;
}