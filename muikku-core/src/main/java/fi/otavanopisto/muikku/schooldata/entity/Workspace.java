package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface Workspace extends SchoolDataEntity {

  public String getIdentifier();

  public String getName();

  public void setName(String name);
  
  public String getNameExtension();
  
  public void setNameExtension(String name);

  public String getDescription();

  public void setDescription(String description);

  public OffsetDateTime getBeginDate();
  
  public void setBeginDate(OffsetDateTime beginDate);

  public OffsetDateTime getEndDate();
  
  public void setEndDate(OffsetDateTime endDate);

  public SchoolDataIdentifier getWorkspaceTypeId();
  public void setWorkspaceTypeId(SchoolDataIdentifier workspaceTypeId);

  public Date getLastModified();

  public SchoolDataIdentifier getEducationTypeIdentifier();

  public SchoolDataIdentifier getEducationSubtypeIdentifier();

  public SchoolDataIdentifier getOrganizationIdentifier();

  public boolean isArchived();
  
  public String getViewLink();
  
  public boolean isTemplate();

  public String getSearchId();

  public Set<SchoolDataIdentifier> getCurriculumIdentifiers();
  
  public List<WorkspaceSubject> getSubjects();
}
