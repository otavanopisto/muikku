package fi.otavanopisto.muikku.plugins.announcer.rest;

import java.util.List;

public class AnnouncementWithUnreadsRESTModel {

  public int getUnreadCount() {
    return unreadCount;
  }

  public void setUnreadCount(int unreadCount) {
    this.unreadCount = unreadCount;
  }


  public List<AnnouncementRESTModel> getAnnouncements() {
    return announcements;
  }

  public void setAnnouncements(List<AnnouncementRESTModel> announcements) {
    this.announcements = announcements;
  }

  private int unreadCount;
  private List<AnnouncementRESTModel> announcements;
}
