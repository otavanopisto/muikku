package fi.otavanopisto.muikku.plugins.announcer.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint( columnNames = {"userEntityId", "announcement_id"} )
  })

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

  public boolean isPinned() {
    return pinned;
  }

  public void setPinned(boolean pinned) {
    this.pinned = pinned;
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
  
  @Column
  @Temporal (value = TemporalType.TIMESTAMP)
  private Date readDate;
  
  @Column (nullable=false)
  private boolean pinned;
}
