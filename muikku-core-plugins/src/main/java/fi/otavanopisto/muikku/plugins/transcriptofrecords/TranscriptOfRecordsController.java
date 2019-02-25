package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.rest.EducationTypeMapping;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.TransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserProperty;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class TranscriptOfRecordsController {

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private PermissionController permissionController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  private UserController userController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private StudiesViewCourseChoiceController studiesViewCourseChoiceController;

  @Inject
  private GradingController gradingController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  private static final Pattern UPPER_SECONDARY_SCHOOL_SUBJECT_PATTERN = Pattern.compile("^[A-ZÅÄÖ0-9]+$");
  
  public boolean subjectAppliesToStudent(User student, Subject subject) {
    if (subject.getCode() == null) {
      return false;
    }
    
    if (!UPPER_SECONDARY_SCHOOL_SUBJECT_PATTERN.matcher(subject.getCode()).matches()) {
      return false;
    }

    TranscriptofRecordsUserProperties userProperties = loadUserProperties(student);
    
    String mathSyllabus = userProperties.asString("mathSyllabus");
    String finnish = userProperties.asString("finnish");
    boolean german = userProperties.asBoolean("german");
    boolean french = userProperties.asBoolean("french");
    boolean italian = userProperties.asBoolean("italian");
    boolean spanish = userProperties.asBoolean("spanish");
    String religion = userProperties.asString("religion");

    String code = subject.getCode();
    
    if ("MUU".equals(code)) {
      return false;
    }

    // RUB is part of old curriculum that is not supported in vops (new is RUB1)
    if ("RUB".equals(code)) {
      return false;
    }
    
    if ("MAA".equals(mathSyllabus) && "MAB".equals(code)) {
      return false;
    }

    if ("MAB".equals(mathSyllabus) && "MAA".equals(code)) {
      return false;
    }

    if ("S2".equals(finnish) && "ÄI".equals(code)) {
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

  public void saveStringProperty(User user, String propertyName, String value) {
    if (value != null && !"".equals(value)) {
      userSchoolDataController.setUserProperty(user, "hops." + propertyName, value);
    }
  }

  public void saveBoolProperty(User user, String propertyName, boolean value) {
    userSchoolDataController.setUserProperty(user, "hops." + propertyName, value ? "yes" : "no");
  }

  public boolean shouldShowStudies(User user) {
    UserProperty userProperty = userSchoolDataController.getUserProperty(user, "hops.enabled");
    if(userProperty != null && "1".equals(userProperty.getValue())) {
      return true;
    } else {
      return false;
    }
  }

  public TranscriptofRecordsUserProperties loadUserProperties(User user) {
    return new TranscriptofRecordsUserProperties(userSchoolDataController.listUserProperties(user));
  }

  public List<VopsWorkspace> listWorkspaceIdentifiersBySubjectIdentifierAndCourseNumber(String schoolDataSource, String subjectIdentifier, int courseNumber) {
    List<VopsWorkspace> retval = new ArrayList<>();
    SearchProvider searchProvider = getProvider("elastic-search");
    if (searchProvider != null) {
      SearchResult sr = searchProvider.searchWorkspaces(schoolDataSource, subjectIdentifier, courseNumber);
      List<Map<String, Object>> results = sr.getResults();
      for (Map<String, Object> result : results) {
        String searchId = (String) result.get("id");
        if (StringUtils.isNotBlank(searchId)) {
          String[] id = searchId.split("/", 2);
          if (id.length == 2) {
            String dataSource = id[1];
            String identifier = id[0];
            String educationTypeId = (String) result.get("educationSubtypeIdentifier");
            String name = (String) result.get("name");
            String description = (String) result.get("description");
            @SuppressWarnings("unchecked")
            ArrayList<String> curriculums = (ArrayList<String>) result.get("curriculumIdentifiers");
            
            SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(identifier, dataSource);
            SchoolDataIdentifier educationSubtypeIdentifier = SchoolDataIdentifier.fromId(educationTypeId);
            Set<SchoolDataIdentifier> curriculumIdentifiers = new HashSet<>();
            
            for (String curriculum : curriculums) {
              curriculumIdentifiers.add(SchoolDataIdentifier.fromId(curriculum));
            }
            
            retval.add(
                new VopsWorkspace(
                    workspaceIdentifier,
                    educationSubtypeIdentifier,
                    curriculumIdentifiers,
                    name,
                    description
                )
            );
          }
        }
      }
    }
    return retval;
  }

  public Map<SchoolDataIdentifier, WorkspaceAssessment> listStudentAssessments(SchoolDataIdentifier studentIdentifier) {
    List<WorkspaceAssessment> assessmentsByStudent = gradingController.listAssessmentsByStudent(studentIdentifier);
    
    Map<SchoolDataIdentifier, WorkspaceAssessment> result = new HashMap<>();
    for (WorkspaceAssessment assessment : assessmentsByStudent) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(assessment.getWorkspaceUserIdentifier());
      
      WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
      SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
     
      if (!result.containsKey(workspaceIdentifier)) {
        result.put(workspaceIdentifier, assessment);
      } else {
        WorkspaceAssessment storedAssessment = result.get(workspaceIdentifier);
        
        if (assessment.getDate().after(storedAssessment.getDate()))
          result.put(workspaceIdentifier, assessment);
      }
    }
    
    return result;
  }

  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }

  public VopsLister.Result listVopsCourses(String studentIdentifierString,
      SchoolDataIdentifier studentIdentifier) throws EducationTypeMappingNotSetException {
    User student = userController.findUserByIdentifier(studentIdentifier);
    
    if (!shouldShowStudies(student)) {
      return VopsLister.notOptedInResult();
    }
    
    List<TransferCredit> transferCredits = new ArrayList<>(gradingController.listStudentTransferCredits(studentIdentifier));

    List<Subject> subjects = courseMetaController.listSubjects();
    Map<SchoolDataIdentifier, WorkspaceAssessment> studentAssessments = listStudentAssessments(studentIdentifier);
    
    String curriculum = pluginSettingsController.getPluginSetting("transcriptofrecords", "curriculum");
    SchoolDataIdentifier curriculumIdentifier = null;
    if (curriculum != null) {
      curriculumIdentifier = SchoolDataIdentifier.fromId(curriculum);
    }
    
    final List<String> subjectList = new ArrayList<String>();
    String commaSeparatedSubjectsOrder = pluginSettingsController.getPluginSetting("transcriptofrecords", "subjectsOrder");
    if (!StringUtils.isBlank(commaSeparatedSubjectsOrder)) {
      subjectList.addAll(Arrays.asList(commaSeparatedSubjectsOrder.split(",")));
    }
    subjects.sort(new Comparator<Subject>() {
      public int compare(Subject o1, Subject o2) {
        int i1 = subjectList.indexOf(o1.getCode());
        int i2 = subjectList.indexOf(o2.getCode());
        i1 = i1 == -1 ? Integer.MAX_VALUE : i1;
        i2 = i2 == -1 ? Integer.MAX_VALUE : i2;
        return i1 < i2 ? -1 : i1 == i2 ? 0 : 1;
      }
    });

    String educationTypeMappingString = pluginSettingsController.getPluginSetting("transcriptofrecords", "educationTypeMapping");
    EducationTypeMapping educationTypeMapping = new EducationTypeMapping();
    if (educationTypeMappingString != null) {
      try {
        educationTypeMapping = new ObjectMapper().readValue(educationTypeMappingString, EducationTypeMapping.class);
      } catch (IOException e) {
        throw new EducationTypeMappingNotSetException();
      }
    }
    
    VopsLister lister = new VopsLister(
      subjects,
      this,
      student,
      transferCredits,
      curriculumIdentifier,
      workspaceController,
      workspaceUserEntityController,
      studentIdentifier,
      studentAssessments,
      userGroupEntityController,
      permissionController,
      studiesViewCourseChoiceController,
      studentIdentifierString,
      gradingController,
      educationTypeMapping
    );
    lister.performListing();
    VopsLister.Result listerResult = lister.getResult();
    return listerResult;
  }
  
}