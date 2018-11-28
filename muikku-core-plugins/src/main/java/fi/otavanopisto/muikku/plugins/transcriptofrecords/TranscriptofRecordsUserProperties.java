package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import fi.otavanopisto.muikku.plugins.transcriptofrecords.subjects.StudentMatriculationSubjects;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

public class TranscriptofRecordsUserProperties {
  
  public TranscriptofRecordsUserProperties(List<UserProperty> properties, StudentMatriculationSubjects studentMatriculationSubjects) {
    this.studentMatriculationSubjects = studentMatriculationSubjects;
    map(properties);
  }
  
  /**
   * Returns student's selected matriculation subjects
   * 
   * @return student's selected matriculation subjects
   */
  public StudentMatriculationSubjects getStudentMatriculationSubjects() {
    return studentMatriculationSubjects;
  }

  private void map(List<UserProperty> properties) {
    for (UserProperty property : properties) {
      this.properties.put(property.getKey(), property);
    }
  }

  public String asString(String key) {
    UserProperty property = properties.get("hops." + key);
    if (property != null) {
      return property.getValue();
    } else {
      return null;
    }
  }
  
  public boolean asBoolean(String key) {
    UserProperty property = properties.get("hops." + key);
    if (property != null) {
      return "yes".equals(property.getValue());
    } else {
      return false;
    }
  }
  
  private Map<String, UserProperty> properties = new HashMap<>();
  private StudentMatriculationSubjects studentMatriculationSubjects;
}
