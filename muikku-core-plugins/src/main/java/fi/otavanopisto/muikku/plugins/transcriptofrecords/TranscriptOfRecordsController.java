package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.util.regex.Pattern;

import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;

public class TranscriptOfRecordsController {

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  private static final Pattern UPPER_SECONDARY_SCHOOL_SUBJECT_PATTERN = Pattern.compile("^[A-ZÅÄÖ0-9]+$");

  public boolean subjectAppliesToStudent(User student, Subject subject) {
    if (subject.getCode() == null) {
      return false;
    }
    
    if (!UPPER_SECONDARY_SCHOOL_SUBJECT_PATTERN.matcher(subject.getCode()).matches()) {
      return false;
    }

    String mathSyllabus = loadStringProperty(student, "mathSyllabus");
    String finnish = loadStringProperty(student, "finnish");
    boolean german = loadBoolProperty(student, "german");
    boolean french = loadBoolProperty(student, "french");
    boolean italian = loadBoolProperty(student, "italian");
    boolean spanish = loadBoolProperty(student, "spanish");
    String religion = loadStringProperty(student, "religion");

    String code = subject.getCode();

    if ("MAA".equals(mathSyllabus) && "MAB".equals(code)) {
      return false;
    }

    if ("MAB".equals(mathSyllabus) && "MAA".equals(code)) {
      return false;
    }

    if ("S2".equals(finnish) && "AI".equals(code)) {
      return false;
    }

    if ("AI".equals(finnish) && "S2".equals(code)) {
      return false;
    }

    if (!german && subject.getCode().startsWith("SA")) {
      return false;
    }

    if (!french && subject.getCode().startsWith("RA")) {
      return false;
    }

    if (!italian && subject.getCode().startsWith("IT")) {
      return false;
    }

    if (!spanish && subject.getCode().startsWith("ES")) {
      return false;
    }

    if ("UX".equals(religion) && ("UE".equals(code) || "ET".equals(code))) {
      return false;
    }

    if ("UE".equals(religion) && ("UX".equals(code) || "ET".equals(code))) {
      return false;
    }

    if ("ET".equals(religion) && ("UE".equals(code) || "UX".equals(code))) {
      return false;
    }

    return true;
  }

  public String loadStringProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return property.getValue();
    } else {
      return null;
    }
  }

  public boolean loadBoolProperty(User user, String propertyName) {
    UserProperty property = userSchoolDataController.getUserProperty(user, "hops." + propertyName);
    if (property != null) {
      return "yes".equals(property.getValue());
    } else {
      return false;
    }
  }


  public void saveStringProperty(User user, String propertyName, String value) {
    if (value != null && !"".equals(value)) {
      userSchoolDataController.setUserProperty(user, "hops." + propertyName, value);
    }
  }

  public void saveBoolProperty(User user, String propertyName, boolean value) {
    userSchoolDataController.setUserProperty(user, "hops." + propertyName, value ? "yes" : "no");
  }


}
