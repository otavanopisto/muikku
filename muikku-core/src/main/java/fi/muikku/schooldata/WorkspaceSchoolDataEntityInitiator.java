package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateDAO;
import fi.muikku.dao.workspace.WorkspaceSettingsTemplateRolePermissionDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.muikku.model.workspace.WorkspaceSettingsTemplateRolePermission;
import fi.muikku.schooldata.entity.Workspace;

@Stateless
@Dependent
@SchoolDataBridgeEntityInitiator ( entity = Workspace.class )
public class WorkspaceSchoolDataEntityInitiator implements SchoolDataEntityInitiator<Workspace> {

	private static final int MAX_URL_NAME_LENGTH = 30;
	
	@Inject
	private Logger logger;

	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private WorkspaceEntityDAO workspaceEntityDAO;

  @Inject
  private WorkspaceSettingsDAO workspaceSettingsDAO;

  @Inject
  private WorkspaceRolePermissionDAO workspaceRolePermissionDAO;

  @Inject
  private WorkspaceSettingsTemplateDAO workspaceSettingsTemplateDAO;

  @Inject
  private WorkspaceSettingsTemplateRolePermissionDAO workspaceSettingsTemplateRolePermissionDAO;
  
	@Inject
	@Any
	private Instance<SchoolDataEntityInitiator<Workspace>> workspaceInitiators;

	@Override
	public Workspace single(Workspace workspace) {
		SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
		WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(dataSource, workspace.getIdentifier());
		if (workspaceEntity == null) {
			String urlName = generateUrlName(workspace.getName());
			workspaceEntity = workspaceEntityDAO.create(dataSource, workspace.getIdentifier(), urlName, Boolean.FALSE);
			
			// TODO Correct template here?
			WorkspaceSettingsTemplate workspaceSettingsTemplate = workspaceSettingsTemplateDAO.findById(1l);
			workspaceSettingsDAO.create(workspaceEntity, workspaceSettingsTemplate.getDefaultWorkspaceUserRole());
			
			List<WorkspaceSettingsTemplateRolePermission> permissionTemplates = workspaceSettingsTemplateRolePermissionDAO.listByTemplate(workspaceSettingsTemplate);
			for (WorkspaceSettingsTemplateRolePermission permissionTemplate : permissionTemplates) {
			  workspaceRolePermissionDAO.create(workspaceEntity, permissionTemplate.getRole(), permissionTemplate.getPermission());
			}
		}

		return workspace;
	}

	@Override
	public List<Workspace> list(List<Workspace> workspaces) {
		List<Workspace> result = new ArrayList<>();
		
		for (Workspace workspace : workspaces) {
			workspace = single(workspace);
			if (workspace != null) {
				result.add(workspace);
			}
		}
		
		return result;
	}
	
	/**
	 * Generates URL name from workspace name.
	 * 
	 * @param name original workspace name
	 * @return URL name
	 */
	private String generateUrlName(String name) {
		return StringUtils.substring(StringUtils.replace(StringUtils.stripAccents(StringUtils.lowerCase(StringUtils.trim(StringUtils.normalizeSpace(name)))), " ", "-").replaceAll("-{2,}", "-"), 0, MAX_URL_NAME_LENGTH);
	}
}
