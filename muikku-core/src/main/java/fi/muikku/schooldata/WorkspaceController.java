package fi.muikku.schooldata;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceTypeEntityDAO;
import fi.muikku.dao.workspace.WorkspaceTypeSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceSettings;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.model.workspace.WorkspaceTypeSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.muikku.security.LoggedIn;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;

@Dependent
@Stateless
public class WorkspaceController {
	
	@Inject
	private Logger logger;
	
	@Inject
	private WorkspaceSchoolDataController workspaceSchoolDataController;

	@Inject
	private WorkspaceEntityDAO workspaceEntityDAO;
	
	@Inject
	private WorkspaceTypeEntityDAO workspaceTypeEntityDAO; 

	@Inject
	private WorkspaceTypeSchoolDataIdentifierDAO workspaceTypeSchoolDataIdentifierDAO;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private SessionController sessionController;
	
	@Inject
	private WorkspaceSettingsDAO courseSettingsDAO;

	@Inject
	private WorkspaceUserEntityDAO workspaceUserEntityDAO;
	
	/* WorkspaceTypeEntity */
	
	public List<WorkspaceTypeEntity> listWorkspaceTypeEntities() {
		return workspaceTypeEntityDAO.listAll();
	}

	public WorkspaceTypeEntity findWorkspaceTypeEntity(WorkspaceType workspaceType) {
		return workspaceSchoolDataController.findWorkspaceTypeEntity(workspaceType);
	}
	
	public WorkspaceTypeEntity updateWorkspaceTypeEntityName(WorkspaceTypeEntity workspaceTypeEntity, String name) {
		return workspaceTypeEntityDAO.updateName(workspaceTypeEntity, name);
	}

	/* WorkspaceType */

	public WorkspaceTypeEntity findWorkspaceTypeEntityById(Long id) {
		return workspaceTypeEntityDAO.findById(id);
	}
	
	public List<WorkspaceType> listWorkspaceTypes() {
		return workspaceSchoolDataController.listWorkspaceTypes();
	}
	
	public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
		try {
			return workspaceSchoolDataController.findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
		} catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
			logger.log(Level.SEVERE, "School Data Bride reported an error while retriving WorkspaceType");
			return null;
		}
	}
	
	public WorkspaceTypeEntity findWorkspaceTypeEntityByDataSourceAndIdentifier(String schoolDataSource, String identifier) {
		WorkspaceType workspaceType = findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
		if (workspaceType != null) {
		  return findWorkspaceTypeEntity(workspaceType);
		}
		
		return null;
	}

	public void setWorkspaceTypeEntity(WorkspaceType workspaceType, WorkspaceTypeEntity workspaceTypeEntity) {
		// TODO: Proper error handling
		
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceType.getSchoolDataSource());
		if (schoolDataSource != null) {
		  WorkspaceTypeSchoolDataIdentifier schoolDataIdentifier = workspaceTypeSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, workspaceType.getIdentifier());
		  if (schoolDataIdentifier == null) {
		  	if (workspaceTypeEntity != null) {
		  	  workspaceTypeSchoolDataIdentifierDAO.create(schoolDataSource, workspaceType.getIdentifier(), workspaceTypeEntity);
		  	}
		  } else {
		  	if (workspaceTypeEntity == null) {
		  		workspaceTypeSchoolDataIdentifierDAO.delete(schoolDataIdentifier);
		  	} else {
  		  	if (!schoolDataIdentifier.getWorkspaceTypeEntity().getId().equals(workspaceTypeEntity.getId())) {
	  	  		workspaceTypeSchoolDataIdentifierDAO.updateWorkspaceTypeEntity(schoolDataIdentifier, workspaceTypeEntity);
  		  	}
		  	}
		  }
		}
	}

	/* Workspace */

	public Workspace findWorkspace(WorkspaceEntity workspaceEntity) {
		return workspaceSchoolDataController.findWorkspace(workspaceEntity);
	}

	public List<Workspace> listWorkspaces() {
		return workspaceSchoolDataController.listWorkspaces();
	}

	public List<Workspace> listWorkspacesByCourseIdentifier(CourseIdentifier courseIdentifier) {
		return workspaceSchoolDataController.listWorkspacesByCourseIdentifier(courseIdentifier);
	}
	
	/* Workspace Entity */
	
	public WorkspaceEntity findWorkspaceEntity(Workspace workspace) {
		return workspaceSchoolDataController.findWorkspaceEntity(workspace);
	}
	
	public WorkspaceEntity findWorkspaceEntityById(Long workspaceId) {
		return workspaceEntityDAO.findById(workspaceId);
	}

	public WorkspaceEntity findWorkspaceEntityByUrlName(String urlName) {
		return workspaceEntityDAO.findByUrlName(urlName);
	}

  public List<WorkspaceEntity> listWorkspaceEntities() {
    return workspaceEntityDAO.listAll();
  }
	
	/* WorkspaceUsers */
	
	public List<WorkspaceUser> listWorkspaceUsers(Workspace workspace) {
		return workspaceSchoolDataController.listWorkspaceUsers(workspace);
	}

	public List<WorkspaceUser> listWorkspaceUsers(WorkspaceEntity workspaceEntity) {
		Workspace workspace = findWorkspace(workspaceEntity);
		if (workspace != null) {
		  return workspaceSchoolDataController.listWorkspaceUsers(workspace);
		} 

		return null;
	}

	public int countWorkspaceUsers(WorkspaceEntity workspaceEntity) {
		// TODO Optimize
		return listWorkspaceUsers(workspaceEntity).size();
	}

	/* WorkspaceUserEntity */
	
  public List<WorkspaceUserEntity> listWorkspaceUserEntities(WorkspaceEntity workspaceEntity) {
    return workspaceUserEntityDAO.listByWorkspace(workspaceEntity);
  }

  public List<WorkspaceUserEntity> listWorkspaceEntitiesByUser(UserEntity userEntity) {
    return workspaceUserEntityDAO.listByUser(userEntity);
  }

  public WorkspaceUserEntity findWorkspaceUserEntityByWorkspaceAndUser(WorkspaceEntity workspaceEntity, UserEntity user) {
    return workspaceUserEntityDAO.findByWorkspaceAndUser(workspaceEntity, user);
  }

  @LoggedIn
//  @Permit(MuikkuPermissions.JOIN_COURSE)
  public WorkspaceUserEntity joinCourse(@PermitContext WorkspaceEntity workspaceEntity) {
    // TODO school bridge how to?
    
    UserEntity loggedUser = sessionController.getUser();
  
    WorkspaceSettings workspaceSettings = courseSettingsDAO.findByCourse(workspaceEntity);
    WorkspaceRoleEntity workspaceUserRole = workspaceSettings.getDefaultWorkspaceUserRole();
    
    WorkspaceUserEntity workspaceUser = workspaceUserEntityDAO.create(loggedUser, workspaceEntity, workspaceUserRole);
    
//    fireCourseUserCreatedEvent(courseUser);
    
    return workspaceUser;
  }
  
}
