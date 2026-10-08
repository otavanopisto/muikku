package fi.otavanopisto.muikku.plugins.search;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyController;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriod;
import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriodType;
import fi.otavanopisto.muikku.search.IndexedUser;
import fi.otavanopisto.muikku.search.IndexedUserPedagogyFormState;
import fi.otavanopisto.muikku.search.IndexedUserStudyPeriod;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class UserIndexer {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PedagogyController pedagogyController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController; 

  @Inject
  private UserController userController;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private SearchIndexer indexer;
  
  public void indexUser(String dataSource, String identifier) {
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(identifier, dataSource);
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByIdentifier(userIdentifier);
      if (user != null) {
        IndexedUser indexedUser = new IndexedUser();
        
        indexedUser.setIdentifier(user.getIdentifier());
        indexedUser.setSchoolDataSource(user.getSchoolDataSource());

        indexedUser.setFirstName(user.getFirstName());
        indexedUser.setLastName(user.getLastName());
        indexedUser.setNickName(user.getNickName());  
        indexedUser.setDisplayName(user.getDisplayName());

        indexedUser.setCurriculumIdentifier(user.getCurriculumIdentifier());
        indexedUser.setOrganizationIdentifier(user.getOrganizationIdentifier());

        indexedUser.setStudyProgrammeName(user.getStudyProgrammeName());
        indexedUser.setStudyProgrammeIdentifier(user.getStudyProgrammeIdentifier());
        indexedUser.setStudyStartDate(user.getStudyStartDate());
        indexedUser.setStudyEndDate(user.getStudyEndDate());
        indexedUser.setStudyTimeEnd(user.getStudyTimeEnd());
        indexedUser.setHasEvaluationFees(user.getHasEvaluationFees());
        indexedUser.setHidden(user.getHidden());

        indexedUser.setNationality(user.getNationality());
        indexedUser.setLanguage(user.getLanguage());
        indexedUser.setMunicipality(user.getMunicipality());
        indexedUser.setSchool(user.getSchool());
        indexedUser.setBirthday(userController.getBirthday(userIdentifier));

        // TODO: we have only one role here but a user(entity) can have several roles via several userschooldataidentifiers
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());
        Set<EnvironmentRoleArchetype> environmentRoles = ((userSchoolDataIdentifier != null) && (userSchoolDataIdentifier.getRoles() != null))
            ? userSchoolDataIdentifier.getRoles().stream().map(roleEntity -> roleEntity.getArchetype()).collect(Collectors.toSet())
            : new HashSet<>();

        if (CollectionUtils.isNotEmpty(environmentRoles) && (userSchoolDataIdentifier != null)) {
          UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
          
          boolean isDefaultIdentifier = (userEntity.getDefaultIdentifier() != null && userEntity.getDefaultSchoolDataSource() != null) ?
              userEntity.getDefaultIdentifier().equals(user.getIdentifier()) && 
              userEntity.getDefaultSchoolDataSource().getIdentifier().equals(user.getSchoolDataSource()) : false;

          indexedUser.setRoles(environmentRoles);
          indexedUser.setUserEntityId(userEntity.getId());
          indexedUser.setDefaultIdentifier(isDefaultIdentifier);
          
          Set<Long> workspaceEntityIds = new HashSet<Long>();
          Set<Long> userGroupIds = new HashSet<Long>();

          // List workspaces in which the student is active (TODO Should we have a separate variable for all workspaces?)
          List<WorkspaceEntity> workspaces = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserIdentifier(userIdentifier);
          for (WorkspaceEntity workspace : workspaces) {
            workspaceEntityIds.add(workspace.getId());
          }

          indexedUser.setWorkspaces(workspaceEntityIds);
          
          List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
          for (UserGroupEntity userGroup : userGroups) {
            userGroupIds.add(userGroup.getId());
          }
          
          indexedUser.setGroups(userGroupIds);

          if (environmentRoles.contains(EnvironmentRoleArchetype.TEACHER) ||
              environmentRoles.contains(EnvironmentRoleArchetype.STUDY_GUIDER) ||
              environmentRoles.contains(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER) ||
              environmentRoles.contains(EnvironmentRoleArchetype.MANAGER) ||
              environmentRoles.contains(EnvironmentRoleArchetype.ADMINISTRATOR)) {
            String userDefaultEmailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false);
            indexedUser.setEmail(userDefaultEmailAddress);
          }
          
          if (environmentRoles.contains(EnvironmentRoleArchetype.STUDENT)) {
            PedagogyForm pedagogyForm = pedagogyController.findFormByUserEntityId(userEntity.getId());

            if (pedagogyForm != null) {
              indexedUser.setPedagogyFormState(pedagogyForm.isPublished() ? IndexedUserPedagogyFormState.PUBLISHED : IndexedUserPedagogyFormState.UNPUBLISHED);
              indexedUser.setHasDecisionOnSpecialEducation(pedagogyController.hasDecisionToSpecialEducation(pedagogyForm));
            }
          }
        }
        
        List<IndexedUserStudyPeriod> studyPeriods = getIndexedUserStudyPeriods(userIdentifier);
        
        indexedUser.setStudyPeriods2(studyPeriods);
        
        indexer.index(IndexedUser.INDEX_NAME, IndexedUser.TYPE_NAME, indexedUser);
      } else {
        logger.info(String.format("Removing user %s/%s from index", identifier, dataSource));
        removeUser(dataSource, identifier);
      }
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Indexing of user identifier " + identifier + " failed.", ex);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    } 
  }
  
  /**
   * Fetches user's study periods and turns them into IndexedUserStudyPeriods.
   * Tries to fill in missing end dates in order for the search to be more convenient.
   * 
   * @param userIdentifier
   * @return
   */
  private List<IndexedUserStudyPeriod> getIndexedUserStudyPeriods(SchoolDataIdentifier userIdentifier) {
    List<UserStudyPeriod> studentStudyPeriods = userController.listStudentStudyPeriods(userIdentifier);
    
    List<IndexedUserStudyPeriod> studyPeriods = new ArrayList<>();

    if (CollectionUtils.isNotEmpty(studentStudyPeriods)) {
      for (UserStudyPeriod studyPeriod : studentStudyPeriods) {
        
        UserStudyPeriodType type = studyPeriod.getType();
        LocalDate begin = studyPeriod.getBegin();
        LocalDate end = studyPeriod.getEnd();

        // If the end date is null, try to figure out if the period has ended (based on some other period cancelling it)
        if (end == null && begin != null && type != null) {
          switch (type) {
            case COMPULSORY_EDUCATION:
            case NON_COMPULSORY_EDUCATION:
            case EXTENDED_COMPULSORY_EDUCATION:
              end = findPeriodEnd(studentStudyPeriods, begin, EnumSet.of(UserStudyPeriodType.COMPULSORY_EDUCATION, 
                  UserStudyPeriodType.NON_COMPULSORY_EDUCATION, UserStudyPeriodType.EXTENDED_COMPULSORY_EDUCATION));
            break;
            
            case PROLONGED_STUDYENDDATE:
            case TEMPORARILY_SUSPENDED:
              // None for these, for now anyways
            break;
          }
        }
        
        studyPeriods.add(new IndexedUserStudyPeriod(begin, end, type));
      }
    }
    
    return studyPeriods;
  }

  /**
   * Finds periods of type endStates and greater date than begin.
   * If any are found, the one with smallest begin date is used
   * as an assumed end date for the period for which this method
   * is called for. One day gets automatically removed from the date.
   * @param studentStudyPeriods
   * @param begin
   * @param of
   * @return
   */
  private LocalDate findPeriodEnd(List<UserStudyPeriod> studentStudyPeriods, LocalDate begin, EnumSet<UserStudyPeriodType> endStates) {
    LocalDate nearestCancellingPeriodTypeBeginDate = studentStudyPeriods.stream()
      .filter(period -> period.getBegin() != null)
      .filter(period -> period.getBegin().isAfter(begin))
      .filter(period -> endStates.contains(period.getType()))
      .map(UserStudyPeriod::getBegin)
      .min(Comparator.naturalOrder())
      .orElse(null);

    return nearestCancellingPeriodTypeBeginDate != null ? nearestCancellingPeriodTypeBeginDate.minusDays(1) : null;
  }

  public void indexUser(UserEntity userEntity) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);
      for (UserSchoolDataIdentifier schoolDataIdentifier : identifiers) {
        SchoolDataIdentifier identifier = schoolDataIdentifier.schoolDataIdentifier();
        indexUser(identifier);
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void indexUser(SchoolDataIdentifier identifier) {
    indexUser(identifier.getDataSource(), identifier.getIdentifier());
  }

  public void removeUser(SchoolDataIdentifier identifier) {
    removeUser(identifier.getDataSource(), identifier.getIdentifier());
  }

  public void removeUser(String dataSource, String identifier) {
    try {
      indexer.remove(IndexedUser.INDEX_NAME, IndexedUser.TYPE_NAME, String.format("%s/%s", identifier, dataSource));
    } catch (Exception ex) {
      logger.log(Level.SEVERE, String.format("Removal of user %s/%s from index failed", dataSource, identifier), ex);
    } 
  }
  
}
