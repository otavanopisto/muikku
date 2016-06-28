package fi.otavanopisto.muikku.plugins.timed.notifications;

public interface TimedNotificationStrategy {
  public long getDuration();
  public void sendNotifications();
  public boolean isActive();
}
