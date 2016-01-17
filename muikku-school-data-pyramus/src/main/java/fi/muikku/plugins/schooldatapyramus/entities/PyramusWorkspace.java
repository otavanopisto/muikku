package fi.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.Workspace;

public class PyramusWorkspace implements Workspace {

  public PyramusWorkspace(String identifier, String name, String nameExtension, String viewLink, String description, 
      String workspaceTypeId, String courseIdentifierIdentifier, Date modified, String subjectIdentifier, 
      String educationTypeIdentifier,  Double length, String lengthUnitIdentifier, DateTime beginDate, 
      DateTime endDate, boolean archived, boolean evaluationFeeApplicable) {
    this.identifier = identifier;
    this.name = name;
    this.nameExtension = nameExtension;
    this.viewLink = viewLink;
    this.description = description;
    this.workspaceTypeId = workspaceTypeId;
    this.courseIdentifierIdentifier = courseIdentifierIdentifier;
    this.modified = modified;
    this.subjectIdentifier = subjectIdentifier;
    this.educationTypeIdentifier = educationTypeIdentifier;
    this.length = length;
    this.lengthUnitIdentifier = lengthUnitIdentifier;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.archived = archived;
    this.evaluationFeeApplicable = evaluationFeeApplicable;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
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
  public String getWorkspaceTypeId() {
    return workspaceTypeId;
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
  public String getEducationTypeIdentifier() {
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
  public DateTime getBeginDate() {
    return beginDate;
  }
  
  @Override
  public void setBeginDate(DateTime beginDate) {
    this.beginDate = beginDate; 
  }
  
  @Override
  public DateTime getEndDate() {
    return endDate;
  }
  
  @Override
  public void setEndDate(DateTime endDate) {
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
  
  private String workspaceTypeId;

  private String courseIdentifierIdentifier;

  private String description;
  
  private String subjectIdentifier;

  private String educationTypeIdentifier;

  private Date modified;
  
  private Double length;
  
  private String lengthUnitIdentifier;
  
  private DateTime beginDate;
  
  private DateTime endDate;
  
  private boolean archived;
  
  private boolean evaluationFeeApplicable;
}
