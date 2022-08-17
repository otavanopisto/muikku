package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;

public class PyramusWorkspaceSubject implements WorkspaceSubject {

  public PyramusWorkspaceSubject(
      SchoolDataIdentifier identifier,
      SchoolDataIdentifier subjectIdentifier, 
      Integer courseNumber, 
      Double length,
      SchoolDataIdentifier lengthUnitIdentifier) {
    super();
    this.identifier = identifier;
    this.subjectIdentifier = subjectIdentifier;
    this.courseNumber = courseNumber;
    this.length = length;
    this.lengthUnitIdentifier = lengthUnitIdentifier;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public SchoolDataIdentifier getSubjectIdentifier() {
    return subjectIdentifier;
  }

  @Override
  public Integer getCourseNumber() {
    return courseNumber;
  }

  @Override
  public Double getLength() {
    return length;
  }

  @Override
  public SchoolDataIdentifier getLengthUnitIdentifier() {
    return lengthUnitIdentifier;
  }

  private SchoolDataIdentifier identifier;
  private SchoolDataIdentifier subjectIdentifier;
  private Integer courseNumber;
  private Double length;
  private SchoolDataIdentifier lengthUnitIdentifier;
}
