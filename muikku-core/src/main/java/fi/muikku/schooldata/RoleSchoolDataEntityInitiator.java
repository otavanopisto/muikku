package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.EnvironmentRoleType;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.RoleSchoolDataIdentifier;
import fi.muikku.schooldata.entity.Role;

@Stateless
@Dependent
@SchoolDataBridgeEntityInitiator ( entity = Role.class )
public class RoleSchoolDataEntityInitiator implements SchoolDataEntityInitiator<Role> {
	
	@Inject
	private Logger logger;

  @Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO;

  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;
	
	@Override
	public Role single(Role entity) {
	  SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(entity.getSchoolDataSource());
	  RoleSchoolDataIdentifier roleSchoolDataIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, entity.getIdentifier());
	  if (roleSchoolDataIdentifier == null) {
	    RoleEntity roleEntity = null;
	    
	    switch (entity.getType()) {
	      case ENVIRONMENT:
	        EnvironmentRoleType environmentRoleType = EnvironmentRoleType.NORMAL;
	        roleEntity = environmentRoleEntityDAO.create(entity.getName(), environmentRoleType);
	      break;
	      case WORKSPACE:
	        roleEntity = workspaceRoleEntityDAO.create(entity.getName());
	      break;
	    }
	    
	    roleSchoolDataIdentifierDAO.create(dataSource, entity.getIdentifier(), roleEntity);
	  }
	  
	  return entity;
	}
	
	@Override
	public List<Role> list(List<Role> entities) {
    List<Role> result = new ArrayList<>();
    
    for (Role role : entities) {
      role = single(role);
      if (role != null) {
        result.add(role);
      }
    }
    
    return result;
	}
	
}
