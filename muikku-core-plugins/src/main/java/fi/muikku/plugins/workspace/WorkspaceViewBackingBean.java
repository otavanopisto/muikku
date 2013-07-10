package fi.muikku.plugins.workspace;

import java.io.Serializable;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.schooldata.WorkspaceController;

@Named
@Stateful
@RequestScoped
@URLMappings (mappings={
	@URLMapping (
  		id = "workspace-index", 
  		pattern = "/workspace/#{workspaceViewBackingBean.workspaceUrlName}", 
  		viewId = "/workspaces/workspace.jsf"
  )
})
public class WorkspaceViewBackingBean implements Serializable {

	private static final long serialVersionUID = -4282035235792733897L;

	@Inject
	private WorkspaceController workspaceController;

	@PostConstruct
	public void init() {
	}
	
	public Long getWorkspaceId() {
		return workspaceId;
	}
	
	public void setWorkspaceId(Long workspaceId) {
		this.workspaceId = workspaceId;
	}
	
	public String getWorkspaceUrlName() {
		return workspaceUrlName;
	}
	
	public void setWorkspaceUrlName(String workspaceUrlName) {
		this.workspaceUrlName = workspaceUrlName;
	}

	private Long workspaceId;
	private String workspaceUrlName;
}
