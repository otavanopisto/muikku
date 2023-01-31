package fi.otavanopisto.muikku.plugins.forum.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.util.ArchivableEntity;

@Entity
public class ForumAreaGroup implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
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
  
  @NotEmpty
  private String name;

  @NotNull
  @Column(nullable = false)
  private Boolean archived;
}
