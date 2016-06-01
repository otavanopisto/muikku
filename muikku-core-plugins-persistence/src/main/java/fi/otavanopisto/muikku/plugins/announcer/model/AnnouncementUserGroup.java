package fi.otavanopisto.muikku.plugins.announcer.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class AnnouncementUserGroup {

  public Long getId() {
    return id;
  }

  public Long getUserGroupEntityId() {
    return userGroupEntityId;
  }

  public void setUserGroupEntityId(Long userGroupEntityId) {
    this.userGroupEntityId = userGroupEntityId;
  }

  public Announcement getAnnouncement() {
    return announcement;
  }

  public void setAnnouncement(Announcement announcement) {
    this.announcement = announcement;
  }
  
  public Boolean getArchived() {
    return archived;
  }
  
  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (nullable=false)
  private Boolean archived;
  
  @Column (nullable=false)
  @NotNull
  private Long userGroupEntityId;
  
  @ManyToOne(optional=false)
  @NotNull
  private Announcement announcement;
}
