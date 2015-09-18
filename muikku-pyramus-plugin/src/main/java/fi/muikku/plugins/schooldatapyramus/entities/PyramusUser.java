package fi.muikku.plugins.schooldatapyramus.entities;

import org.joda.time.DateTime;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.User;

public class PyramusUser implements User {

  public PyramusUser(String identifier,
                     String firstName,
                     String lastName,
                     String displayName,
                     String studyProgrammeName,
                     String nationality,
                     String language,
                     String municipality,
                     String school,
                     DateTime studyStartDate,
                     DateTime studyTimeEnd) {
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this.studyProgrammeName = studyProgrammeName;
    this.nationality = nationality;
    this.municipality = municipality;
    this.language = language;
    this.school = school;
    this.studyStartDate = studyStartDate;
    this.studyTimeEnd = studyTimeEnd;
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
  
  @Override
  public String getSearchId() {
    return getIdentifier() + "/" + getSchoolDataSource();
  }

  @Override
  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  @Override
  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  @Override
  public String getMunicipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  @Override
  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  @Override
  public DateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(DateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  @Override
  public DateTime getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(DateTime studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
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
