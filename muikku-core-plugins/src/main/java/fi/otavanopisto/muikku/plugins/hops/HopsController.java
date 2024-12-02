package fi.otavanopisto.muikku.plugins.hops;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

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
import fi.otavanopisto.muikku.plugins.hops.dao.HopsStudentChoiceDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsStudyHoursDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsSuggestionDAO;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsOptionalSuggestion;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.rest.model.HopsStudentPermissionsRestModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
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
  private HopsSuggestionDAO hopsSuggestionDAO;
  
  @Inject
  private HopsStudentChoiceDAO hopsStudentChoiceDAO;
  
  @Inject
  private HopsStudyHoursDAO hopsStudyHoursDAO;
  
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
      
      // Hops is always available for admins
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
  
  public Hops createHops(String studentIdentifier, String formData, String historyDetails) {
    Hops hops = hopsDAO.create(studentIdentifier, formData);
    hopsHistoryDAO.create(studentIdentifier, new Date(), sessionController.getLoggedUser().toId(), historyDetails);
    return hops;
  }

  public Hops updateHops(Hops hops, String studentIdentifier, String formData, String historyDetails) {
    hopsDAO.updateFormData(hops, formData);
    hopsHistoryDAO.create(studentIdentifier, new Date(), sessionController.getLoggedUser().toId(), historyDetails);
    return hops;
  }
  
  public HopsHistory findHistoryById(Long id) {
    return hopsHistoryDAO.findById(id);
  }
  
  public HopsHistory updateHopsHistoryDetails(HopsHistory history, String details) {
    hopsHistoryDAO.update(history, details);
    return history;
  }
  
  public Hops findHopsByStudentIdentifier(String studentIdentifier) {
    return hopsDAO.findByStudentIdentifier(studentIdentifier);
  }
  
  public HopsGoals findHopsGoalsByStudentIdentifier(String studentIdentifier) {
    return hopsGoalsDAO.findByStudentIdentifier(studentIdentifier);
  }
  
  public HopsGoals createHopsGoals(String studentIdentifier, String data) {
    HopsGoals hopsGoals = hopsGoalsDAO.create(studentIdentifier, data);

    return hopsGoals;
  }

  public HopsGoals updateHopsGoals(HopsGoals hopsGoals, String studentIdentifier, String goals) {
    hopsGoalsDAO.updateGoalsData(hopsGoals, goals);
    return hopsGoals;
  }
  
  public HopsStudyHours findHopsStudyHoursByStudentIdentifier(String studentIdentifier) {
    return hopsStudyHoursDAO.findByStudentIdentifier(studentIdentifier);
  }
  
  public HopsStudyHours createHopsStudyHours(String studentIdentifier, Integer hours) {
    HopsStudyHours hopsStudyHours = hopsStudyHoursDAO.create(studentIdentifier, hours);

    return hopsStudyHours;
  }

  public HopsStudyHours updateHopsStudyHours(HopsStudyHours hopsStudyHours, String studentIdentifier, Integer hours) {
    hopsStudyHoursDAO.updateStudyHours(hopsStudyHours, hours);
    return hopsStudyHours;
  }
  
  public List<HopsStudentChoice> listStudentChoiceByStudentIdentifier(String studentIdentifeir) {
    return hopsStudentChoiceDAO.listByStudentIdentifier(studentIdentifeir);
  }
  
  public HopsStudentChoice findStudentChoiceByStudentIdentifier(String studentIdentifier, String subject, Integer courseNumber) {
    return hopsStudentChoiceDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
  }
  
  public HopsStudentChoice createStudentChoice(String studentIdentifier, String subject, Integer courseNumber) {
    HopsStudentChoice hopsStudentChoice = hopsStudentChoiceDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsStudentChoice != null) {
      hopsStudentChoice = hopsStudentChoiceDAO.update(hopsStudentChoice, studentIdentifier, subject, courseNumber);
    }
    else {
      hopsStudentChoice = hopsStudentChoiceDAO.create(studentIdentifier, subject, courseNumber);
    }
    return hopsStudentChoice;
  }
  
  public void removeStudentChoice(String studentIdentifier, String subject, Integer courseNumber) {
    HopsStudentChoice hopsStudentChoice = hopsStudentChoiceDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsStudentChoice != null) {
      hopsStudentChoiceDAO.delete(hopsStudentChoice);
    }
  }
  
  public List<HopsOptionalSuggestion> listOptionalSuggestionsByStudentIdentifier(String studentIdentifeir) {
    return hopsOptionalSuggestionDAO.listByStudentIdentifier(studentIdentifeir);
  }
  
  public HopsOptionalSuggestion findOptionalSuggestionByStudentIdentifier(String studentIdentifier, String subject, Integer courseNumber) {
    return hopsOptionalSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
  }
  
  public HopsOptionalSuggestion createOptionalSuggestion(String studentIdentifier, String subject, Integer courseNumber) {
    HopsOptionalSuggestion hopsOptionalSuggestion = hopsOptionalSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsOptionalSuggestion != null) {
      hopsOptionalSuggestion = hopsOptionalSuggestionDAO.update(hopsOptionalSuggestion, studentIdentifier, subject, courseNumber);
    }
    else {
      hopsOptionalSuggestion = hopsOptionalSuggestionDAO.create(studentIdentifier, subject, courseNumber);
    }
    return hopsOptionalSuggestion;
  }
  
  public void removeOptionalSuggestion(String studentIdentifier, String subject, Integer courseNumber) {
    HopsOptionalSuggestion hopsOptionalSuggestion = hopsOptionalSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsOptionalSuggestion != null) {
      hopsOptionalSuggestionDAO.delete(hopsOptionalSuggestion);
    }
  }
  
  public List<HopsHistory> listHistoryByStudentIdentifier(String studentIdentifier, int firstResult, int maxResults) {
    List<HopsHistory> history = hopsHistoryDAO.listByStudentIdentifier(studentIdentifier, firstResult, maxResults);
    history.sort(Comparator.comparing(HopsHistory::getDate));
    return history;
  }
  
  public List<HopsSuggestion> listSuggestionsByStudentIdentifier(String studentIdentifeir) {
    return hopsSuggestionDAO.listByStudentIdentifier(studentIdentifeir);
  }
  
  public void removeSuggestion(HopsSuggestion hopsSuggestion) {
    hopsSuggestionDAO.delete(hopsSuggestion);
  }
  
  public HopsSuggestion findSuggestionByStudentIdentifierAndSubjectAndCourseNumberAndWorkspaceEntityId(String studentIdentifier, String subject, Integer courseNumber, Long workspaceEntityId) {
    return hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumberAndWorkspaceEntityId(studentIdentifier, subject, courseNumber, workspaceEntityId);
  }
  
  public HopsSuggestion suggestWorkspace(String studentIdentifier, String subject, String type, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumberAndWorkspaceEntityId(studentIdentifier, subject, courseNumber, workspaceEntityId);
    if (hopsSuggestion != null) {
      hopsSuggestion = hopsSuggestionDAO.update(hopsSuggestion, studentIdentifier, subject, type, courseNumber, workspaceEntityId);
    }
    else {
      hopsSuggestion = hopsSuggestionDAO.create(studentIdentifier, subject, type, courseNumber, workspaceEntityId);
    }
    return hopsSuggestion;
  }

  public void unsuggestWorkspace(String studentIdentifier, String subject, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumberAndWorkspaceEntityId(studentIdentifier, subject, courseNumber, workspaceEntityId);
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
    
    boolean isGuidanceCounselor = userSchoolDataController.amICounselor(studentIdentifier);
    return isGuidanceCounselor || sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR);
  }

  /**
   * Returns a permission rest model for frontend for currently
   * logged in user.
   * 
   * @param studentIdentifier for which student the permissions are for
   * @return a permission rest model
   */
  public HopsStudentPermissionsRestModel getHOPSStudentPermissions(SchoolDataIdentifier studentIdentifier) {
    if (studentIdentifier.equals(sessionController.getLoggedUser())) {
      return new HopsStudentPermissionsRestModel(true, true);
    }
    
    boolean isGuidanceCounselor = userSchoolDataController.amICounselor(studentIdentifier);
    boolean canViewDetails = isGuidanceCounselor || sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
    boolean canEdit = isGuidanceCounselor || sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR);
    return new HopsStudentPermissionsRestModel(canViewDetails, canEdit);
  }
}
