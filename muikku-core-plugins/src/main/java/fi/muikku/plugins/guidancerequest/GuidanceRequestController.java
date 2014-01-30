package fi.muikku.plugins.guidancerequest;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;

@Dependent
public class GuidanceRequestController {

  @Inject
  private GuidanceRequestDAO guidanceRequestDAO;
  
  @Inject
  private WorkspaceGuidanceRequestDAO workspaceGuidanceRequestDAO;

  @Inject
  private UserController userController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;

  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @Inject
  @Any
  private Instance<PermissionResolver> permissionResolvers;

  protected PermissionResolver getPermissionResolver(String permission) {
    for (PermissionResolver resolver : permissionResolvers) {
      if (resolver.handlesPermission(permission))
        return resolver;
    }
    
    return null;
  }
  
  @Permit (GuidanceRequestPermissions.CREATE_GUIDANCEREQUEST)
  public GuidanceRequest createGuidanceRequest(UserEntity student, Date date, String message) {
    GuidanceRequest guidanceRequest = guidanceRequestDAO.create(student, date, message);
    
    // Send message
    
    // TODO: Make this cleaner, it smells like fish.
    List<UserEntity> recipients = new ArrayList<UserEntity>();
    
    PermissionResolver per = getPermissionResolver(GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS);
    
    List<UserGroup> studentsGroups = userController.listUserGroupsByUser(student);
    
    for (UserGroup group : studentsGroups) {
      List<UserGroupUser> groupUsers = userController.listUserGroupUsers(group);
      
      for (UserGroupUser groupUser : groupUsers) {
        if (per.hasPermission(GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS, group, groupUser.getUser()))
          recipients.add(groupUser.getUser());
      }
    }

    if (!recipients.isEmpty()) {
      User user = userController.findUser(student);
      String userName = user.getFirstName() + " " + user.getLastName();
      
      for (MessagingWidget messagingWidget : messagingWidgets) {
        String caption = localeController.getText(sessionController.getLocale(), "plugin.guidancerequest.newGuidanceRequest.mail.subject");
        String content = localeController.getText(sessionController.getLocale(), "plugin.guidancerequest.newGuidanceRequest.mail.content");
        caption = MessageFormat.format(caption, userName);
        content = MessageFormat.format(content, userName, message);
        messagingWidget.postMessage(student, caption, content, recipients);
      }
    }
    
    
    return guidanceRequest;
  }
  
  @Permit (GuidanceRequestPermissions.CREATE_WORKSPACE_GUIDANCEREQUEST)
  public GuidanceRequest createWorkspaceGuidanceRequest(@PermitContext WorkspaceEntity workspaceEntity, UserEntity student, Date date, String message) {
    return workspaceGuidanceRequestDAO.create(workspaceEntity, student, date, message);
  }
  
  @Permit (GuidanceRequestPermissions.LIST_WORKSPACE_GUIDANCEREQUESTS)
  public List<WorkspaceGuidanceRequest> listWorkspaceGuidanceRequestsByWorkspace(@PermitContext WorkspaceEntity workspaceEntity) {
    return workspaceGuidanceRequestDAO.listByWorkspace(workspaceEntity);
  }

  /**
   * TODO: methods that return owned guidancerequests and if the user has managed groups, also the group's users' requests
   */
  
  // TODO rights
  public List<GuidanceRequest> listGuidanceRequestsByStudent(UserEntity student) {
    return guidanceRequestDAO.listByStudent(student);
  }

  public List<WorkspaceGuidanceRequest> listWorkspaceGuidanceRequestsByWorkspaceAndUser(WorkspaceEntity workspaceEntity,
      UserEntity userEntity) {
    return workspaceGuidanceRequestDAO.listByWorkspaceAndUser(workspaceEntity, userEntity);
  }
  
}
