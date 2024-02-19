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
  
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Boolean getCanSignup() {
    return canSignup;
  }

  public void setCanSignup(Boolean canSignup) {
    this.canSignup = canSignup;
  }

  private Long id;
  private String name;
  private String subject;
  private String urlName;
  private Integer courseNumber;
  private String type; // optional/next
  private Boolean hasCustomImage;
  private String nameExtension;
  private String description;
  private Boolean canSignup;

}
