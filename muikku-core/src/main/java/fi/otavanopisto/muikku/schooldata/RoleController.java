package fi.otavanopisto.muikku.schooldata;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.RoleEntityDAO;
import fi.otavanopisto.muikku.dao.users.RoleSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.dao.users.SystemRoleEntityDAO;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.users.SystemRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.schooldata.entity.Role;

public class RoleController {

  @Inject
  private Logger logger;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private RoleEntityDAO roleEntityDAO;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO;

  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO;

  @Inject
  private SystemRoleEntityDAO systemRoleEntityDAO;

  @Inject
  private RoleSchoolDataIdentifierDAO roleSchoolDataIdentifierDAO;
  
  /* Role Entities */

  public RoleEntity findRoleEntityById(Long id) {
    return roleEntityDAO.findById(id);
  }

  public RoleEntity findRoleEntityByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    RoleSchoolDataIdentifier schoolDataIdentifier = roleSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
    if (schoolDataIdentifier != null) {
      return schoolDataIdentifier.getRoleEntity();
    }
    
    return null;
  }

  public RoleEntity findRoleEntityByDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (schoolDataSource != null) {
      return findRoleEntityByDataSourceAndIdentifier(schoolDataSource, identifier);
    } else {
      logger.severe("Could not find school data source: " + dataSource);
      return null;
    }
  }

  public RoleEntity findRoleEntity(Role role) {
    return findRoleEntityByDataSourceAndIdentifier(role.getSchoolDataSource(), role.getIdentifier());
  }
  
  public List<RoleEntity> listRoleEntities() {
    return roleEntityDAO.listAll();
  }
  
  public List<EnvironmentRoleEntity> listEnvironmentRoleEntities() {
    return environmentRoleEntityDAO.listAll();
  }

  public List<SystemRoleEntity> listSystemRoleEntities() {
    return systemRoleEntityDAO.listAll();
  }
  
  /* Workspace Role Entities */
  
  public List<WorkspaceRoleEntity> listWorkspaceRoleEntities() {
    return workspaceRoleEntityDAO.listAll();
  }

  public WorkspaceRoleEntity findWorkspaceRoleEntityById(Long id) {
    return workspaceRoleEntityDAO.findById(id);
  }
  
  public WorkspaceRoleEntity findWorkspaceRoleEntityByName(String name) {
    return workspaceRoleEntityDAO.findByName(name);
  }
  
  public WorkspaceRoleEntity findWorkspaceRoleEntity(Role role) {
    RoleEntity roleEntity = findRoleEntity(role);
    if (roleEntity instanceof WorkspaceRoleEntity) {
      return (WorkspaceRoleEntity) roleEntity;
    }
    
    return null;
  }
  
  /**
   * Returns a WorkspaceRoleEntity matching the given archetype.
   */
  public WorkspaceRoleEntity getWorkspaceRoleByArchetype(WorkspaceRoleArchetype archetype) {
    return workspaceRoleEntityDAO.findByArchetype(archetype);
  }
  
}
