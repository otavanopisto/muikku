package fi.otavanopisto.muikku.plugins.announcer.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncementController;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncerPermissions;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/announcer")
@Produces("application/json")
public class AnnouncerRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 1L;

  @Inject
  private AnnouncementController announcementController;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  private Date currentDate() {
    Calendar cal = Calendar.getInstance();
    cal.setTime(new Date());
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    return cal.getTime();
  }
  
  @POST
  @Path("/announcements")
  @RESTPermit(handling = Handling.INLINE)
  public Response createAnnouncement(AnnouncementRESTModel restModel) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    if (restModel.getWorkspaceEntityIds().isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.CREATE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create environment announcements").build();
    }

    for (Long id : restModel.getWorkspaceEntityIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(id);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.CREATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create workspace announcement").build();
      }
    }
    
    Announcement announcement = announcementController.create(
        userEntity,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible());
    
    for (Long id : restModel.getUserGroupEntityIds()) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(id);

      if (userGroupEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid userGroupEntityId").build();
      }

      announcementController.addAnnouncementTargetGroup(announcement, userGroupEntity);
    }

    for (Long id : restModel.getWorkspaceEntityIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(id);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      announcementController.addAnnouncementWorkspace(announcement, workspaceEntity);
    }
    
    return Response.noContent().build();
  }

  @PUT
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateAnnouncement(
      @PathParam("ID") Long announcementId,
      AnnouncementRESTModel restModel
  ) {

    if (restModel.getWorkspaceEntityIds().isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.UPDATE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update environment announcements").build();
    }

    for (Long id : restModel.getWorkspaceEntityIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(id);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.UPDATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update workspace announcement").build();
      }
    }

    if (announcementId == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    Announcement oldAnnouncement = announcementController.findById(announcementId);
    
    if (oldAnnouncement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Announcement newAnnouncement = announcementController.update(
        oldAnnouncement,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible());

    announcementController.clearAnnouncementTargetGroups(newAnnouncement);
    for (Long id : restModel.getUserGroupEntityIds()) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(id);
      
      if (userGroupEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid userGroupEntityId").build();
      }
      
      announcementController.addAnnouncementTargetGroup(newAnnouncement, userGroupEntity);
    }

    announcementController.clearAnnouncementWorkspaces(newAnnouncement);
    for (Long id : restModel.getWorkspaceEntityIds()) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(id);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      announcementController.addAnnouncementWorkspace(newAnnouncement, workspaceEntity);
    }
    
    return Response.ok(
        createRESTModel(
            newAnnouncement,
            announcementController.listUserGroups(newAnnouncement),
            announcementController.listWorkspaces(newAnnouncement)))
        .build();
  }
  
  @GET
  @Path("/announcements")
  @RESTPermit(handling=Handling.INLINE)
  public Response listAnnouncements(
      @QueryParam("onlyActive") @DefaultValue("false") boolean onlyActive,
      @QueryParam("onlyMine") @DefaultValue("false") boolean onlyMine,
      @QueryParam("hideWorkspaceAnnouncements") @DefaultValue("false") boolean hideWorkspaceAnnouncements,
      @QueryParam("workspaceEntityId") Long workspaceEntityId
  ) {
    if (!onlyActive) {
      if (!sessionController.hasEnvironmentPermission(AnnouncerPermissions.LIST_UNARCHIVED_ANNOUNCEMENTS)) {
        return Response.status(Status.FORBIDDEN).entity("You're not allowed to list unarchived announcements").build();
      }
    }
    
    List<Announcement> announcements = null;

    if (workspaceEntityId == null && hideWorkspaceAnnouncements) {
      if (onlyActive) {
        if (onlyMine) {
          UserEntity currentUserEntity = sessionController.getLoggedUserEntity();
          announcements = announcementController.listActiveEnvironmentAnnouncementsByTargetedUserEntity(currentUserEntity);
        } else {
          announcements = announcementController.listActiveEnvironmentAnnouncements();
        }
      } else {
        announcements = announcementController.listUnarchivedEnvironmentAnnouncements();
      }
    }
    
    if (workspaceEntityId == null && !hideWorkspaceAnnouncements) {
      if (onlyActive) {
        if (onlyMine) {
          UserEntity currentUserEntity = sessionController.getLoggedUserEntity();
          announcements = announcementController.listActiveEnvironmentAndWorkspaceAnnouncementsByTargetedUserEntity(currentUserEntity);
        } else {
          announcements = announcementController.listActiveAnnouncements();
        }
      } else {
        announcements = announcementController.listUnarchivedAnnouncements();
      }
    }

    if (workspaceEntityId != null) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Workspace entity with given ID not found").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.LIST_WORKSPACE_ANNOUNCEMENTS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to list workspace announcements").build();
      }
      
      if (onlyActive) {
        announcements = announcementController.listActiveByWorkspaceEntity(workspaceEntity);
      } else {
        announcements = announcementController.listUnarchivedByWorkspaceEntity(workspaceEntity);
      }
    }

    List<AnnouncementRESTModel> restModels = new ArrayList<>();
    for (Announcement announcement : announcements) {
      AnnouncementRESTModel restModel = createRESTModel(
          announcement,
          announcementController.listUserGroups(announcement),
          announcementController.listWorkspaces(announcement));
      restModels.add(restModel);
    }

    return Response.ok(restModels).build();
  }
  
  @GET
  @Path("/announcements/{ID}")
  @RESTPermit(AnnouncerPermissions.FIND_ANNOUNCEMENT)
  public Response findAnnouncementById(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).entity("Announcement not found").build();
    }
    
    List<AnnouncementUserGroup> announcementUserGroups = announcementController.listUserGroups(announcement);
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listWorkspaces(announcement);
    
    return Response.ok(createRESTModel(announcement, announcementUserGroups, announcementWorkspaces)).build();
  }

  private AnnouncementRESTModel createRESTModel(
      Announcement announcement,
      List<AnnouncementUserGroup> userGroups,
      List<AnnouncementWorkspace> workspaces
  ) {
      
    AnnouncementRESTModel restModel = new AnnouncementRESTModel();
    restModel.setPublisherUserEntityId(announcement.getPublisherUserEntityId());
    restModel.setCaption(announcement.getCaption());
    restModel.setContent(announcement.getContent());
    restModel.setCreated(announcement.getCreated());
    restModel.setStartDate(announcement.getStartDate());
    restModel.setEndDate(announcement.getEndDate());
    restModel.setId(announcement.getId());
    restModel.setPubliclyVisible(announcement.isPubliclyVisible());

    List<Long> userGroupEntityIds = new ArrayList<>();
    for (AnnouncementUserGroup announcementUserGroup : userGroups) {
      userGroupEntityIds.add(announcementUserGroup.getUserGroupEntityId());
    }
    restModel.setUserGroupEntityIds(userGroupEntityIds);

    List<Long> workspaceEntityIds = new ArrayList<>();
    for (AnnouncementWorkspace announcementWorkspace : workspaces) {
      workspaceEntityIds.add(announcementWorkspace.getWorkspaceEntityId());
    }
    restModel.setWorkspaceEntityIds(workspaceEntityIds);

    Date date = currentDate();
    if (date.before(announcement.getStartDate())) {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.UPCOMING);
    } else if (date.after(announcement.getEndDate())) {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.ENDED);
    } else {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.ACTIVE);
    }

    return restModel;
  }

  @DELETE
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response deleteAnnouncement(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listWorkspaces(announcement);

    if (announcementWorkspaces.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.DELETE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update environment announcements").build();
    }

    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(announcementWorkspace.getWorkspaceEntityId());

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.DELETE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update workspace announcement").build();
      }
    }

    announcementController.archive(announcement);
    return Response.noContent().build();
  }
}
