package fi.otavanopisto.muikku.plugins.hops.rest;

public class SuggestedWorkspaceRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }
  
  public String getUrlName() {
    return urlName;
  }
  
  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }

  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }
  
  public String getType() {
    return type;
  }
  
  public void setType(String type) {
    this.type = type;
  }
  
  public Boolean getHasCustomImage() {
    return hasCustomImage;
  }
  
  public void setHasCustomImage(Boolean hasCustomImage) {
    this.hasCustomImage = hasCustomImage;
  }
  
  public String getNameExtension() {
    return nameExtension;
  }
  
  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }
  
  public String getCourseType() {
    return courseType;
  }
  
  public void setCourseType(String courseType) {
    this.courseType = courseType;
  }
  
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
  
  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  private Long id;
  private String name;
  private String subject;
  private String urlName;
  private Integer courseNumber;
  private String type; // optional/next
  private Boolean hasCustomImage;
  private String nameExtension;
  private String courseType; // ryhmäkurssi/non-stop
  private String description;
  private Long workspaceId;

}
