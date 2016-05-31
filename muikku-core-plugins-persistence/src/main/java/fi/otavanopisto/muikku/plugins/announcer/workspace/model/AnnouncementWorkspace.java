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

  public Announcement getAnnouncement() {
    return announcement;
  }

  public void setAnnouncement(Announcement announcement) {
    this.announcement = announcement;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
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
  private Long workspaceEntityId;

  @ManyToOne(optional=false)
  @NotNull
  private Announcement announcement;
}
