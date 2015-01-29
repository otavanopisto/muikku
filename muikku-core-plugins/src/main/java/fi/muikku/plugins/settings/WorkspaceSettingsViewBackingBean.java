package fi.muikku.plugins.settings;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
public class WorkspaceSettingsViewBackingBean {

	@Inject
	private WorkspaceController workspaceController;

	@PostConstruct
	public void init() {
		workspaces = new ArrayList<>();
		
	  for (Workspace workspace : workspaceController.listWorkspaces()) {
	  	WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntity(workspace);
	  	WorkspaceTypeEntity workspaceTypeEntity = workspaceController.findWorkspaceTypeEntityByDataSourceAndIdentifier(workspace.getSchoolDataSource(), workspace.getWorkspaceTypeId());
	  	workspaces.add(new WorkspaceBean(workspaceEntity.getId(), workspace.getIdentifier(), workspace.getSchoolDataSource(), workspaceEntity.getUrlName(), workspace.getName(), workspaceTypeEntity != null ? workspaceTypeEntity.getName() : null));
	  }
	}
	
	public List<WorkspaceBean> getWorkspaces() {
		return workspaces;
	}
	
	public void setWorkspaces(List<WorkspaceBean> workspaces) {
		this.workspaces = workspaces;
	}
	
	private List<WorkspaceBean> workspaces;

	public class WorkspaceBean {

		public WorkspaceBean(Long id, String identifier, String schoolDataSource, String urlName, String name, String typeName) {
			this.id = id;
			this.identifier = identifier;
			this.schoolDataSource = schoolDataSource;
			this.urlName = urlName;
			this.name = name;
			this.typeName = typeName;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getIdentifier() {
			return identifier;
		}
		
		public void setIdentifier(String identifier) {
			this.identifier = identifier;
		}
		
		public String getSchoolDataSource() {
			return schoolDataSource;
		}
		
		public void setSchoolDataSource(String schoolDataSource) {
			this.schoolDataSource = schoolDataSource;
		}
		
		public String getUrlName() {
			return urlName;
		}
		
		public void setUrlName(String urlName) {
			this.urlName = urlName;
		}
		
		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getTypeName() {
			return typeName;
		}

		public void setTypeName(String typeName) {
			this.typeName = typeName;
		}

		private Long id;
		private String identifier;
		private String schoolDataSource;
		private String urlName;
		private String name;
		private String typeName;
	}
}
