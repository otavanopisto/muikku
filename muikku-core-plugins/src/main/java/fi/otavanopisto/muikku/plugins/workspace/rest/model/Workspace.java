package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class Workspace {

  public Workspace() {
  }

  public Workspace(Long id, String urlName, Boolean archived, Boolean published, String name, String nameExtension, String description) {
    this(id, urlName, archived, published, name, nameExtension, description, 0l, null);
  }

  public Workspace(Long id, String urlName, Boolean archived, Boolean published, String name, String nameExtension, String description, Long numVisits, Date lastVisit) {
    super();
    this.id = id;
    this.urlName = urlName;
    this.archived = archived;
    this.published = published;
    this.name = name;
    this.nameExtension = nameExtension;
    this.description = description;
    this.numVisits = numVisits;
    this.lastVisit = lastVisit;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUrlName() {
    return urlName;
  }

  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Long getNumVisits() {
    return numVisits;
  }

  public void setNumVisits(Long numVisits) {
    this.numVisits = numVisits;
  }

  public Date getLastVisit() {
    return lastVisit;
  }

  public void setLastVisit(Date lastVisit) {
    this.lastVisit = lastVisit;
  }
  
  public Boolean getPublished() {
    return published;
  }
  
  public void setPublished(Boolean published) {
    this.published = published;
  }
  
  public String getNameExtension() {
    return nameExtension;
  }
  
  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }

  private Long id;
  private String urlName;
  private Boolean archived;
  private String name;
  private String nameExtension;
  private String description;
  private Long numVisits;
  private Date lastVisit;
  private Boolean published;
}
