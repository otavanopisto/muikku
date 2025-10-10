package fi.otavanopisto.muikku.plugins.announcer.rest;

import java.util.Date;

public class AnnouncementRecipientRESTModel {
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getAnnouncementId() {
    return announcementId;
  }

  public void setAnnouncementId(Long announcementId) {
    this.announcementId = announcementId;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Date getReadDate() {
    return readDate;
  }

  public void setReadDate(Date readDate) {
    this.readDate = readDate;
  }


  private Long id;
  private Long announcementId;
  private Long userEntityId;
  private Date readDate;
}
