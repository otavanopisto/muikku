package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Stateless
@Dependent
@SchoolDataBridgeEntityInitiator ( entity = WorkspaceUser.class )
public class WorkspaceUserSchoolDataEntityInitiator implements SchoolDataEntityInitiator<WorkspaceUser> {
	
	@Inject
	private Logger logger;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
	private UserEntityDAO userEntityDAO;
  
  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;
  
	@Inject
	private WorkspaceUserEntityDAO workspaceUserEntityDAO;

	@Inject
	@Any
	private Instance<SchoolDataEntityInitiator<WorkspaceUser>> workspaceInitiators;

	@Override
	public WorkspaceUser single(WorkspaceUser workspaceUser) {
	  SchoolDataSource userDataSource = schoolDataSourceDAO.findByIdentifier(workspaceUser.getUserSchoolDataSource());
	  SchoolDataSource workspaceDataSource = schoolDataSourceDAO.findByIdentifier(workspaceUser.getWorkspaceSchoolDataSource());
    
		UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(userDataSource, workspaceUser.getUserIdentifier());
		if (userSchoolDataIdentifier == null) {
      // TODO: Proper error handling
      return null;
    }
		
    UserEntity userEntity = userSchoolDataIdentifier.getUserEntity(); 
		
		WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(workspaceDataSource, workspaceUser.getWorkspaceIdentifier());
		if (workspaceEntity == null) {
      // TODO: Proper error handling
      return null;
    }
		  
		WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityDAO.findByWorkspaceAndUser(workspaceEntity, userEntity);
		if (workspaceUserEntity == null) {
	    WorkspaceRoleEntity roleEntity = null;
	    workspaceUserEntityDAO.create(userEntity, workspaceEntity, workspaceUser.getIdentifier(), roleEntity);
		}

		return workspaceUser;
	}

	@Override
	public List<WorkspaceUser> list(List<WorkspaceUser> workspaces) {
		List<WorkspaceUser> result = new ArrayList<>();
		
		for (WorkspaceUser workspace : workspaces) {
			workspace = single(workspace);
			if (workspace != null) {
				result.add(workspace);
			}
		}
		
		return result;
	}
	
}
