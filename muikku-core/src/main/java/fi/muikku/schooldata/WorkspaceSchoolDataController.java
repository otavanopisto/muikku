package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceTypeSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.model.workspace.WorkspaceTypeSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Dependent
@Stateful
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

  @Inject
	private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;
	
	@Inject
	private WorkspaceTypeSchoolDataIdentifierDAO workspaceTypeSchoolDataIdentifierDAO;

	@Inject
	private WorkspaceUserEntityDAO workspaceUserEntityDAO;
	
	@Inject
	@SchoolDataBridgeEntityInitiator ( entity = Workspace.class )
	private Instance<SchoolDataEntityInitiator<Workspace>> workspaceInitiators;

	@Inject
	@SchoolDataBridgeEntityInitiator ( entity = WorkspaceType.class )
	private Instance<SchoolDataEntityInitiator<WorkspaceType>> workspaceTypeInitiators;

	@Inject
	@SchoolDataBridgeEntityInitiator ( entity = WorkspaceUser.class )
	private Instance<SchoolDataEntityInitiator<WorkspaceUser>> workspaceUserInitiators;
	
	/* Workspaces */
	
	public Workspace findWorkspace(WorkspaceEntity workspaceEntity) {
		WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceEntity.getDataSource());
		if (workspaceBridge != null) {
  		try {
				return initWorkspace(workspaceBridge.findWorkspace(workspaceEntity.getIdentifier()));
  		} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding workspace", e);
			} catch (SchoolDataBridgeRequestException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding workspace", e);
			}
		} else {
			logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceEntity.getDataSource());
		}
		
		return null;
	}
	
	public List<Workspace> listWorkspaces() {
		// TODO: This method WILL cause performance problems, replace with something more sensible 
		
		List<Workspace> result = new ArrayList<>();
		
		for (WorkspaceSchoolDataBridge workspaceBridge : getWorkspaceBridges()) {
			try {
				result.addAll(workspaceBridge.listWorkspaces());
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspaces", e);
			}
		}
		
		return initWorkspaces(result);
	}

	public List<Workspace> listWorkspacesByCourseIdentifier(CourseIdentifier courseIdentifier) {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(courseIdentifier.getSchoolDataSource());
		if (schoolDataSource != null) {
  		WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(schoolDataSource);
  		if (workspaceBridge != null) {
    		try {
  				return initWorkspaces(workspaceBridge.listWorkspacesByCourseIdentifier(courseIdentifier.getIdentifier()));
    		} catch (UnexpectedSchoolDataBridgeException e) {
  				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspaces by course identifier", e);
  			}
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
	
	public WorkspaceTypeEntity findWorkspaceTypeEntity(WorkspaceType workspaceType) {
		// TODO: Proper error handling
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceType.getSchoolDataSource());
		if (schoolDataSource != null) {
	  	WorkspaceTypeSchoolDataIdentifier workspaceTypeSchoolDataIdentifier = workspaceTypeSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, workspaceType.getIdentifier());
	  	if (workspaceTypeSchoolDataIdentifier != null) {
	  		return workspaceTypeSchoolDataIdentifier.getWorkspaceTypeEntity();
	  	}
		} 

		return null;
	}
	
	/* Workspace Types */
	
	public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(String schoolDataSourceIdentifier, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSourceIdentifier);
		if (schoolDataSource != null) {
			return findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
		} 
		
		return null;
	}
	
	public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		WorkspaceSchoolDataBridge schoolDataBridge = getWorkspaceBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			return initWorkspaceType(schoolDataBridge.findWorkspaceType(identifier));
		} else {
			logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
		}
		
		return null;
	}

	public List<WorkspaceType> listWorkspaceTypes() {
		// TODO: This method WILL cause performance problems, replace with something more sensible 
		
		List<WorkspaceType> result = new ArrayList<>();
		
		for (WorkspaceSchoolDataBridge workspaceBridge : getWorkspaceBridges()) {
			try {
				result.addAll(workspaceBridge.listWorkspaceTypes());
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace types", e);
			} catch (SchoolDataBridgeRequestException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace types", e);
			}
		}
		
		return initWorkspaceTypes(result);
	}
	
	public List<WorkspaceType> listWorkspaceTypes(WorkspaceTypeEntity workspaceTypeEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<WorkspaceType> workspaceTypes = new ArrayList<>();
		
		List<WorkspaceTypeSchoolDataIdentifier> typeIdentifiers = workspaceTypeSchoolDataIdentifierDAO.listByWorkspaceTypeEntity(workspaceTypeEntity);
		for (WorkspaceTypeSchoolDataIdentifier typeIdentifier : typeIdentifiers) {
			WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(typeIdentifier.getDataSource());
			if (workspaceBridge != null) {
				workspaceTypes.add(workspaceBridge.findWorkspaceType(typeIdentifier.getIdentifier()));
			} else {
				logger.log(Level.SEVERE, "School Data Bridge not found: " + typeIdentifier.getDataSource().getIdentifier());
			}
		}
		
		
		return initWorkspaceTypes(workspaceTypes);
	}
	
	/* Workspace Users */

  public WorkspaceUser createWorkspaceUser(Workspace workspace, User user) {
    WorkspaceEntity workspaceEntity = findWorkspaceEntity(workspace);

    WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceEntity.getDataSource());
    if (workspaceBridge != null) {
      try {
        return initWorkspaceUser(workspaceBridge.createWorkspaceUser(workspace, user));
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while creating workspace user", e);
      } catch (SchoolDataBridgeRequestException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while creating workspace user", e);
      }
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
        return initWorkspaceUser(workspaceBridge.findWorkspaceUser(workspaceUserEntity.getIdentifier()));
      } catch (UnexpectedSchoolDataBridgeException e) {
        logger.log(Level.SEVERE, "School Data Bridge reported a problem while finding workspace", e);
      }
    } else {
      logger.log(Level.SEVERE, "School Data Bridge not found: " + workspaceEntity.getDataSource());
    }
    
    return null;
  }
	
	public List<WorkspaceUser> listWorkspaceUsers(Workspace workspace) {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
		if (schoolDataSource != null) {
			WorkspaceSchoolDataBridge schoolDataBridge = getWorkspaceBridge(schoolDataSource);
			if (schoolDataBridge != null) {
				try {
					return initWorkspaceUsers(schoolDataBridge.listWorkspaceUsers(workspace.getIdentifier()));
				} catch (UnexpectedSchoolDataBridgeException e) {
					logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace users", e);
				} catch (SchoolDataBridgeRequestException e) {
					logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace users", e);
				}
			} else {
				logger.log(Level.SEVERE, "School Data Bridge not found: " + schoolDataSource.getIdentifier());
			}
		}

		return null;
	}
	
	/* Workspace User Entities */
	  
  public WorkspaceUserEntity findWorkspaceUserEntity(WorkspaceUser workspaceUser) {
    SchoolDataSource workspaceSchoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceUser.getWorkspaceSchoolDataSource());
    SchoolDataSource userSchoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceUser.getUserSchoolDataSource());

    WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(workspaceSchoolDataSource, workspaceUser.getWorkspaceIdentifier());
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(userSchoolDataSource, workspaceUser.getUserIdentifier());
    UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
    
    return workspaceUserEntityDAO.findByWorkspaceAndUser(workspaceEntity, userEntity);
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
	
	private List<WorkspaceSchoolDataBridge> getWorkspaceBridges() {
		List<WorkspaceSchoolDataBridge> result = new ArrayList<>();
		
		Iterator<WorkspaceSchoolDataBridge> iterator = workspaceBridges.iterator();
		while (iterator.hasNext()) {
			result.add(iterator.next());
		}
		
		return Collections.unmodifiableList(result);
	}
	
	/* Initiators */

	private Workspace initWorkspace(Workspace workspace) {
		if (workspace == null) {
			return null;
		}
		
		Iterator<SchoolDataEntityInitiator<Workspace>> initiatorIterator = workspaceInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			workspace = initiatorIterator.next().single(workspace);
		}
		
		return workspace;
	};
	
	private List<Workspace> initWorkspaces(List<Workspace> workspaces) {
		if (workspaces == null) {
			return null;
		}
		
		if (workspaces.size() == 0) {
			return workspaces;
		}
		
		Iterator<SchoolDataEntityInitiator<Workspace>> initiatorIterator = workspaceInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			workspaces = initiatorIterator.next().list(workspaces);
		}
		
		return workspaces;
	};

	private WorkspaceType initWorkspaceType(WorkspaceType workspaceType) {
		if (workspaceType == null) {
			return null;
		}
		
		Iterator<SchoolDataEntityInitiator<WorkspaceType>> initiatorIterator = workspaceTypeInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			workspaceType = initiatorIterator.next().single(workspaceType);
		}
		
		return workspaceType;
	};
	
	private List<WorkspaceType> initWorkspaceTypes(List<WorkspaceType> workspaceTypes) {
		if (workspaceTypes == null) {
			return null;
		}
		
		if (workspaceTypes.size() == 0) {
			return workspaceTypes;
		}
		
		Iterator<SchoolDataEntityInitiator<WorkspaceType>> initiatorIterator = workspaceTypeInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			workspaceTypes = initiatorIterator.next().list(workspaceTypes);
		}
		
		return workspaceTypes;
	};

	private WorkspaceUser initWorkspaceUser(WorkspaceUser workspaceUser) {
		if (workspaceUser == null) {
			return null;
		}
		
		Iterator<SchoolDataEntityInitiator<WorkspaceUser>> initiatorIterator = workspaceUserInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			workspaceUser = initiatorIterator.next().single(workspaceUser);
		}
		
		return workspaceUser;
	};
	
	private List<WorkspaceUser> initWorkspaceUsers(List<WorkspaceUser> workspaceUsers) {
		if (workspaceUsers == null) {
			return null;
		}
		
		if (workspaceUsers.size() == 0) {
			return workspaceUsers;
		}
		
		Iterator<SchoolDataEntityInitiator<WorkspaceUser>> initiatorIterator = workspaceUserInitiators.iterator();
		while (initiatorIterator.hasNext()) {
			workspaceUsers = initiatorIterator.next().list(workspaceUsers);
		}
		
		return workspaceUsers;
	}
}
