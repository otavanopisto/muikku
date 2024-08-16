package fi.otavanopisto.muikku.plugins.search;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.IndexedWorkspaceSubject;
import fi.otavanopisto.muikku.search.IndexedWorkspaceUser;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;

public class WorkspaceIndexer {
  
  @Inject
  private Logger logger;

  @Inject 
  private CourseMetaController courseMetaController; 
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private SearchIndexer indexer;

  public void indexWorkspace(String dataSource, String identifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, identifier);
      if (workspaceEntity != null) {
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
        if (workspace != null) {
          indexWorkspace(workspace, workspaceEntity);
        }
      } else {
        logger.warning(String.format("could not index workspace because workspace entity #%s/%s could not be found", identifier, dataSource));
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void indexWorkspace(WorkspaceEntity workspaceEntity) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        indexWorkspace(workspace, workspaceEntity);
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  private void indexWorkspace(Workspace workspace, WorkspaceEntity workspaceEntity) {
    try {
      IndexedWorkspace indexedWorkspace = workspaceToIndexedWorkspace(workspace, workspaceEntity);
      
      indexer.index(IndexedWorkspace.INDEX_NAME, IndexedWorkspace.TYPE_NAME, indexedWorkspace);
    } catch (Exception e) {
      logger.log(Level.WARNING, String.format("could not index workspace #%s/%s", workspace.getIdentifier(), workspace.getSchoolDataSource()), e);
    }
  }
  
  public void removeWorkspace(SchoolDataIdentifier identifier) {
    removeWorkspace(identifier.getDataSource(), identifier.getIdentifier());
  }

  public void removeWorkspace(String dataSource, String identifier) {
    try {
      indexer.remove(IndexedWorkspace.INDEX_NAME, IndexedWorkspace.TYPE_NAME, String.format("%s/%s", identifier, dataSource));
    } catch (Exception ex) {
      logger.log(Level.SEVERE, String.format("Removal of workspace %s/%s from index failed", dataSource, identifier), ex);
    } 
  }

  private IndexedWorkspace workspaceToIndexedWorkspace(Workspace workspace, WorkspaceEntity workspaceEntity) {
    IndexedWorkspace indexedWorkspace = new IndexedWorkspace();

    String educationTypeName = null;
    
    if (workspace.getEducationTypeIdentifier() != null) {
      SchoolDataIdentifier educationTypeIdentifier = workspace.getEducationTypeIdentifier();
      EducationType educationType = courseMetaController.findEducationType(educationTypeIdentifier);
      if (educationType != null) {
        educationTypeName = educationType.getName();
      }
    }
    
    indexedWorkspace.setIdentifier(new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource()));
    indexedWorkspace.setName(workspace.getName());
    indexedWorkspace.setNameExtension(workspace.getNameExtension());
    indexedWorkspace.setViewLink(workspace.getViewLink());
    indexedWorkspace.setWorkspaceTypeId(workspace.getWorkspaceTypeId());
    indexedWorkspace.setDescription(workspace.getDescription());
    indexedWorkspace.setEducationTypeName(educationTypeName);
    indexedWorkspace.setEducationTypeIdentifier(workspace.getEducationTypeIdentifier());
    indexedWorkspace.setEducationSubtypeIdentifier(workspace.getEducationSubtypeIdentifier());
    indexedWorkspace.setOrganizationIdentifier(workspace.getOrganizationIdentifier());
    indexedWorkspace.setLastModified(workspace.getLastModified());
    indexedWorkspace.setTemplate(workspace.isTemplate());
    indexedWorkspace.setAccess(workspaceEntity.getAccess());
    indexedWorkspace.setPublished(workspaceEntity.getPublished());
    indexedWorkspace.setBeginDate(workspace.getBeginDate());
    indexedWorkspace.setEndDate(workspace.getEndDate());
    indexedWorkspace.setSignupStart(workspace.getSignupStart());
    indexedWorkspace.setSignupEnd(workspace.getSignupEnd());
    
    Set<SchoolDataIdentifier> curriculumIdentifiers = workspace.getCurriculumIdentifiers() != null
        ? new HashSet<>(workspace.getCurriculumIdentifiers()) : null;
    indexedWorkspace.setCurriculumIdentifiers(curriculumIdentifiers);

    List<WorkspaceUser> staffMembers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
    
    for (WorkspaceUser staffMember : staffMembers) {
      SchoolDataIdentifier staffMemberIdentifier = staffMember.getUserIdentifier();
      
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(staffMemberIdentifier);
      UserEntityName userEntityName = userEntity != null ? userEntityController.getName(userEntity, false) : null;
      
      if (userEntityName != null) {
        indexedWorkspace.addStaffMember(new IndexedWorkspaceUser(staffMemberIdentifier, 
            userEntityName.getFirstName(), userEntityName.getLastName()));
      } else {
        /**
         * Fallback to fetch the user name the slower way
         */
        User staffMemberUser = userController.findUserByIdentifier(staffMemberIdentifier);
        if (staffMemberUser != null) {
          indexedWorkspace.addStaffMember(new IndexedWorkspaceUser(staffMemberIdentifier, 
              staffMemberUser.getFirstName(), staffMemberUser.getLastName()));
        } else {
          String userId = staffMember.getUserIdentifier() != null ? staffMember.getUserIdentifier().toId() : "NULL";
          
          logger.warning(String.format("Couldn't find staffmember #%s in workspace %s", userId, 
              workspace.getIdentifier(), workspace.getSchoolDataSource()));
        }
      }
    }

    for (WorkspaceSubject workspaceSubject : workspace.getSubjects()) {
      IndexedWorkspaceSubject indexedWorkspaceSubject = new IndexedWorkspaceSubject();
      
      indexedWorkspaceSubject.setIdentifier(workspaceSubject.getIdentifier());
      indexedWorkspaceSubject.setCourseNumber(workspaceSubject.getCourseNumber());
      indexedWorkspaceSubject.setLength(workspaceSubject.getLength());
      indexedWorkspaceSubject.setLengthUnitIdentifier(workspaceSubject.getLengthUnitIdentifier());
      indexedWorkspaceSubject.setSubjectIdentifier(workspaceSubject.getSubjectIdentifier());
      
      Subject subject = workspaceSubject.getSubjectIdentifier() != null ? courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier()) : null;
      if (subject != null) {
        indexedWorkspaceSubject.setSubjectName(subject.getName());
        indexedWorkspaceSubject.setSubjectCode(subject.getCode());
      }
      
      CourseLengthUnit courseLengthUnit = workspaceSubject.getLengthUnitIdentifier() != null ? courseMetaController.findCourseLengthUnit(workspaceSubject.getLengthUnitIdentifier()) : null;
      if (courseLengthUnit != null) {
        indexedWorkspaceSubject.setLengthUnitSymbol(courseLengthUnit.getSymbol());
        indexedWorkspaceSubject.setLengthUnitName(courseLengthUnit.getName());
      }
      
      indexedWorkspace.addSubject(indexedWorkspaceSubject);
    }
    
    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
    indexedWorkspace.setSignupPermissionGroups(workspaceSignupGroups);

    return indexedWorkspace;
  }
  
}

