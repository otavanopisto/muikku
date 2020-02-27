package fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model;

import java.util.List;

import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;

public class OrganizationManagerWorkspace {

  public OrganizationManagerWorkspace() {
  }

  public OrganizationManagerWorkspace(
      Long id,
      String urlName,
      Boolean archived,
      Boolean published,
      String name,
      String nameExtension,
      String description,
      String educationTypeName,
      boolean hasCustomImage,
      OrganizationRESTModel organization,
      Long studentCount,
      List<OrganizationManagerWorkspaceTeacher> teachers) {
    super();
    this.id = id;
    this.urlName = urlName;
    this.archived = archived;
    this.published = published;
    this.name = name;
    this.nameExtension = nameExtension;
    this.description = description;
    this.educationTypeName = educationTypeName;
    this.hasCustomImage = hasCustomImage;
    this.organization = organization;
    this.studentCount = studentCount;
    this.teachers = teachers;
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

  public Boolean getPublished() {
    return published;
  }
  
  public void setPublished(Boolean published) {
    this.published = published;
  }

  public String getEducationTypeName() {
    return educationTypeName;
  }
  
  public void setEducationTypeName(String educationTypeName) {
    this.educationTypeName = educationTypeName;
  }
  
  public boolean getHasCustomImage() {
    return hasCustomImage;
  }

  public void setHasCustomImage(boolean hasCustomImage) {
    this.hasCustomImage = hasCustomImage;
  }

  public OrganizationRESTModel getOrganization() {
    return organization;
  }

  public void setOrganization(OrganizationRESTModel organization) {
    this.organization = organization;
  }

  public Long getStudentCount() {
    return studentCount;
  }

  public void setStudentCount(Long studentCount) {
    this.studentCount = studentCount;
  }

  public List<OrganizationManagerWorkspaceTeacher> getTeachers() {
    return teachers;
  }

  public void setTeachers(List<OrganizationManagerWorkspaceTeacher> teachers) {
    this.teachers = teachers;
  }

  private Long id;
  private String urlName;
  private Boolean archived;
  private String name;
  private String nameExtension;
  private String description;
  private Boolean published;
  private String educationTypeName;
  private boolean hasCustomImage;
  private OrganizationRESTModel organization;
  private Long studentCount;
  private List<OrganizationManagerWorkspaceTeacher> teachers;
}
