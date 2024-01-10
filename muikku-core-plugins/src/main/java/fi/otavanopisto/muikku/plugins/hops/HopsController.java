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
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class HopsController {

  @Inject
  private SessionController sessionController;

  @Inject
  private CurrentUserSession currentUserSession;

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
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  
  public boolean isHopsAvailable(String studentIdentifier) {
    if (sessionController.isLoggedIn()) {
      
      // Hops is always available for admins
      
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
      if (userSchoolDataIdentifier != null && (userSchoolDataIdentifier.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER))) {
        return true;
      }
      SchoolDataIdentifier schoolDataIdentifier = SchoolDataIdentifier.fromId(studentIdentifier);
      
      if (sessionController.getLoggedUser().equals(schoolDataIdentifier)) {
        return true;
      }
      
      return userSchoolDataController.amICounselor(schoolDataIdentifier);
    }
    return false;
  }
  
  public boolean canSignup(WorkspaceEntity workspaceEntity, UserEntity studentEntity) {
    boolean canSignUp = false;
    
    if (studentEntity == null) {
      return canSignUp;
    }
    // Check that user isn't already in the workspace. If not, check if they could sign up
    
    if (sessionController.isLoggedIn() && currentUserSession.isActive()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentEntity.defaultSchoolDataIdentifier());
      canSignUp = workspaceUserEntity == null && workspaceEntityController.canSignup(studentEntity.defaultSchoolDataIdentifier(), workspaceEntity);
    }
    
    // If user could sign up, revoke that if they have already been evaluated
    
    if (canSignUp) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentEntity.defaultSchoolDataIdentifier());
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
  
}
