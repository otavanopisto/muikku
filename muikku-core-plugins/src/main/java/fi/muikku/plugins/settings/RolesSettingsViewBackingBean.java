package fi.muikku.plugins.settings;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.model.SelectItem;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.RoleType;

@Named
@Stateful
@RequestScoped
public class RolesSettingsViewBackingBean implements Serializable {

	private static final long serialVersionUID = -6225679048494162513L;

	@Inject
	private RoleController roleController;
	
	@PostConstruct
	public void init() {
		roles = new ArrayList<>();
		List<Role> roles = roleController.listRoles();
		for (Role role : roles) {
			RoleEntity roleEntity = roleController.findRoleEntity(role);
			this.roles.add(new RoleBean(role.getSchoolDataSource(), role.getIdentifier(), role.getName(), roleEntity != null ? roleEntity.getId() : null, role.getType()));
		}
	}

	public List<RoleBean> getRoles() {
		return roles;
	}

	public List<RoleEntity> getRoleEntities() {
		return roleController.listRoleEntities();
	}

	public List<SelectItem> getRoleSelectItems(RoleType roleType) {
		List<SelectItem> result = new ArrayList<>();
		result.add(new SelectItem(null, "Unassigned"));

		switch (roleType) {
			case ENVIRONMENT:
			  List<EnvironmentRoleEntity> environmentRoleEntities = roleController.listEnvironmentRoleEntities();
				Collections.sort(environmentRoleEntities, new Comparator<EnvironmentRoleEntity>() {
					@Override
					public int compare(EnvironmentRoleEntity o1, EnvironmentRoleEntity o2) {
						return o1.getId().compareTo(o2.getId());
					}
				});
				
				for (EnvironmentRoleEntity entity : environmentRoleEntities) {
					result.add(new SelectItem(entity.getId(), entity.getName()));
				}
			break;
			case WORKSPACE:
				List<WorkspaceRoleEntity> workspaceRoleEntities = roleController.listWorkspaceRoleEntities();
				Collections.sort(workspaceRoleEntities, new Comparator<WorkspaceRoleEntity>() {
					@Override
					public int compare(WorkspaceRoleEntity o1, WorkspaceRoleEntity o2) {
						return o1.getId().compareTo(o2.getId());
					}
				});
				
				for (WorkspaceRoleEntity entity : workspaceRoleEntities) {
					result.add(new SelectItem(entity.getId(), entity.getName()));
				}
			break;
		}

		return result;
	}

	public void saveRoles() {
		for (RoleBean role : roles) {
			RoleEntity roleEntity = roleController.findRoleEntityById(role.getEntityId());
			roleController.setRoleEntity(role.getSchoolDataSource(), role.getIdentifier(), roleEntity);
		}
	}

	private List<RoleBean> roles;
	
	public class RoleBean {
		
		public RoleBean() {
		}

		public RoleBean(String schoolDataSource, String identifier, String name, Long entityId, RoleType type) {
			this.schoolDataSource = schoolDataSource;
			this.identifier = identifier;
			this.name = name;
			this.entityId = entityId;
			this.type = type;
		}

		public String getSchoolDataSource() {
			return schoolDataSource;
		}
		
		public void setSchoolDataSource(String schoolDataSource) {
			this.schoolDataSource = schoolDataSource;
		}

		public String getIdentifier() {
			return identifier;
		}

		public void setIdentifier(String identifier) {
			this.identifier = identifier;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public Long getEntityId() {
			return entityId;
		}

		public void setEntityId(Long entityId) {
			this.entityId = entityId;
		}
		
		public RoleType getType() {
			return type;
		}
		
		public void setType(RoleType type) {
			this.type = type;
		}

		private String schoolDataSource;
		private String identifier;
		private String name;
		private Long entityId;
		private RoleType type;
	}
}
