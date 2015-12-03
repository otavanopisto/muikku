package fi.muikku.plugins.announcer.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.announcer.AnnouncementController;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;

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
  
  @POST
  @Path("/announcements")
  @RESTPermitUnimplemented
  public Response createAnnouncement(AnnouncementRESTModel restModel) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    announcementController.create(
        userEntity,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate());
    
    return Response.noContent().build();
  }
  
  @GET
  @Path("/announcements")
  @RESTPermitUnimplemented
  public Response listAnnouncements(/* TODO filtering */) {
    List<Announcement> announcements = announcementController.listAll();
    List<AnnouncementRESTModel> restModels = new ArrayList<>();
    for (Announcement announcement : announcements) {
      AnnouncementRESTModel restModel = createRESTModel(announcement);
      restModels.add(restModel);
    }
    return Response.ok(restModels).build();
  }
  
  @GET
  @Path("/announcements/{ID}")
  @RESTPermitUnimplemented
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
    return restModel;
  }
}
