package fi.otavanopisto.muikku.plugins.announcer.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;

@Entity
public class AnnouncementWorkspace {

  public Long getId() {
    return id;
  }

  public boolean isArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }

  public Announcement getAnnouncement() {
    return announcement;
  }

  public void setAnnouncement(Announcement announcement) {
    this.announcement = announcement;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (nullable=false)
  private boolean archived;
  
  @Column (nullable=false)
  @NotNull
  private Long workspaceEntityId;
  
  @ManyToOne(optional=false)
  @NotNull
  private Announcement announcement;
}
