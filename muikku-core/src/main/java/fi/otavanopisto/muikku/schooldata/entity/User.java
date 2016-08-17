package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;

@Indexable (name = "User")
public interface User extends SchoolDataEntity {

  public String getIdentifier();

  public String getFirstName();

  public void setFirstName(String firstName);

  public String getLastName();

  public void setLastName(String lastName);

  public String getDisplayName();
  
  public String getStudyProgrammeName();
  
  public String getNationality();
  
  public void setNationality(String nationality);
  
  public String getLanguage();
  
  public void setLanguage(String language);
  
  public String getMunicipality();
  
  public void setMunicipality(String municipality);
  
  public String getSchool();
  
  public void setSchool(String school);

  @IndexId
  public String getSearchId();

  public OffsetDateTime getStudyStartDate();

  public OffsetDateTime getStudyEndDate();
  
  public OffsetDateTime getStudyTimeEnd();

  public boolean getHidden();
  
  public boolean getStartedStudies();
  
  public boolean getFinishedStudies();
  
  public boolean getActive();
  
  public boolean hasEvaluationFees();
  
}