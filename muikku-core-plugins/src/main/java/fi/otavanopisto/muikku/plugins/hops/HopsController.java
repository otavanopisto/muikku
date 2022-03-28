package fi.otavanopisto.muikku.plugins.hops;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsAlternativeStudyOptionsDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsGoalsDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsHistoryDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsStudentChoiceDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsStudyHoursDAO;
import fi.otavanopisto.muikku.plugins.hops.dao.HopsSuggestionDAO;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.HopsAlternativeStudyOptions;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours;
import fi.otavanopisto.muikku.plugins.hops.model.HopsSuggestion;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
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
  private HopsAlternativeStudyOptionsDAO hopsAlternativeStudyOptionsDAO;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject 
  private UserGroupController userGroupController;
  
  public boolean canSignup(WorkspaceEntity workspaceEntity) {
    boolean canSignUp = false;
    
    // Check that user isn't already in the workspace. If not, check if they could sign up
    
    if (sessionController.isLoggedIn() && currentUserSession.isActive()) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
      canSignUp = workspaceUserEntity == null && workspaceEntityController.canSignup(sessionController.getLoggedUser(), workspaceEntity);
    }
    
    // If user could sign up, revoke that if they have already been evaluated
    
    if (canSignUp) {
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUserEntity().defaultSchoolDataIdentifier());
      if (workspaceUserEntity != null) {
        WorkspaceRoleEntity workspaceRoleEntity = workspaceUserEntity.getWorkspaceUserRole();
        WorkspaceRoleArchetype archetype = workspaceRoleEntity.getArchetype();
        if (archetype.equals(WorkspaceRoleArchetype.STUDENT)) {
          // TODO Unavoidable Pyramus call. Not exactly fun when this method is called in a loop
          WorkspaceAssessmentState assessmentState = assessmentRequestController.getWorkspaceAssessmentState(workspaceUserEntity);
          if (assessmentState.getState() == WorkspaceAssessmentState.PASS || assessmentState.getState() == WorkspaceAssessmentState.FAIL) {
            canSignUp = false;
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
  
  public HopsAlternativeStudyOptions findHopsAlternativeStudyOptionsByStudentIdentifier(String studentIdentifier) {
    return hopsAlternativeStudyOptionsDAO.findByStudentIdentifier(studentIdentifier);
  }
  
  public HopsAlternativeStudyOptions createHopsAlternativeStudyOptions(String studentIdentifier, Boolean finnishAsLanguage, Boolean religionAsEthics) {
    HopsAlternativeStudyOptions hopsAlternativeStudyOptions = hopsAlternativeStudyOptionsDAO.create(studentIdentifier, finnishAsLanguage, religionAsEthics);

    return hopsAlternativeStudyOptions;
  }

  public HopsAlternativeStudyOptions updateHopsAlternativeStudyOptions(HopsAlternativeStudyOptions hopsAlternativeStudyOptions, String studentIdentifier, Boolean finnishAsLanguage, Boolean religionAsEthics) {
    hopsAlternativeStudyOptionsDAO.updateHopsAlternativeStudyOptions(hopsAlternativeStudyOptions, finnishAsLanguage, religionAsEthics);
    return hopsAlternativeStudyOptions;
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
  
  public HopsSuggestion findSuggestionByStudentIdentifierAndSubjectAndCourseNumber(String studentIdentifier, String subject, Integer courseNumber) {
    return hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
  }
  
  public HopsSuggestion suggestWorkspace(String studentIdentifier, String subject, String type, Integer courseNumber, Long workspaceEntityId) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsSuggestion != null) {
      hopsSuggestion = hopsSuggestionDAO.update(hopsSuggestion, studentIdentifier, subject, type, courseNumber, workspaceEntityId);
    }
    else {
      hopsSuggestion = hopsSuggestionDAO.create(studentIdentifier, subject, type, courseNumber, workspaceEntityId);
    }
    return hopsSuggestion;
  }

  public void unsuggestWorkspace(String studentIdentifier, String subject, Integer courseNumber) {
    HopsSuggestion hopsSuggestion = hopsSuggestionDAO.findByStudentIdentifierAndSubjectAndCourseNumber(studentIdentifier, subject, courseNumber);
    if (hopsSuggestion != null) {
      hopsSuggestionDAO.delete(hopsSuggestion);
    }
  }
  
  public List<UserEntity> getGuidanceCouncelors(SchoolDataIdentifier studentIdentifier){
    UserEntity guidanceCounselor = null;
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserIdentifier(studentIdentifier);
    List<UserEntity> counselorList = new ArrayList<>();
    // #3089: An awkward workaround to use the latest guidance group based on its identifier. Assumes a larger
    // identifier means a more recent entity. A more proper fix would be to sync group creation dates from
    // Pyramus and include them in the Elastic index. Then again, user groups would have to be refactored
    // entirely, as Pyramus handles group members as students (one study programme) while Muikku handles
    // them as user entities (all study programmes)...
    
    userGroupEntities.sort(new Comparator<UserGroupEntity>() {
      public int compare(UserGroupEntity o1, UserGroupEntity o2) {
        long l1 = NumberUtils.toLong(StringUtils.substringAfterLast(o1.getIdentifier(), "-"), -1);
        long l2 = NumberUtils.toLong(StringUtils.substringAfterLast(o2.getIdentifier(), "-"), -1);
        return (int) (l2 - l1);
      }
    });
    
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);

      if (userGroup.getIsGuidanceGroup()) {
        List<GroupUser> groupUsers = userGroupController.listUserGroupStaffMembers(userGroup);

        for (GroupUser groupUser : groupUsers) {
          User user = userGroupController.findUserByGroupUser(groupUser);
          guidanceCounselor = userEntityController.findUserEntityByUser(user);
           counselorList.add(guidanceCounselor);
          
        }
      }
    }
    
    return counselorList;
  }

}
