package fi.otavanopisto.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.entity.CourseIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceType;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

class WorkspaceSchoolDataController { 
  
  // TODO: Caching 
  // TODO: Events
  
  @Inject
  private Logger logger;
  
  @Inject
  @Any
  private Instance<WorkspaceSchoolDataBridge> workspaceBridges;
  
  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;
  
  /* Workspaces */

  public Workspace createWorkspace(String schoolDataSourceIdentifier, String name, String description, WorkspaceType type, String courseIdentifierIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSourceIdentifier);
    
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
    if (workspaceBridge != null) {
      return workspaceBridge.createWorkspace(name, description, type, courseIdentifierIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource);
    }
    
    return null;
  }
  
  public Workspace findWorkspace(WorkspaceEntity workspaceEntity) {
    return findWorkspace(workspaceEntity.getDataSource(), workspaceEntity.getIdentifier());
  }

  public Workspace findWorkspace(SchoolDataSource schoolDataSource, String identifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
    if (workspaceBridge != null) {
      return workspaceBridge.findWorkspace(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource);
    }
    
    return null;
  }

  public List<Workspace> listWorkspaces(String schoolDataSource) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
    if (workspaceBridge != null) {
      return workspaceBridge.listWorkspaces();
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource);
    }
   
    return null;
  }
  
  public List<Workspace> listWorkspaces() {
    // TODO: This method WILL cause performance problems, replace with something more sensible 
    
    List<Workspace> result = new ArrayList<>();
    
    for (WorkspaceSchoolDataBridge workspaceBridge : getWorkspaceBridges()) {
      result.addAll(workspaceBridge.listWorkspaces());
    }
    
    return result;
  }

  public Workspace copyWorkspace(SchoolDataIdentifier workspaceIdentifier, String name, String nameExtension, String description, SchoolDataIdentifier destinationOrganizationIdentifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceIdentifier.getDataSource());
    if (workspaceBridge != null) {
      return workspaceBridge.copyWorkspace(workspaceIdentifier, name, nameExtension, description, destinationOrganizationIdentifier);
    } else {
      logger.log(Level.SEVERE, String.format("School Data Bridge not found: %s", workspaceIdentifier));
    }
    
    return null;
  }

  public Workspace updateWorkspace(Workspace workspace) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspace.getSchoolDataSource());
    if (workspaceBridge != null) {
      return workspaceBridge.updateWorkspace(workspace);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspace.getSchoolDataSource());
    }
    
    return null;
  }

  public void removeWorkspace(Workspace workspace) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspace.getSchoolDataSource());
    if (workspaceBridge != null) {
      workspaceBridge.removeWorkspace(workspace.getIdentifier());
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspace.getSchoolDataSource());
    }
  }

  public List<Workspace> listWorkspacesByCourseIdentifier(CourseIdentifier courseIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(courseIdentifier.getSchoolDataSource());
    if (schoolDataSource != null) {
      WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
      if (workspaceBridge != null) {
        return workspaceBridge.listWorkspacesByCourseIdentifier(courseIdentifier.getIdentifier());
      } else {
        logger.log(Level.SEVERE, "School Data Bridge not found: " + courseIdentifier.getSchoolDataSource());
      }
    } else {
      logger.log(Level.SEVERE, "School Data Source not found: " + courseIdentifier.getSchoolDataSource());
    }
    
    return null;
  }
  
  /* Workspace Entities */
  
  public WorkspaceEntity findWorkspaceEntity(Workspace workspace) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
    WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, workspace.getIdentifier());
    return workspaceEntity;
  }

  /* Workspace Types */
  
  public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(String schoolDataSourceIdentifier, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSourceIdentifier);
    if (schoolDataSource != null) {
      return findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
    } 
    
    return null;
  }
  
  public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    WorkspaceSchoolDataBridge schoolDataBridge = getWorkspaceBridge(schoolDataSource);
    if (schoolDataBridge != null) {
      return schoolDataBridge.findWorkspaceType(identifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
    }
    
    return null;
  }

  public List<WorkspaceType> listWorkspaceTypes() {
    List<WorkspaceType> result = new ArrayList<>();
    
    for (WorkspaceSchoolDataBridge workspaceBridge : getWorkspaceBridges()) {
      result.addAll(workspaceBridge.listWorkspaceTypes());
    }
    
    return result;
  }
  
  /* Workspace Users */

  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user, String roleSchoolDataSource, String roleIdentifier) {
    WorkspaceEntity workspaceEntity = findWorkspaceEntity(workspace);

    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceEntity.getDataSource());
    if (workspaceBridge != null) {
      return workspaceBridge.createWorkspaceUser(workspace, user, roleSchoolDataSource, roleIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceEntity.getDataSource());
    }
    
    return null;
  }
  
  public WorkspaceUser findWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceEntity.getDataSource());
    if (workspaceBridge != null) {
      try {
        SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
        
        SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getIdentifier(), 
            workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
        
        return workspaceBridge.findWorkspaceUser(workspaceIdentifier, workspaceUserIdentifier);
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding workspace", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceEntity.getDataSource());
    }
    
    return null;
  }
  
  public WorkspaceUser findWorkspaceUserByWorkspaceAndUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userIdentifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceIdentifier.getDataSource());
    if (workspaceBridge != null) {
      return workspaceBridge.findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceIdentifier.getDataSource());
    }
    return null;
  }
  
  public WorkspaceUser findWorkspaceUser(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier workspaceUserIdentifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceIdentifier.getDataSource());
    if (workspaceBridge != null) {
      try {
        return workspaceBridge.findWorkspaceUser(workspaceIdentifier, workspaceUserIdentifier);
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding workspace", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceIdentifier.getDataSource());
    }
    
    return null;
  }
  
  @Deprecated
  public List<WorkspaceUser> listWorkspaceUsers(Workspace workspace) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
    if (schoolDataSource != null) {
      WorkspaceSchoolDataBridge schoolDataBridge = getWorkspaceBridge(schoolDataSource);
      if (schoolDataBridge != null) {
        return schoolDataBridge.listWorkspaceUsers(workspace.getIdentifier());
      } else {
        logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
      }
    }

    return null;
  }
  
  public void updateWorkspaceStudentActivity(WorkspaceUser workspaceUser, boolean activity) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceUser.getUserIdentifier().getDataSource());
    if (schoolDataSource != null) {
      WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
      if (workspaceBridge != null) {
        workspaceBridge.updateWorkspaceStudentActivity(workspaceUser, activity);
      }
    }
  }

  public List<WorkspaceUser> listWorkspaceStudents(Workspace workspace) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
    if (schoolDataSource != null) {
      WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
      if (workspaceBridge != null) {
        return workspaceBridge.listWorkspaceStudents(workspace.getIdentifier());
      }
    }
    return Collections.<WorkspaceUser>emptyList();
  }

  public List<WorkspaceUser> listWorkspaceStudents(Workspace workspace, boolean active) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
    if (schoolDataSource != null) {
      WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
      if (workspaceBridge != null) {
        return workspaceBridge.listWorkspaceStudents(workspace.getIdentifier(), active);
      }
    }
    return Collections.<WorkspaceUser>emptyList();
  }

  public List<WorkspaceUser> listWorkspaceStaffMembers(Workspace workspace) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
    if (schoolDataSource != null) {
      WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
      if (workspaceBridge != null) {
        return workspaceBridge.listWorkspaceStaffMembers(workspace.getIdentifier());
      }
    }
    return Collections.<WorkspaceUser>emptyList();
  }
  
  private WorkspaceSchoolDataBridge getWorkspaceBridge(SchoolDataSource schoolDataSource) {
    Iterator<WorkspaceSchoolDataBridge> iterator = workspaceBridges.iterator();
    while (iterator.hasNext()) {
      WorkspaceSchoolDataBridge workspaceSchoolDataBridge = iterator.next();
      if (workspaceSchoolDataBridge.getSchoolDataSource().equals(schoolDataSource.getIdentifier())) {
        return workspaceSchoolDataBridge;
      }
    }
    
    return null;
  }
  
  private WorkspaceSchoolDataBridge getWorkspaceBridge(String schoolDataSourceIdentifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSourceIdentifier);
    if (schoolDataSource != null) {
      return getWorkspaceBridge(schoolDataSource);
    }
    
    return null;
  }
  
  private List<WorkspaceSchoolDataBridge> getWorkspaceBridges() {
    List<WorkspaceSchoolDataBridge> result = new ArrayList<>();
    
    Iterator<WorkspaceSchoolDataBridge> iterator = workspaceBridges.iterator();
    while (iterator.hasNext()) {
      result.add(iterator.next());
    }
    
    return Collections.unmodifiableList(result);
  }

  public void addWorkspaceSignupGroup(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userGroupIdentifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceIdentifier.getDataSource());
    if (workspaceBridge != null) {
      try {
        workspaceBridge.addWorkspaceSignupGroup(workspaceIdentifier, userGroupIdentifier);
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceIdentifier.getDataSource());
    }
  }
  
  public void removeWorkspaceSignupGroup(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier userGroupIdentifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceIdentifier.getDataSource());
    if (workspaceBridge != null) {
      try {
        workspaceBridge.removeWorkspaceSignupGroup(workspaceIdentifier, userGroupIdentifier);
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceIdentifier.getDataSource());
    }
  }
  
  public Set<SchoolDataIdentifier> listWorkspaceSignupGroups(SchoolDataIdentifier workspaceIdentifier) {
    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceIdentifier.getDataSource());
    if (workspaceBridge != null) {
      try {
        return workspaceBridge.listWorkspaceSignupGroups(workspaceIdentifier);
      } catch (SchoolDataBridgeInternalException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceIdentifier.getDataSource());
    }
    
    return null;
  }
  
}
