package fi.otavanopisto.muikku.plugins.announcer.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class AnnouncementRecipient {

  public Long getId() {
    return id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Announcement getAnnouncement() {
    return announcement;
  }

  public void setAnnouncement(Announcement announcement) {
    this.announcement = announcement;
  }

  public Date getReadDate() {
    return readDate;
  }

  public void setReadDate(Date readDate) {
    this.readDate = readDate;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable=false)
  @NotNull
  private Long userEntityId;
  
  @ManyToOne(optional=false)
  @NotNull
  private Announcement announcement;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.DATE)
  private Date readDate;
}
