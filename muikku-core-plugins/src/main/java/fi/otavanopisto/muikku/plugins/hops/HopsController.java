package fi.otavanopisto.muikku.plugins.hops;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.codec.binary.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsGoalsDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsHistoryDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsOptionalSuggestionDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsPlannedCourseDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsStudentChoiceDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsSuggestionDAO;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsOptionalSuggestion;
import fi.otavanopisto.muikku.plugins.hops.model.HopsPlannedCourse;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.rest.model.HopsStudentPermissionsRestModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class HopsController {

  @Inject
  private SessionController sessionController;

  @Inject
  private HopsDAO hopsDAO;
  
  @Inject
  private HopsGoalsDAO hopsGoalsDAO;

  @Inject
  private HopsHistoryDAO hopsHistoryDAO;
  
  @Inject
  private HopsPlannedCourseDAO hopsPlannedCourseDAO;

  @Inject
  private HopsSuggestionDAO hopsSuggestionDAO;
  
  @Inject
  private HopsStudentChoiceDAO hopsStudentChoiceDAO;
  
  @Inject
  private HopsOptionalSuggestionDAO hopsOptionalSuggestionDAO;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  public boolean isHopsAvailable(String studentIdentifierStr) {
    if (sessionController.isLoggedIn()) {
      SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
      if (studentIdentifier == null) {
        return false;
      }
      
      // Hops is always available for admins, managers, and study programme leaders
      
      if (sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER)) {
        return true;
      }
      
      if (sessionController.getLoggedUser().equals(studentIdentifier) || userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
        return true;
      }
      
      if (userSchoolDataController.amICounselor(studentIdentifier)) {
        return true;
      }
      
      /*
       * If logged user is TEACHER and given identifier belongs to a STUDENT
       * we'll allow the access if logged user is a teacher on a workspace where
       * the student is.
       */
      if (sessionController.hasRole(EnvironmentRoleArchetype.TEACHER)) {
        UserSchoolDataIdentifier studentUserSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
        if (studentUserSchoolDataIdentifier != null && studentUserSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
          return workspaceUserEntityController.haveSharedWorkspaces(sessionController.getLoggedUserEntity(), studentUserSchoolDataIdentifier.getUserEntity());
        }
      }
    }
    
    return false;
  }
  
  public boolean canSignup(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    boolean canSignUp = false;
    
    if (userEntity == null) {
      return false;
    }

    // Check that user isn't already in the workspace. If not, check if they could sign up
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
    canSignUp = workspaceUserEntity == null && workspaceEntityController.canSignup(userEntity.defaultSchoolDataIdentifier(), workspaceEntity);
    
    // If user could sign up, revoke that if they have already been evaluated
    
    if (canSignUp) {
      workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userEntity.defaultSchoolDataIdentifier());
      if (workspaceUserEntity != null) {
        WorkspaceRoleEntity workspaceRoleEntity = workspaceUserEntity.getWorkspaceUserRole();
        WorkspaceRoleArchetype archetype = workspaceRoleEntity.getArchetype();
        if (archetype.equals(WorkspaceRoleArchetype.STUDENT)) {
          // TODO Unavoidable Pyramus call. Not exactly fun when this method is called in a loop
          List<WorkspaceAssessmentState> assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
          
          for (WorkspaceAssessmentState assessmentState : assessmentStates) {
            if (assessmentState.getState() == WorkspaceAssessmentState.PASS || assessmentState.getState() == WorkspaceAssessmentState.FAIL) {
              canSignUp = false;
            }
          }
        }  
      }
    }

    return canSignUp;
  }
  
  public HopsHistory createHops(HopsStudent hopsStudent, String formData, String historyDetails, String historyChanges) {
    hopsDAO.create(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), formData);
    return hopsHistoryDAO.create(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), new Date(), sessionController.getLoggedUser().toId(), historyDetails, historyChanges);
  }

  public HopsHistory updateHops(Hops hops, String formData, String historyDetails, String historyChanges) {
    hopsDAO.updateFormData(hops, formData);
    return hopsHistoryDAO.create(hops.getUserEntityId(), hops.getCategory(), new Date(), sessionController.getLoggedUser().toId(), historyDetails, historyChanges);
  }
  
  public HopsHistory findHistoryById(Long id) {
    return hopsHistoryDAO.findById(id);
  }
  
  public HopsHistory updateHopsHistoryDetails(HopsHistory history, String details, String changes) {
    hopsHistoryDAO.update(history, details, changes);
    return history;
  }
  
  public Hops findHops(HopsStudent hopsStudent) {
    return hopsDAO.findByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory());
  }
  
  public HopsGoals findHopsGoals(HopsStudent hopsStudent) {
    return hopsGoalsDAO.findByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory());
  }
  
  public HopsGoals createHopsGoals(HopsStudent hopsStudent, String data) {
    HopsGoals hopsGoals = hopsGoalsDAO.create(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), data);

    return hopsGoals;
  }

  public HopsGoals updateHopsGoals(HopsGoals hopsGoals, String goals) {
    return hopsGoalsDAO.updateGoalsData(hopsGoals, goals);
  }
  
  public List<HopsStudentChoice> listStudentChoices(HopsStudent hopsStudent) {
    return hopsStudentChoiceDAO.listByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory());
  }
  
  public HopsStudentChoice findStudentChoice(HopsStudent hopsStudent, String subject, Integer courseNumber) {
    return hopsStudentChoiceDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), subject, courseNumber);
  }
  
  public HopsStudentChoice createStudentChoice(HopsStudent hopsStudent, String subject, Integer courseNumber) {
    HopsStudentChoice hopsStudentChoice = hopsStudentChoiceDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber);
    if (hopsStudentChoice != null) {
      hopsStudentChoice = hopsStudentChoiceDAO.update(hopsStudentChoice, subject, courseNumber);
    }
    else {
      hopsStudentChoice = hopsStudentChoiceDAO.create(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), subject, courseNumber);
    }
    return hopsStudentChoice;
  }
  
  public void removeStudentChoice(HopsStudent hopsStudent, String subject, Integer courseNumber) {
    HopsStudentChoice hopsStudentChoice = hopsStudentChoiceDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber);
    if (hopsStudentChoice != null) {
      hopsStudentChoiceDAO.delete(hopsStudentChoice);
    }
  }
  
  public List<HopsPlannedCourse> listPlannedCourses(HopsStudent hopsStudent) {
    return hopsPlannedCourseDAO.listByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory());
  }
  
  public HopsPlannedCourse createPlannedCourse(HopsStudent hopsStudent, String name, Integer courseNumber, Integer length, String lengthSymbol,
      String subjectCode, Boolean mandatory, LocalDate startDate, Long duration, Long workspaceEntityId) {
    return hopsPlannedCourseDAO.create(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        name,
        courseNumber,
        length,
        lengthSymbol,
        subjectCode,
        mandatory,
        startDate == null ? null : java.sql.Date.valueOf(startDate),
        duration,
        workspaceEntityId);
  }
  
  public HopsPlannedCourse updatePlannedCourse(HopsPlannedCourse hopsPlannedCourse, String name, Integer courseNumber, Integer length, String lengthSymbol,
      String subjectCode, Boolean mandatory, LocalDate startDate, Long duration, Long workspaceEntityId) {
    return hopsPlannedCourseDAO.update(hopsPlannedCourse,
        name,
        courseNumber,
        length,
        lengthSymbol,
        subjectCode,
        mandatory,
        startDate == null ? null : java.sql.Date.valueOf(startDate),
        duration,
        workspaceEntityId);
  }
  
  public void deletePlannedCourse(HopsPlannedCourse hopsPlannedCourse) {
    hopsPlannedCourseDAO.delete(hopsPlannedCourse);
  }
  
  public List<HopsOptionalSuggestion> listOptionalSuggestions(HopsStudent hopsStudent) {
    return hopsOptionalSuggestionDAO.listByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory());
  }
  
  public HopsOptionalSuggestion findOptionalSuggestion(HopsStudent hopsStudent, String subject, Integer courseNumber) {
    return hopsOptionalSuggestionDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), subject, courseNumber);
  }
  
  public HopsOptionalSuggestion createOptionalSuggestion(HopsStudent hopsStudent, String subject, Integer courseNumber) {
    HopsOptionalSuggestion hopsOptionalSuggestion = hopsOptionalSuggestionDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber);
    if (hopsOptionalSuggestion != null) {
      hopsOptionalSuggestion = hopsOptionalSuggestionDAO.update(hopsOptionalSuggestion, subject, courseNumber);
    }
    else {
      hopsOptionalSuggestion = hopsOptionalSuggestionDAO.create(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), subject, courseNumber);
    }
    return hopsOptionalSuggestion;
  }
  
  public void removeOptionalSuggestion(HopsStudent hopsStudent, String subject, Integer courseNumber) {
    HopsOptionalSuggestion hopsOptionalSuggestion = hopsOptionalSuggestionDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber);
    if (hopsOptionalSuggestion != null) {
      hopsOptionalSuggestionDAO.delete(hopsOptionalSuggestion);
    }
  }
  
  public List<HopsHistory> listHistory(HopsStudent hopsStudent, int firstResult, int maxResults) {
    List<HopsHistory> history = hopsHistoryDAO.listByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), firstResult, maxResults);
    history.sort(Comparator.comparing(HopsHistory::getDate));
    return history;
  }
  
  public List<HopsSuggestion> listSuggestions(HopsStudent hopsStudent) {
    return hopsSuggestionDAO.listByUserEntityIdAndCategory(hopsStudent.getUserEntityId(), hopsStudent.getCategory());
  }
  
  public void removeSuggestion(HopsSuggestion hopsSuggestion) {
    hopsSuggestionDAO.delete(hopsSuggestion);
  }
  
  public HopsSuggestion findSuggestion(HopsStudent hopsStudent, String subject, Integer courseNumber, Long workspaceEntityId) {
    return hopsSuggestionDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumberAndWorkspaceEntityId(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber,
        workspaceEntityId);
  }
  
  public HopsSuggestion suggestWorkspace(HopsStudent hopsStudent, String subject, String type, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumberAndWorkspaceEntityId(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber,
        workspaceEntityId);
    if (hopsSuggestion != null) {
      hopsSuggestion = hopsSuggestionDAO.update(hopsSuggestion, subject, type, courseNumber, workspaceEntityId);
    }
    else {
      hopsSuggestion = hopsSuggestionDAO.create(hopsStudent.getUserEntityId(), hopsStudent.getCategory(), subject, type, courseNumber, workspaceEntityId);
    }
    return hopsSuggestion;
  }

  public void unsuggestWorkspace(HopsStudent hopsStudent, String subject, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByUserEntityIdAndCategoryAndSubjectAndCourseNumberAndWorkspaceEntityId(
        hopsStudent.getUserEntityId(),
        hopsStudent.getCategory(),
        subject,
        courseNumber,
        workspaceEntityId);
    if (hopsSuggestion != null) {
      hopsSuggestionDAO.delete(hopsSuggestion);
    }
  }
  
  /**
   * Returns true if currently logged in user can view the regular hops tabs
   * of given student. The regular tabs are the planning tab and the matriculation
   * tab. The other two tabs are covered as "details" tabs.
   * 
   * @param studentIdentifier for which student the permission is checked for
   * @return true if user has permission, false otherwise
   */
  public boolean canViewHops(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier.equals(sessionController.getLoggedUser())) {
      return true;
    }
    
    return userSchoolDataController.amICounselor(studentIdentifier)
        || userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)
        || sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER)
        || workspaceEntityController.isWorkspaceTeacherOfStudent(sessionController.getLoggedUser(), studentIdentifier);
  }

  /**
   * Returns true if currently logged in user can view the hops details of 
   * given student.
   * 
   * @param studentIdentifier for which student the permission is checked for
   * @return true if user has permission, false otherwise
   */
  public boolean canViewHopsDetails(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier.equals(sessionController.getLoggedUser())) {
      return true;
    }
    
    return userSchoolDataController.amICounselor(studentIdentifier)
        || sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
  }

  /**
   * Returns true if currently logged in user can modify the hops of 
   * given student.
   * 
   * @param studentIdentifier for which student the permission is checked for
   * @return true if user has permission, false otherwise
   */
  public boolean canModifyHops(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier.equals(sessionController.getLoggedUser())) {
      return true;
    }
    
    return userSchoolDataController.amICounselor(studentIdentifier) 
        || sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR);
  }

  /**
   * Returns a permission rest model for front-end for currently logged in user.
   * HOPS is only available for students whose study programme education type is lukio or perusopetus (value is education type code)
   * 
   * @param studentIdentifier for which student the permissions are for
   * @return a permission rest model
   */
  public HopsStudentPermissionsRestModel getHOPSStudentPermissions(SchoolDataIdentifier studentIdentifier) {
    User user = userController.findUserByIdentifier(studentIdentifier);
    boolean isAvailable = user != null && (StringUtils.equals("lukio", user.getStudyProgrammeEducationType()) || StringUtils.equals("peruskoulu", user.getStudyProgrammeEducationType())); 
    boolean isGuidanceCounselor = isAvailable && userSchoolDataController.amICounselor(studentIdentifier);
    boolean canViewDetails = isAvailable &&  (isGuidanceCounselor || sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER));
    boolean canEdit = isAvailable && (isGuidanceCounselor || sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR));
    return new HopsStudentPermissionsRestModel(isAvailable, canViewDetails, canEdit);
  }
}
