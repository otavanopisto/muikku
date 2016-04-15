package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;

public class Workspace {

  public Workspace() {
  }

  public Workspace(Long id, String urlName, WorkspaceAccess access, Boolean archived, Boolean published, String name, String nameExtension, String description, String materialDefaultLicense, Long numVisits, Date lastVisit) {
    super();
    this.id = id;
    this.urlName = urlName;
    this.materialDefaultLicense = materialDefaultLicense;
    this.archived = archived;
    this.access = access;
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
  
  public WorkspaceAccess getAccess() {
    return access;
  }
  
  public void setAccess(WorkspaceAccess access) {
    this.access = access;
  }
  
  public String getMaterialDefaultLicense() {
    return materialDefaultLicense;
  }
  
  public void setMaterialDefaultLicense(String materialDefaultLicense) {
    this.materialDefaultLicense = materialDefaultLicense;
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
  private WorkspaceAccess access;
  private String materialDefaultLicense;
  private Boolean published;
}
