package fi.otavanopisto.muikku.search;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;

@Indexable (
  // Names are technically not used as this entity should never be indexed on its own
  indexName = "muikku",
  typeName = "IndexedWorkspaceSubject",
  options = {
    @IndexableFieldOption (
      name = "subjectIdentifier",
      type = "multi_field",
      multiFields = {
        @IndexableFieldMultiField(name = "identifier", type="string", index = "analyzed"),
        @IndexableFieldMultiField(name = "untouched", type="string", index = "not_analyzed")
      }
    ),
    @IndexableFieldOption (
      name = "lengthUnitIdentifier",
      type = "multi_field",
      multiFields = {
        @IndexableFieldMultiField(name = "identifier", type="string", index = "analyzed"),
        @IndexableFieldMultiField(name = "untouched", type="string", index = "not_analyzed")
      }
    )
  }
)
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
