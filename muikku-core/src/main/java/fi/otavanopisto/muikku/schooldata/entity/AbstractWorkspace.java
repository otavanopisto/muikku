package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractWorkspace implements Workspace {
  
  public AbstractWorkspace() {
    this.subjects = new ArrayList<>();
  }
  
  public AbstractWorkspace(SchoolDataIdentifier identifier, String name, String nameExtension, String viewLink,
      SchoolDataIdentifier workspaceTypeId, String description, SchoolDataIdentifier educationTypeIdentifier, Date modified, 
      OffsetDateTime beginDate, OffsetDateTime endDate, boolean archived, Set<SchoolDataIdentifier> curriculumIdentifiers, 
      SchoolDataIdentifier educationSubtypeIdentifier, SchoolDataIdentifier organizationIdentifier, boolean isTemplate, List<WorkspaceSubject> subjects) {
    super();
    this.identifier = identifier.getIdentifier();
    this.dataSource = identifier.getDataSource();
    this.name = name;
    this.nameExtension = nameExtension;
    this.viewLink = viewLink;
    this.workspaceTypeId = workspaceTypeId;
    this.description = description;
    this.educationTypeIdentifier = educationTypeIdentifier;
    this.modified = modified;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.archived = archived;
    this.curriculumIdentifiers = curriculumIdentifiers;
    this.educationSubtypeIdentifier = educationSubtypeIdentifier;
    this.organizationIdentifier = organizationIdentifier;
    this.isTemplate = isTemplate;
    this.subjects = subjects;
  }
  
  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getSchoolDataSource() {
    return dataSource;
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
  public SchoolDataIdentifier getEducationTypeIdentifier() {
    return educationTypeIdentifier;
  }
  
  @Override
  public SchoolDataIdentifier getEducationSubtypeIdentifier() {
    return educationSubtypeIdentifier;
  }

  @Override
  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
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
  public String getViewLink() {
    return viewLink;
  }

  @Override
  public Set<SchoolDataIdentifier> getCurriculumIdentifiers() {
    return curriculumIdentifiers;
  }
  
  @Override
  public boolean isTemplate() {
    return isTemplate;
  }

  public void setSubjects(List<WorkspaceSubject> subjects) {
    this.subjects = subjects;
  }
  
  @Override
  public List<WorkspaceSubject> getSubjects() {
    return subjects;
  }

  private String identifier;
  private String dataSource;
  private String name;
  private String nameExtension;
  private String viewLink;
  private SchoolDataIdentifier workspaceTypeId;
  private String description;
  private SchoolDataIdentifier educationTypeIdentifier;
  private SchoolDataIdentifier educationSubtypeIdentifier;
  private SchoolDataIdentifier organizationIdentifier;
  private Date modified;
  private OffsetDateTime beginDate;
  private OffsetDateTime endDate;
  private boolean archived;
  private Set<SchoolDataIdentifier> curriculumIdentifiers;
  private boolean isTemplate;
  private List<WorkspaceSubject> subjects;
}
