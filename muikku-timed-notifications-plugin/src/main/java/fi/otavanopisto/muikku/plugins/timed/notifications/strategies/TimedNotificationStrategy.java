package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

public interface TimedNotificationStrategy {
  public long getDuration();
  public void sendNotifications();
  public boolean isActive();
}
