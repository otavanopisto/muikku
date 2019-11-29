package fi.otavanopisto.muikku.plugins.search;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
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

  public void indexWorkspace(String dataSource, String indentifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, indentifier);
      if (workspaceEntity != null) {
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
        if (workspace != null) {
          indexWorkspace(workspace, workspaceEntity);
        }
      } else {
        logger.warning(String.format("could not index workspace because workspace entity #%s/%s could not be found", indentifier, dataSource));
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
      Map<String, Object> extra = new HashMap<>();
      extra.put("published", workspaceEntity.getPublished());
      extra.put("access", workspaceEntity.getAccess());

      if (workspace.getSubjectIdentifier() != null) {
        Subject subject = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier());
        extra.put("subject", subject.getName());
      }
      
      if (workspaceEntity.getOrganizationEntity() != null) {
        OrganizationEntity organizationEntity = workspaceEntity.getOrganizationEntity();
        SchoolDataIdentifier identifier = organizationEntity.schoolDataIdentifier();
        extra.put("organizationIdentifier", identifier.toId());
      }
      
      List<WorkspaceUser> staffMembers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
      Set<IndexedWorkspaceUser> indexedWorkspaceStaffMembers = new HashSet<IndexedWorkspaceUser>();
      
      for (WorkspaceUser staffMember : staffMembers) {
        // TODO: more efficient name fetching
        User staffMemberUser = userController.findUserByIdentifier(staffMember.getUserIdentifier());
        
        if (staffMemberUser != null) {
          indexedWorkspaceStaffMembers.add(new IndexedWorkspaceUser(staffMember.getUserIdentifier(), 
              staffMemberUser.getFirstName(), staffMemberUser.getLastName()));
        } else {
          String userId = staffMember.getUserIdentifier() != null ? staffMember.getUserIdentifier().toId() : "NULL";
          
          logger.warning(String.format("Couldn't find staffmember #%s in workspace %s", userId, 
              workspace.getIdentifier(), workspace.getSchoolDataSource()));
        }
      }
      extra.put("staffMembers", indexedWorkspaceStaffMembers);
      
      indexer.index(Workspace.class.getSimpleName(), workspace, extra);
    } catch (Exception e) {
      logger.warning(String.format("could not index workspace #%s/%s", workspace.getIdentifier(), workspace.getSchoolDataSource()));
    }
  }
  
}

