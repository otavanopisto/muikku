package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.util.Objects;

import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

public class VopsController {
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  public boolean subjectAppliesToStudent(User student, Subject subject) {
    
    if (subject.getCode() == null) {
      return false;
    }
    
    if ("RUB".equals(subject.getCode())) {
      return true;
    }
    
    String mathSyllabus = loadStringProperty(student, "mathSyllabus");
    String finnish = loadStringProperty(student, "finnish");
    boolean swedish = loadBoolProperty(student, "swedish");
    boolean english = loadBoolProperty(student, "english");
    boolean german = loadBoolProperty(student, "german");
    boolean french = loadBoolProperty(student, "french");
    boolean italian = loadBoolProperty(student, "italian");
    boolean spanish = loadBoolProperty(student, "spanish");
    String science = loadStringProperty(student, "science");
    String religion = loadStringProperty(student, "religion");
    
    if (Objects.equals(subject.getCode(), mathSyllabus)) {
      return true;
    }
    
    if (Objects.equals(subject.getCode(), finnish)) {
      return true;
    }
    
    if (german && subject.getCode().startsWith("SA")) {
      return true;
    }
   
    if (french && subject.getCode().startsWith("RA")) {
      return true;
    }
   
    if (italian && subject.getCode().startsWith("IT")) {
      return true;
    }
   
    if (spanish && subject.getCode().startsWith("ES")) {
      return true;
    }
    
    if (Objects.equals(subject.getCode(), religion)) {
      return true;
    }
    
    return false;
  }
  
  private String loadStringProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return property.getValue();
    } else {
      return null;
    }
  }

  private boolean loadBoolProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return "yes".equals(property.getValue());
    } else {
      return false;
    }
  }

}
