package fi.otavanopisto.muikku.plugins.notifier;

import javax.ejb.Stateless;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.otavanopisto.muikku.plugin.PluginRESTService;

@Path("/notifier")
@Stateless
@Produces ("application/json")
public class NotifierRESTService extends PluginRESTService {
  
//FIXME: Re-enable this service
//
//  @Inject 
//  private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//  @Inject
//  private SessionController sessionController;
//  
//  @Inject
//  private NotifierController notifierController;
//  
//  @POST
//  @Path ("/allowNotification") 
//  @LoggedIn
//  public Response allowNotification(
//      @FormParam ("methodName") String methodName,
//      @FormParam ("actionName") String actionName
//   ) throws AuthorizationException {
//    UserEntity user = sessionController.getUser();
//
//    NotifierActionEntity actionEntity = notifierController.findActionEntityByName(actionName);
//    NotifierMethodEntity methodEntity = notifierController.findMethodEntityByName(methodName);
//    
//    notifierController.setUserActionAllowance(actionEntity, methodEntity, user, NotifierUserActionAllowance.ALLOW);
//    
//    return Response.ok().build();
//  }
//
//  @POST
//  @Path ("/denyNotification") 
//  @LoggedIn
//  public Response denyNotification(
//      @FormParam ("methodName") String methodName,
//      @FormParam ("actionName") String actionName
//   ) throws AuthorizationException {
//    UserEntity user = sessionController.getUser();
//
//    NotifierActionEntity actionEntity = notifierController.findActionEntityByName(actionName);
//    NotifierMethodEntity methodEntity = notifierController.findMethodEntityByName(methodName);
//    
//    notifierController.setUserActionAllowance(actionEntity, methodEntity, user, NotifierUserActionAllowance.DENY);
//    
//    return Response.ok().build();
//  }

}
