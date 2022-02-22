package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface User extends SchoolDataEntity {

  public String getIdentifier();

  public String getFirstName();

  public void setFirstName(String firstName);

  public String getLastName();

  public void setLastName(String lastName);
  
  public String getDisplayName();
  
  public String getStudyProgrammeName();

  public SchoolDataIdentifier getStudyProgrammeIdentifier();
  
  public String getNationality();
  
  public void setNationality(String nationality);
  
  public String getLanguage();
  
  public void setLanguage(String language);
  
  public String getMunicipality();
  
  public void setMunicipality(String municipality);
  
  public String getSchool();
  
  public void setSchool(String school);

  public String getSearchId();

  public OffsetDateTime getStudyStartDate();

  public OffsetDateTime getStudyEndDate();
  
  public OffsetDateTime getStudyTimeEnd();

  public boolean getHidden();
  
  public boolean getHasEvaluationFees();
  
  public String getCurriculumIdentifier();
  
  public SchoolDataIdentifier getOrganizationIdentifier();
  
  public void setNickName(String nickName);

  public String getNickName();  
}