package fi.muikku.plugins.notifier;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.model.notifier.NotifierActionEntity;
import fi.muikku.model.notifier.NotifierMethodEntity;
import fi.muikku.model.notifier.NotifierUserActionAllowance;
import fi.muikku.model.users.UserEntity;
import fi.muikku.notifier.NotifierController;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.security.AuthorizationException;
import fi.muikku.security.LoggedIn;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilityBuilderFactory;

@Path("/notifier")
@Stateless
@Produces ("application/json")
public class NotifierRESTService extends PluginRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private NotifierController notifierController;
  
  @POST
  @Path ("/allowNotification") 
  @LoggedIn
  public Response allowNotification(
      @FormParam ("methodName") String methodName,
      @FormParam ("actionName") String actionName
   ) throws AuthorizationException {
    UserEntity user = sessionController.getUser();

    NotifierActionEntity actionEntity = notifierController.findActionEntityByName(actionName);
    NotifierMethodEntity methodEntity = notifierController.findMethodEntityByName(methodName);
    
    notifierController.setUserActionAllowance(actionEntity, methodEntity, user, NotifierUserActionAllowance.ALLOW);
    
    return Response.ok().build();
  }

  @POST
  @Path ("/denyNotification") 
  @LoggedIn
  public Response denyNotification(
      @FormParam ("methodName") String methodName,
      @FormParam ("actionName") String actionName
   ) throws AuthorizationException {
    UserEntity user = sessionController.getUser();

    NotifierActionEntity actionEntity = notifierController.findActionEntityByName(actionName);
    NotifierMethodEntity methodEntity = notifierController.findMethodEntityByName(methodName);
    
    notifierController.setUserActionAllowance(actionEntity, methodEntity, user, NotifierUserActionAllowance.DENY);
    
    return Response.ok().build();
  }

}
