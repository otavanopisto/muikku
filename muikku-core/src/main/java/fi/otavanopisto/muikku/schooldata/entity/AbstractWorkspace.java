package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractWorkspace implements Workspace {
  
  public AbstractWorkspace() {
  }
  
  public AbstractWorkspace(String identifier, String name, String nameExtension, String viewLink,
      SchoolDataIdentifier workspaceTypeId, String courseIdentifierIdentifier, String description,
      String subjectIdentifier, SchoolDataIdentifier educationTypeIdentifier, Date modified, Double length, String lengthUnitIdentifier,
      OffsetDateTime beginDate, OffsetDateTime endDate, boolean archived, boolean evaluationFeeApplicable) {
    super();
    this.identifier = identifier;
    this.name = name;
    this.nameExtension = nameExtension;
    this.viewLink = viewLink;
    this.workspaceTypeId = workspaceTypeId;
    this.courseIdentifierIdentifier = courseIdentifierIdentifier;
    this.description = description;
    this.subjectIdentifier = subjectIdentifier;
    this.educationTypeIdentifier = educationTypeIdentifier;
    this.modified = modified;
    this.length = length;
    this.lengthUnitIdentifier = lengthUnitIdentifier;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.archived = archived;
    this.evaluationFeeApplicable = evaluationFeeApplicable;
  }
  
  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void setName(String name) {
    this.name = name;
  }

  public String getNameExtension() {
    return nameExtension;
  }

  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }
  
  @Override
  public SchoolDataIdentifier getWorkspaceTypeId() {
    return workspaceTypeId;
  }
  
  @Override
  public void setWorkspaceTypeId(SchoolDataIdentifier workspaceTypeId) {
    this.workspaceTypeId = workspaceTypeId;
  }

  @Override
  public String getCourseIdentifierIdentifier() {
    return courseIdentifierIdentifier;
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public Date getLastModified() {
    return modified;
  }

  @Override
  public String getSearchId() {
    return getIdentifier() + '/' + getSchoolDataSource();
  }
  
  @Override
  public String getSubjectIdentifier() {
    return subjectIdentifier;
  }

  @Override
  public SchoolDataIdentifier getEducationTypeIdentifier() {
    return educationTypeIdentifier;
  }
  
  @Override
  public Double getLength() {
    return length;
  }
  
  @Override
  public String getLengthUnitIdentifier() {
    return lengthUnitIdentifier;
  }
  
  @Override
  public OffsetDateTime getBeginDate() {
    return beginDate;
  }
  
  @Override
  public void setBeginDate(OffsetDateTime beginDate) {
    this.beginDate = beginDate; 
  }
  
  @Override
  public OffsetDateTime getEndDate() {
    return endDate;
  }
  
  @Override
  public void setEndDate(OffsetDateTime endDate) {
    this.endDate = endDate;
  }
  
  @Override
  public boolean isArchived() {
    return archived;
  }
  
  @Override
  public boolean isEvaluationFeeApplicable() {
    return evaluationFeeApplicable;
  }

  @Override
  public String getViewLink() {
    return viewLink;
  }

  private String identifier;
  private String name;
  private String nameExtension;
  private String viewLink;
  private SchoolDataIdentifier workspaceTypeId;
  private String courseIdentifierIdentifier;
  private String description;
  private String subjectIdentifier;
  private SchoolDataIdentifier educationTypeIdentifier;
  private Date modified;
  private Double length;
  private String lengthUnitIdentifier;
  private OffsetDateTime beginDate;
  private OffsetDateTime endDate;
  private boolean archived;
  private boolean evaluationFeeApplicable;
}
