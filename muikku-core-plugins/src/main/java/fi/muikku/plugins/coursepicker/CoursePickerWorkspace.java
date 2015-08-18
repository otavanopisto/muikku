package fi.muikku.plugins.coursepicker;

import java.util.Date;

public class CoursePickerWorkspace {

  public CoursePickerWorkspace() {
  }

  public CoursePickerWorkspace(Long id, String urlName, Boolean archived, Boolean published, String name, String description, Long numVisits, Date lastVisit, boolean canSignup) {
    super();
    this.id = id;
    this.urlName = urlName;
    this.archived = archived;
    this.published = published;
    this.name = name;
    this.description = description;
    this.numVisits = numVisits;
    this.lastVisit = lastVisit;
    this.canSignup = canSignup;
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

  public Boolean getCanSignup() {
    return canSignup;
  }

  public void setCanSignup(Boolean canSignup) {
    this.canSignup = canSignup;
  }

  private Long id;
  private String urlName;
  private Boolean archived;
  private String name;
  private String description;
  private Long numVisits;
  private Date lastVisit;
  private Boolean published;
  private Boolean canSignup;
}
