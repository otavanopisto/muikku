package fi.muikku.plugins.settings;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.model.SelectItem;
import javax.inject.Inject;
import javax.inject.Named;

import edu.emory.mathcs.backport.java.util.Collections;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.WorkspaceType;

@Named
@Stateful
@RequestScoped
public class WorkspaceTypeSettingsViewBackingBean implements Serializable {
	
	private static final long serialVersionUID = -5900116972524666513L;
	
	@Inject
	private WorkspaceController workspaceController;
	
	public List<SelectItem> getWorkspaceTypeEntitySelectItems() {
		List<SelectItem> result = new ArrayList<>();
		List<WorkspaceTypeEntity> workspaceTypeEntities = workspaceController.listWorkspaceTypeEntities();
		result.add(new SelectItem(null, "Unassigned"));
		
		for (WorkspaceTypeEntity workspaceTypeEntity : workspaceTypeEntities) {
			result.add(new SelectItem(workspaceTypeEntity.getId(), workspaceTypeEntity.getName()));
		}
		
		return result;
	}
	
	@PostConstruct
	public void init() {
		workspaceTypes = new ArrayList<>();
		
		List<WorkspaceType> types = workspaceController.listWorkspaceTypes();
		Collections.sort(types, new Comparator<WorkspaceType>() {
			@Override
			public int compare(WorkspaceType o1, WorkspaceType o2) {
				return o1.getIdentifier().compareTo(o2.getIdentifier());
			}
		});
		
		for (WorkspaceType type : types) {
			WorkspaceTypeEntity entity = workspaceController.findWorkspaceTypeEntity(type);

			workspaceTypes.add(new WorkspaceTypeBean(
					type.getIdentifier(), 
					type.getName(), 
					type.getSchoolDataSource(),
					entity != null ? entity.getId() : null)
			);
		}
	}
	
	public List<WorkspaceTypeEntity> getWorkspaceTypeEntities() {
		return workspaceController.listWorkspaceTypeEntities();
	}
	
	public List<WorkspaceTypeBean> getWorkspaceTypes() {
		return workspaceTypes;
	}
	
	public void setWorkspaceTypes(List<WorkspaceTypeBean> workspaceTypes) {
		this.workspaceTypes = workspaceTypes;
	}
	
	public void saveWorkspaceTypes() {
		// TODO: Proper error handling
		for (WorkspaceTypeBean workspaceTypeBean : workspaceTypes) {
			WorkspaceType workspaceType = workspaceController.findWorkspaceTypeByDataSourceAndIdentifier(workspaceTypeBean.getSchoolDataSource(), workspaceTypeBean.getIdentifier());
			if (workspaceType != null) {
				Long workspaceEntityId = workspaceTypeBean.getWorkspaceEntityId();
				WorkspaceTypeEntity workspaceTypeEntity = workspaceEntityId != null ? workspaceController.findWorkspaceTypeEntityById(workspaceEntityId) : null;
				workspaceController.setWorkspaceTypeEntity(workspaceType, workspaceTypeEntity);
			}			
		}
	}
	
	private List<WorkspaceTypeBean> workspaceTypes;

	public class WorkspaceTypeBean {

		public WorkspaceTypeBean() {
		}
		
		public WorkspaceTypeBean(String identifier, String name, String schoolDataSource, Long workspaceEntityId) {
			this.identifier = identifier;
			this.name = name;
			this.schoolDataSource = schoolDataSource;
			this.workspaceEntityId = workspaceEntityId;
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
		
		public String getSchoolDataSource() {
			return schoolDataSource;
		}
		
		public void setSchoolDataSource(String schoolDataSource) {
			this.schoolDataSource = schoolDataSource;
		}

		public Long getWorkspaceEntityId() {
			return workspaceEntityId;
		}
		
		public void setWorkspaceEntityId(Long workspaceEntityId) {
			this.workspaceEntityId = workspaceEntityId;
		}
		
		private String identifier;
		private String name;
		private String schoolDataSource;
		private Long workspaceEntityId;
	}
}

