package fi.otavanopisto.muikku.search;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

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
  
  public String getSubjectCode() {
    return subjectCode;
  }

  public void setSubjectCode(String subjectCode) {
    this.subjectCode = subjectCode;
  }

  public String getLengthUnitSymbol() {
    return lengthUnitSymbol;
  }

  public void setLengthUnitSymbol(String lengthUnitSymbol) {
    this.lengthUnitSymbol = lengthUnitSymbol;
  }

  public String getLengthUnitName() {
    return lengthUnitName;
  }

  public void setLengthUnitName(String lengthUnitName) {
    this.lengthUnitName = lengthUnitName;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  public void setIdentifier(SchoolDataIdentifier identifier) {
    this.identifier = identifier;
  }

  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier identifier;
  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier subjectIdentifier;
  private String subjectName;
  private String subjectCode;
  private Integer courseNumber;
  private Double length;
  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier lengthUnitIdentifier;
  private String lengthUnitSymbol;
  private String lengthUnitName;
}
