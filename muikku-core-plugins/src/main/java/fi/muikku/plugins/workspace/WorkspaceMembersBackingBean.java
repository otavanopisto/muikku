package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserEmail;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
@URLMapping(
    id = "workspace-members", 
    pattern = "/workspace/#{workspaceMembersBackingBean.workspaceUrlName}/members", 
    viewId = "/workspaces/workspace-members.jsf") 
})
public class WorkspaceMembersBackingBean {

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserController userController;
  
  @Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

  @URLAction
  public void init() throws FileNotFoundException {
    String urlName = getWorkspaceUrlName();
    if (StringUtils.isBlank(urlName)) {
      throw new FileNotFoundException();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      throw new FileNotFoundException();
    }
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);

    workspaceId = workspaceEntity.getId();
    
    workspaceUsers = new ArrayList<>();
    
    for (WorkspaceUser workspaceUser : workspaceController.listWorkspaceUsers(workspaceEntity)) {
      User user = userController.findUser(workspaceUser.getUserSchoolDataSource(), workspaceUser.getUserIdentifier());
      if (user != null) {
        List<UserEmail> userEmails = userController.listUserEmails(user);
        List<String> emails = new ArrayList<>(userEmails.size());
        for (UserEmail userEmail : userEmails) {
          emails.add(userEmail.getAddress());
        }
        
        workspaceUsers.add(new WorkspaceUserBean(workspaceUser.getIdentifier(), user.getIdentifier(), user.getFirstName(), user.getLastName(), emails));
      }
    }
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
  
  public List<WorkspaceUserBean> getWorkspaceUsers() {
    return workspaceUsers;
  }

  private Long workspaceId;
  private String workspaceUrlName;
  private List<WorkspaceUserBean> workspaceUsers;
  
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
