package fi.otavanopisto.muikku.search;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;

public class IndexedWorkspaceSubject {

  @IndexField (toId = true)
  public SchoolDataIdentifier getSubjectIdentifier() {
    return subjectIdentifier;
  }
  
  public void setSubjectIdentifier(SchoolDataIdentifier subjectIdentifier) {
    this.subjectIdentifier = subjectIdentifier;
  }
  
  public String getSubjectName() {
    return subjectName;
  }
  
  public void setSubjectName(String subjectName) {
    this.subjectName = subjectName;
  }
  
  public Integer getCourseNumber() {
    return courseNumber;
  }
  
  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }
  
  public Double getLength() {
    return length;
  }
  
  public void setLength(Double length) {
    this.length = length;
  }
  
  @IndexField (toId = true)
  public SchoolDataIdentifier getLengthUnitIdentifier() {
    return lengthUnitIdentifier;
  }
  
  public void setLengthUnitIdentifier(SchoolDataIdentifier lengthUnitIdentifier) {
    this.lengthUnitIdentifier = lengthUnitIdentifier;
  }
  
  private SchoolDataIdentifier subjectIdentifier;
  private String subjectName;
  private Integer courseNumber;
  private Double length;
  private SchoolDataIdentifier lengthUnitIdentifier;
}
