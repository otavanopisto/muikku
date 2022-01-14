package fi.otavanopisto.muikku.plugins.search;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
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

    indexedWorkspace.setIdentifier(new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource()));
    indexedWorkspace.setName(workspace.getName());
    indexedWorkspace.setNameExtension(workspace.getNameExtension());
    indexedWorkspace.setViewLink(workspace.getViewLink());
    indexedWorkspace.setWorkspaceTypeId(workspace.getWorkspaceTypeId());
    indexedWorkspace.setDescription(workspace.getDescription());
    indexedWorkspace.setEducationTypeIdentifier(workspace.getEducationTypeIdentifier());
    indexedWorkspace.setEducationSubtypeIdentifier(workspace.getEducationSubtypeIdentifier());
    indexedWorkspace.setOrganizationIdentifier(workspace.getOrganizationIdentifier());
    indexedWorkspace.setLastModified(workspace.getLastModified());
    indexedWorkspace.setBeginDate(workspace.getBeginDate());
    indexedWorkspace.setEndDate(workspace.getEndDate());
    indexedWorkspace.setTemplate(workspace.isTemplate());
    indexedWorkspace.setAccess(workspaceEntity.getAccess());
    indexedWorkspace.setPublished(workspaceEntity.getPublished());
    
    Set<SchoolDataIdentifier> curriculumIdentifiers = workspace.getCurriculumIdentifiers() != null
        ? new HashSet<>(workspace.getCurriculumIdentifiers()) : null;
    indexedWorkspace.setCurriculumIdentifiers(curriculumIdentifiers);

    List<WorkspaceUser> staffMembers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
    
    for (WorkspaceUser staffMember : staffMembers) {
      // TODO: more efficient name fetching
      User staffMemberUser = userController.findUserByIdentifier(staffMember.getUserIdentifier());
      
      if (staffMemberUser != null) {
        indexedWorkspace.addStaffMember(new IndexedWorkspaceUser(staffMember.getUserIdentifier(), 
            staffMemberUser.getFirstName(), staffMemberUser.getLastName()));
      } else {
        String userId = staffMember.getUserIdentifier() != null ? staffMember.getUserIdentifier().toId() : "NULL";
        
        logger.warning(String.format("Couldn't find staffmember #%s in workspace %s", userId, 
            workspace.getIdentifier(), workspace.getSchoolDataSource()));
      }
    }

    for (WorkspaceSubject workspaceSubject : workspace.getSubjects()) {
      IndexedWorkspaceSubject indexedWorkspaceSubject = new IndexedWorkspaceSubject();
      
      indexedWorkspaceSubject.setCourseNumber(workspaceSubject.getCourseNumber());
      indexedWorkspaceSubject.setLength(workspaceSubject.getLength());
      indexedWorkspaceSubject.setLengthUnitIdentifier(workspaceSubject.getLengthUnitIdentifier());
      indexedWorkspaceSubject.setSubjectIdentifier(workspaceSubject.getSubjectIdentifier());
      
      Subject subject = courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier());
      indexedWorkspaceSubject.setSubjectName(subject.getName());
      
      indexedWorkspace.addSubject(indexedWorkspaceSubject);
    }
    
    Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
    indexedWorkspace.setSignupPermissionGroups(workspaceSignupGroups);

    return indexedWorkspace;
  }
  
}

