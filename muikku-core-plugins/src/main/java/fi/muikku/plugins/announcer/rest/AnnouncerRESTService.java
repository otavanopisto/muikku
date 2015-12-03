package fi.muikku.plugins.announcer.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.announcer.AnnouncementController;
import fi.muikku.plugins.announcer.model.Announcement;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.session.SessionController;

@RequestScoped
@Path("/announcer")
@Produces("application/json")
public class AnnouncerRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 1L;

  @Inject
  private AnnouncementController announcementController;
  
  @Inject
  private SessionController sessionController;
  
  @POST
  @RESTPermitUnimplemented
  public Response createAnnouncement(AnnouncementRESTModel restModel) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    announcementController.create(
        restModel.getCaption(),
        restModel.getContent(),
        userEntity);
    
    return Response.noContent().build();
  }
  
  @GET
  @RESTPermitUnimplemented
  public Response listAnnouncements(/* TODO filtering */) {
    List<Announcement> announcements = announcementController.listAll();
    List<AnnouncementRESTModel> restModels = new ArrayList<>();
    for (Announcement announcement : announcements) {
      AnnouncementRESTModel restModel = new AnnouncementRESTModel();
      restModel.setCaption(announcement.getCaption());
      restModel.setContent(announcement.getContent());
      restModel.setCreated(announcement.getCreated());
      restModel.setId(announcement.getId());
      restModels.add(restModel);
    }
    return Response.ok(restModels).build();
  }
}
