package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.subjects.MatriculationSubjects;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.subjects.StudentMatriculationSubjects;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.StudentCourseStats;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.search.SearchProvider;

public class TranscriptOfRecordsController {

  private static final String MATRICULATION_SUBJECTS_PLUGIN_SETTING_KEY = "matriculation.subjects";
  private static final String USER_MATRICULATION_SUBJECTS_USER_PROPERTY = "hops.matriculation-subjects";

  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  public void saveStringProperty(User user, String propertyName, String value) {
    if (value != null && !"".equals(value)) {
      userSchoolDataController.setUserProperty(user, "hops." + propertyName, value);
    }
  }

  public void saveBoolProperty(User user, String propertyName, boolean value) {
    userSchoolDataController.setUserProperty(user, "hops." + propertyName, value ? "yes" : "no");
  }

  public TranscriptofRecordsUserProperties loadUserProperties(User user) {
    List<UserProperty> userProperties = userSchoolDataController.listUserProperties(user);

    StudentMatriculationSubjects studentMatriculationSubjects = unserializeStudentMatriculationSubjects(userProperties.stream()
      .filter(userProperty -> USER_MATRICULATION_SUBJECTS_USER_PROPERTY.equals(userProperty.getKey()))
      .findFirst()
      .orElse(null));

    return new TranscriptofRecordsUserProperties(userProperties, studentMatriculationSubjects);
  }

  /**
   * Returns a list of configured matriculation subjects.
   *
   * @return list of configured matriculation subjects or empty list if setting is not configured.
   */
  public MatriculationSubjects listMatriculationSubjects() {
    String subjectsJson = pluginSettingsController.getPluginSetting("transcriptofrecords", MATRICULATION_SUBJECTS_PLUGIN_SETTING_KEY);
    if (StringUtils.isNotBlank(subjectsJson)) {
      return unserializeObject(subjectsJson, MatriculationSubjects.class);
    }

    return unserializeObject(getClass().getClassLoader().getResourceAsStream("fi/otavanopisto/muikku/plugins/transcriptofrecords/default-matriculation-subjects.json"), MatriculationSubjects.class);
  }

  /**
   * Saves a list of student's matriculation subjects
   *
   * @param student student
   * @param matriculationSubjects list of student's matriculation subjects
   */
  public void saveStudentMatriculationSubjects(User student, StudentMatriculationSubjects matriculationSubjects) {
    userSchoolDataController.setUserProperty(student, USER_MATRICULATION_SUBJECTS_USER_PROPERTY, serializeObject(matriculationSubjects));
  }

  /**
   * Unserializes student's matriculation subjects from user property
   *
   * @param userProperty user property
   * @return unserialized student's matriculation subjects
   */
  private StudentMatriculationSubjects unserializeStudentMatriculationSubjects(UserProperty userProperty) {
    return unserializeStudentMatriculationSubjects(userProperty != null ? userProperty.getValue() : null);
  }

  /**
   * Unserializes student's matriculation subjects from string
   *
   * @param value string value
   * @return unserialized student's matriculation subjects
   */
  private StudentMatriculationSubjects unserializeStudentMatriculationSubjects(String value) {
    StudentMatriculationSubjects result = unserializeObject(value, StudentMatriculationSubjects.class);
    if (result != null) {
      return result;
    }

    return new StudentMatriculationSubjects();
  }

  /**
   * Unserialized object from a JSON string
   *
   * @param string string representation
   * @return unserialized object or null if unserialization fails
   */
  private <T> T unserializeObject(String string, Class<T> targetClass) {
    if (StringUtils.isNotBlank(string)) {
      ObjectMapper objectMapper = new ObjectMapper();
      try {
        return objectMapper.readValue(string, targetClass);
      } catch (IOException e) {
        logger.log(Level.SEVERE, "Failed to unserialize object", e);
      }
    }

    return null;
  }

  /**
   * Unserialized object from input stream
   *
   * @param inputStream input stream
   * @return unserialized object or null if unserialization fails
   */
  private <T> T unserializeObject(InputStream inputStream, Class<T> targetClass) {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      return objectMapper.readValue(inputStream, targetClass);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to unserialize object", e);
    }

    return null;
  }

  /**
   * Writes an object as JSON string
   *
   * @param entity to be serialized
   * @return serialized string
   */
  private String serializeObject(Object entity) {
    if (entity == null) {
      return null;
    }

    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.writeValueAsString(entity);
    } catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Failed to serialize an entity", e);
    }

    return null;
  }

  public StudentCourseStats fetchStudentCourseStats(SchoolDataIdentifier studentIdentifier) {
    return userSchoolDataController.getStudentCourseStats(studentIdentifier);
  }

  public int getMandatoryCoursesRequiredForMatriculation() {
    String resultString = pluginSettingsController.getPluginSetting(
        "transcriptofrecords",
        "mandatoryCoursesRequiredForMatriculation");
    // Default is 20
    return StringUtils.isNotBlank(resultString) ? Integer.parseInt(resultString) : 20;
  }

  public double getMandatoryCreditPointsRequiredForMatriculation() {
    String resultString = pluginSettingsController.getPluginSetting(
        "transcriptofrecords",
        "mandatoryCreditPointsRequiredForMatriculation");
    // Default is 40
    return StringUtils.isNotBlank(resultString) ? Double.parseDouble(resultString) : 40;
  }

}