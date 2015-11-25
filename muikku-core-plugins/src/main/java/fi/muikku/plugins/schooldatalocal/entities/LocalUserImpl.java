package fi.muikku.plugins.schooldatalocal.entities;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.entity.AbstractUser;
import fi.muikku.schooldata.entity.User;

public class LocalUserImpl  extends AbstractUser implements User {

  public LocalUserImpl(String identifier,
                     String firstName,
                     String lastName,
                     String displayName,
                     String studyProgrammeName,
                     String nationality,
                     String language,
                     String municipality,
                     String school) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgrammeName = studyProgrammeName;
    this.displayName = displayName;
    this.nationality = nationality;
    this.municipality = municipality;
    this.language = language;
    this.school = school;
  }

  @Override
  public String getSchoolDataSource() {
    return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
}

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  @Override
  public String getFirstName() {
    return firstName;
  }

  @Override
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  @Override
  public String getLastName() {
    return lastName;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }
  
  @Override
  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getMunicipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  public DateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(DateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public DateTime getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(DateTime studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
  }

  @Override
  public boolean getHidden() {
    return false;
  }

  private String identifier;
  private String firstName;
  private String lastName;
  private String displayName;
  private String studyProgrammeName;
  private String nationality;
  private String language;
  private String municipality;
  private String school;
  private DateTime studyStartDate;
  private DateTime studyTimeEnd;
}
