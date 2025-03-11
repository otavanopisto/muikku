package fi.otavanopisto.muikku.plugins.coursepicker;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;

public class CoursePickerWorkspace {

  public CoursePickerWorkspace() {
  }

  public CoursePickerWorkspace(
      Long id,
      String urlName,
      Boolean archived,
      Boolean published,
      String name,
      String nameExtension,
      String description,
      Long numVisits,
      Date lastVisit,
      String educationTypeName,
      Mandatority mandatority,
      boolean isCourseMember, 
      boolean hasCustomImage,
      OrganizationRESTModel organization,
      List<String> curriculumIdentifiers,
      Double courseLength,
      String courseLengthSymbol) {
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
    this.isCourseMember = isCourseMember;
    this.educationTypeName = educationTypeName;
    this.mandatority = mandatority;
    this.hasCustomImage = hasCustomImage;
    this.organization = organization;
    this.curriculumIdentifiers = curriculumIdentifiers;
    this.courseLength = courseLength;
    this.courseLengthSymbol = courseLengthSymbol;
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
  
  public Boolean getIsCourseMember() {
    return isCourseMember;
  }

  public void setIsCourseMember(Boolean isCourseMember) {
    this.isCourseMember = isCourseMember;
  }

  public String getEducationTypeName() {
    return educationTypeName;
  }
  
  public void setEducationTypeName(String educationTypeName) {
    this.educationTypeName = educationTypeName;
  }
  
  public Mandatority getMandatority() {
    return mandatority;
  }
  
  public void setMandatority(Mandatority mandatority) {
    this.mandatority = mandatority;
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

  public List<String> getCurriculumIdentifiers() {
    return curriculumIdentifiers;
  }

  public void setCurriculumIdentifiers(List<String> curriculumIdentifiers) {
    this.curriculumIdentifiers = curriculumIdentifiers;
  }

  public Double getCourseLength() {
    return courseLength;
  }

  public void setCourseLength(Double courseLength) {
    this.courseLength = courseLength;
  }

  public String getCourseLengthSymbol() {
    return courseLengthSymbol;
  }

  public void setCourseLengthSymbol(String courseLengthSymbol) {
    this.courseLengthSymbol = courseLengthSymbol;
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
  private Boolean isCourseMember;
  private String educationTypeName;
  private Mandatority mandatority;
  private boolean hasCustomImage;
  private OrganizationRESTModel organization;
  private List<String> curriculumIdentifiers;
  private Double courseLength;
  private String courseLengthSymbol;

}
