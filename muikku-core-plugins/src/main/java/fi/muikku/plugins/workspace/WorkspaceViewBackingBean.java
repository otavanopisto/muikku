package fi.muikku.plugins.workspace;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.controller.MaterialController;
import fi.muikku.model.material.Material;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
		@URLMapping(id = "workspace-index", pattern = "/workspace/#{workspaceViewBackingBean.workspaceUrlName}", viewId = "/workspaces/workspace.jsf"),
		@URLMapping(id = "workspace-members", pattern = "/workspace/#{workspaceViewBackingBean.workspaceUrlName}/members", viewId = "/workspaces/workspace-members.jsf") })
public class WorkspaceViewBackingBean implements Serializable {

	private static final long serialVersionUID = -4282035235792733897L;

	@Inject
	private WorkspaceController workspaceController;

	@Inject
	private UserController userController;
	
	@Inject
	private MaterialController materialController;

	@PostConstruct
	public void init() {
	}

	public Long getWorkspaceId() {
		if (workspaceId == null && workspaceUrlName != null) {
			WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
			if (workspaceEntity != null) {
				workspaceId = workspaceEntity.getId();
			}
		}

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
	
	public Workspace getWorkspace() {
		Long workspaceId = getWorkspaceId();
		if (workspaceId != null) {
  		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
  		if (workspaceEntity != null) {
  			return workspaceController.findWorkspace(workspaceEntity);
  		}
		}
		
		return null;
	}

	public List<WorkspaceUserBean> getWorkspaceUsers() {
		List<WorkspaceUserBean> result = new ArrayList<>();
		
		Long workspaceId = getWorkspaceId();
		if (workspaceId != null) {
			WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceId());
			if (workspaceEntity != null) {
				for (WorkspaceUser workspaceUser : workspaceController.listWorkspaceUsers(workspaceEntity)) {
					User user = userController.findUser(workspaceUser.getUserSchoolDataSource(), workspaceUser.getUserIdentifier());
					if (user != null) {
						List<UserEmail> userEmails = userController.listUserEmails(user);
						List<String> emails = new ArrayList<>(userEmails.size());
						for (UserEmail userEmail : userEmails) {
							emails.add(userEmail.getAddress());
						}
						
						result.add(new WorkspaceUserBean(workspaceUser.getIdentifier(), user.getIdentifier(), user.getFirstName(), user.getLastName(), emails));
					}
				}
			}
		}

		return result;
	}
	
	public List<String> getRenderedWorkspaceMaterials() {
	  List<String> result = new ArrayList<>();
	  
		Long workspaceId = getWorkspaceId();
		if (workspaceId != null) {
			WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceId());
			for (Material material : workspaceEntity.getMaterials()) {
			  String rendered = materialController.renderView(material);
			  System.out.println(rendered);
			  result.add(rendered);
			}
		}
		
		return result;
	}

	private Long workspaceId;
	private String workspaceUrlName;

	public class WorkspaceUserBean {

		public WorkspaceUserBean(String identifier, String userIdentifier, String firstName, String lastName, List<String> emails) {
			this.identifier = identifier;
			this.userIdentifier = userIdentifier;
			this.firstName = firstName;
			this.lastName = lastName;
			this.emails = emails;
		}

		public String getIdentifier() {
			return identifier;
		}

		public void setIdentifier(String identifier) {
			this.identifier = identifier;
		}

		public String getUserIdentifier() {
			return userIdentifier;
		}

		public void setUserIdentifier(String userIdentifier) {
			this.userIdentifier = userIdentifier;
		}

		public String getFirstName() {
			return firstName;
		}

		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public void setLastName(String lastName) {
			this.lastName = lastName;
		}
		
		public List<String> getEmails() {
			return emails;
		}
		
		public void setEmails(List<String> emails) {
			this.emails = emails;
		}

		private String identifier;
		private String userIdentifier;
		private String firstName;
		private String lastName;
		private List<String> emails;
	}
}
