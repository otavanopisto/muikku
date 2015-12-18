package fi.muikku.plugins.announcer.rest;

import java.util.ArrayList;
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

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.announcer.AnnouncementController;
import fi.muikku.plugins.announcer.AnnouncerPermissions;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.UserGroupEntityController;
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
  
  @POST
  @Path("/announcements")
  @RESTPermit(AnnouncerPermissions.CREATE_ANNOUNCEMENT)
  public Response createAnnouncement(AnnouncementRESTModel restModel) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    Announcement announcement = announcementController.create(
        userEntity,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible());
    
    for (Long id : restModel.getUserGroupEntityIds()) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(id);
      announcementController.addAnnouncementTargetGroup(announcement, userGroupEntity);
    }
    
    return Response.noContent().build();
  }

  @PUT
  @Path("/announcements/{ID}")
  @RESTPermit(AnnouncerPermissions.UPDATE_ANNOUNCEMENT)
  public Response updateAnnouncement(
      @PathParam("ID") Long announcementId,
      AnnouncementRESTModel restModel
  ) {

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
        restModel.getEndDate());
    
    return Response.ok(createRESTModel(newAnnouncement)).build();
  }
  
  @GET
  @Path("/announcements")
  @RESTPermit(handling=Handling.INLINE)
  public Response listAnnouncements(
      @QueryParam("onlyActive") @DefaultValue("false") boolean onlyActive,
      @QueryParam("onlyMine") @DefaultValue("false") boolean onlyMine
  ) {
    if (!onlyActive) {
      if (!sessionController.hasEnvironmentPermission(AnnouncerPermissions.LIST_UNARCHIVED_ANNOUNCEMENTS)) {
        return Response.status(Status.FORBIDDEN).entity("You're not allowed to list all announcements").build();
      }
    }
    
    List<Announcement> announcements = null;
    if (onlyActive) {
      if (onlyMine) {
        UserEntity currentUserEntity = sessionController.getLoggedUserEntity();
        announcements = announcementController.listActiveByTargetedUserEntity(currentUserEntity);
      } else {
        announcements = announcementController.listActive();
      }
    } else {
      announcements = announcementController.listUnarchived();
    }

    List<AnnouncementRESTModel> restModels = new ArrayList<>();
    for (Announcement announcement : announcements) {
      AnnouncementRESTModel restModel = createRESTModel(announcement);
      restModels.add(restModel);
    }

    return Response.ok(restModels).build();
  }
  
  @GET
  @Path("/announcements/{ID}")
  @RESTPermit(AnnouncerPermissions.FIND_ANNOUNCEMENT)
  public Response findAnnouncementById(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    AnnouncementRESTModel restModel = createRESTModel(announcement);
    return Response.ok(restModel).build();
  }

  private AnnouncementRESTModel createRESTModel(Announcement announcement) {
    AnnouncementRESTModel restModel = new AnnouncementRESTModel();
    restModel.setPublisherUserEntityId(announcement.getPublisherUserEntityId());
    restModel.setCaption(announcement.getCaption());
    restModel.setContent(announcement.getContent());
    restModel.setCreated(announcement.getCreated());
    restModel.setStartDate(announcement.getStartDate());
    restModel.setEndDate(announcement.getEndDate());
    restModel.setId(announcement.getId());
    restModel.setPubliclyVisible(announcement.isPubliclyVisible());

    Date date = new Date();
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
  @RESTPermit(AnnouncerPermissions.DELETE_ANNOUNCEMENT)
  public Response deleteAnnouncement(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    announcementController.archive(announcement);
    return Response.noContent().build();
  }
}
