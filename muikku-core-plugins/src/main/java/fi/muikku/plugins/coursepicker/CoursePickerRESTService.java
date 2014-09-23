package fi.muikku.plugins.coursepicker;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceSettings;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.session.SessionController;

@Path("/coursepicker")
@RequestScoped
@Stateful
@Produces ("application/json")
public class CoursePickerRESTService extends PluginRESTService {

  private static final long serialVersionUID = -7027696842893383409L;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private RoleController roleController;

  @Inject
  private LocaleController localeController;
  
  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;
  
  @POST
  @Path ("/joincourse")
  public Response joinCourse(@PathParam ("ID") Long workspaceEntityId) {
    // TODO: Security
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }
    
    UserEntity userEntity = sessionController.getUser();
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }
    
    WorkspaceRoleEntity workspaceRole;
    
//    if (StringUtils.isNotBlank(entity.getRole())) {
//      workspaceRole = roleController.findWorkspaceRoleEntityByName(entity.getRole());
//      if (workspaceRole == null) {
//        return Response.status(Status.BAD_REQUEST).entity("Invalid workspace role '" + entity.getRole() + "'").build(); 
//      }
//    } else {
      WorkspaceSettings workspaceSettings = workspaceController.findWorkspaceSettings(workspaceEntity);
      workspaceRole = workspaceSettings.getDefaultWorkspaceUserRole();
//    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceController.findWorkspaceUserEntityByWorkspaceAndUser(workspaceEntity, userEntity);
    if (workspaceUserEntity != null) {
      return Response.status(Status.BAD_REQUEST).build(); 
    }
    
    fi.muikku.schooldata.entity.WorkspaceUser workspaceUser = workspaceController.createWorkspaceUser(workspaceEntity, userEntity, workspaceRole);
    workspaceUserEntity = workspaceController.findWorkspaceUserEntity(workspaceUser);
    
    // TODO: should this work based on permission? Permission -> Roles -> Recipients
    // TODO: Messaging should be moved into a CDI event listener
    
    WorkspaceRoleEntity role = roleController.ROLE_WORKSPACE_TEACHER();
    List<WorkspaceUserEntity> workspaceTeachers = workspaceController.listWorkspaceUserEntitiesByRole(workspaceEntity, role);
    List<UserEntity> teachers = new ArrayList<UserEntity>();
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceName = workspace.getName();
    
    User user = userController.findUser(userEntity);
    String userName = user.getFirstName() + " " + user.getLastName();
    
    for (WorkspaceUserEntity cu : workspaceTeachers) {
      teachers.add(cu.getUser());
    }
    
    for (MessagingWidget messagingWidget : messagingWidgets) {
      String caption = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.caption");
      String content = localeController.getText(sessionController.getLocale(), "rest.workspace.joinWorkspace.joinNotification.content");
      caption = MessageFormat.format(caption, workspaceName);
      content = MessageFormat.format(content, userName, workspaceName);
      // TODO: Category?
      messagingWidget.postMessage(userEntity, "message", caption, content, teachers);
    }
    
    return Response.ok(createRestModel(workspaceUserEntity)).build();
  }
  
  private fi.muikku.plugins.workspace.rest.model.WorkspaceUser createRestModel(WorkspaceUserEntity entity) {
    Long workspaceEntityId = entity.getWorkspaceEntity() != null ? entity.getWorkspaceEntity().getId() : null;
    Long userId = entity.getUser() != null ? entity.getUser().getId() : null;
    String role = entity.getWorkspaceUserRole() != null ? entity.getWorkspaceUserRole().getName() : null;
    return new fi.muikku.plugins.workspace.rest.model.WorkspaceUser(entity.getId(), workspaceEntityId, userId, role, entity.getArchived());
  }

}
