package fi.otavanopisto.muikku.plugins.guidancerequest;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.NotImplementedException;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.Permit;
import fi.otavanopisto.security.PermitContext;

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
  
//  @Inject
//  private Mailer mailer;

  @Inject
  private NotifierController notifierController;
  
  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  @Inject
  @Any
  private Instance<PermissionResolver> permissionResolvers;

  @Inject
  private GuidanceRequestNotification guidanceRequestNotification;
  
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
    
    getPermissionResolver(GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS);
    /*
    
    List<UserGroup> studentsGroups = userGroupController.listUserGroupsByUser(student);
    
    for (UserGroup group : studentsGroups) {
      List<UserGroupUser> groupUsers = userGroupController.listUserGroupUsers(group);
      
      for (UserGroupUser groupUser : groupUsers) {
        if (per.hasPermission(GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS, group, groupUser.getUser()))
          recipients.add(groupUser.getUser());
      }
    }
    */

    if (!recipients.isEmpty()) {
      User user = userController.findUserByDataSourceAndIdentifier(sessionController.getLoggedUserIdentifier(), sessionController.getLoggedUserIdentifier());
      String userName = user.getFirstName() + " " + user.getLastName();

      String caption = localeController.getText(sessionController.getLocale(), "plugin.guidancerequest.newGuidanceRequest.mail.subject");
      String content = localeController.getText(sessionController.getLocale(), "plugin.guidancerequest.newGuidanceRequest.mail.content");
      caption = MessageFormat.format(caption, userName);
      content = MessageFormat.format(content, userName, message);

      for (MessagingWidget messagingWidget : messagingWidgets) {
        messagingWidget.postMessage(student, caption, GuidanceRequestPluginDescriptor.MESSAGING_CATEGORY, content, recipients);
      }
      
      Map<String, Object> params = new HashMap<String, Object>();
      params.put("guidanceRequest", guidanceRequest);
      
      notifierController.sendNotification(guidanceRequestNotification, student, recipients, params);
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

  @Permit (GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS)
  public List<GuidanceRequest> listGuidanceRequestsByGroup(@PermitContext UserGroupEntity group) {
    /*
    List<UserGroupUser> users = userGroupController.listUserGroupUsers(group);
    List<GuidanceRequest> list = new ArrayList<GuidanceRequest>();
    
    for (UserGroupUser user : users) {
      list.addAll(guidanceRequestDAO.listByStudent(user.getUser()));
    }

    return list;
    */
    throw new NotImplementedException("User groups are not usable yet");
  }

  public List<GuidanceRequest> listGuidanceRequestsByManager(UserEntity manager) {
    getPermissionResolver(GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS);
    /*
    
    List<UserGroup> managedGroups = userGroupController.listUserGroupsByUser(manager);
    List<GuidanceRequest> list = new ArrayList<GuidanceRequest>();
    
    for (UserGroup group : managedGroups) {
      if (per.hasPermission(GuidanceRequestPermissions.RECEIVE_USERGROUP_GUIDANCEREQUESTS, group, manager)) {
        List<GuidanceRequest> byGroup = listGuidanceRequestsByGroup(group);
        if (byGroup != null)
          list.addAll(byGroup);
      }
    }
    
    return list;
    */
    throw new NotImplementedException("User groups are not usable yet");
  }

  public List<WorkspaceGuidanceRequest> listWorkspaceGuidanceRequestsByWorkspaceAndUser(WorkspaceEntity workspaceEntity,
      UserEntity userEntity) {
    return workspaceGuidanceRequestDAO.listByWorkspaceAndUser(workspaceEntity, userEntity);
  }
  
}
