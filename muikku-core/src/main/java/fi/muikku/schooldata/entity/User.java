package fi.muikku.schooldata.entity;

import org.joda.time.DateTime;

import fi.muikku.search.annotations.IndexId;
import fi.muikku.search.annotations.Indexable;

@Indexable
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

  DateTime getStudyStartDate();

  DateTime getStudyTimeEnd();

  boolean getHidden();
  
  boolean hasEvaluationFees();
  
}