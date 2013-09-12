package fi.muikku.plugins.settings;

import java.io.Serializable;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.schooldata.WorkspaceController;

@Named
@Stateful
@RequestScoped
@URLMappings (mappings = {
  @URLMapping (
    id = "workspace-type-settings",
    pattern = "/settings/workspace/type/#{workspaceTypeSettingsViewBackingBean.id}",
    viewId = "/settings/workspacetype.jsf"
  )
})
public class WorkspaceTypeSettingsViewBackingBean implements Serializable {

	private static final long serialVersionUID = 518712923786896569L;
	
	@Inject
	private WorkspaceController workspaceController;
	
	@URLAction
	public void load() {
		WorkspaceTypeEntity workspaceTypeEntity = workspaceController.findWorkspaceTypeEntityById(id);
		this.name = workspaceTypeEntity.getName();
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public void save() {
		WorkspaceTypeEntity workspaceTypeEntity = workspaceController.findWorkspaceTypeEntityById(id);
		workspaceController.updateWorkspaceTypeEntityName(workspaceTypeEntity, getName());
	}
	
	private Long id;
	private String name;
}