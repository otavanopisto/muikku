package fi.otavanopisto.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceEntityFile;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/workspace-management", to = "/jsf/workspace/workspace-management.jsf")
public class WorkspaceManagementBackingBean extends AbstractWorkspaceBackingBean {

  @Parameter
  private String workspaceUrlName;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceBackingBean workspaceBackingBean;
  
  @Inject
  private WorkspaceEntityFileController workspaceEntityFileController;
  
  @Inject
  private ChatController chatController;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);

    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    if (!workspaceController.canIManageWorkspace(workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    UserChatSettings userChatSettings = chatController.findUserChatSettings(sessionController.getLoggedUserEntity());
    
    if (userChatSettings != null && userChatSettings.getVisibility().equals(UserChatVisibility.VISIBLE_TO_ALL)) {
      workspaceChatSettings = true;
    }
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    WorkspaceEntityFile customFrontImage = workspaceEntityFileController.findWorkspaceEntityFile(workspaceEntity, "workspace-frontpage-image-cropped");
    hasCustomFrontPageImage = customFrontImage != null;
    customFrontPageImageUrl = hasCustomFrontPageImage ? 
        String.format("/rest/workspace/workspaces/%d/workspacefile/workspace-frontpage-image-cropped", workspaceEntity.getId()) : 
        null;
    
    return null;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public String getCustomFrontPageImageUrl() {
    return customFrontPageImageUrl;
  }

  public boolean getHasCustomFrontPageImage() {
    return hasCustomFrontPageImage;
  }

  public boolean getWorkspaceChatSettings() {
    return workspaceChatSettings;
  }
  
  private Long workspaceEntityId;
  private String customFrontPageImageUrl;
  private boolean hasCustomFrontPageImage;
  private boolean workspaceChatSettings;
}
