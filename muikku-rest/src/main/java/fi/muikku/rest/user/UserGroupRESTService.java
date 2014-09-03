package fi.muikku.rest.user;

import javax.ejb.Stateless;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.muikku.rest.AbstractRESTService;

@Path("/usergroup")
@Stateless
@Produces ("application/json")
public class UserGroupRESTService extends AbstractRESTService {
//FIXME: Re-enable this service
//
//  @Inject 
//  private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//  @Inject
//  private SessionController sessionController;
//  
//  @Inject
//  @LocalSession
//  private LocalSessionController localSessionController;
//  
//  @Inject
//  private UserController userController;
//
//  @Inject
//  private SchoolBridgeController schoolBridgeController;
//  
//  @GET
//  @Path ("/searchGroups")
//  public Response searchGroups(
//      @QueryParam("searchString") String searchString
//      ) {
//    List<UserGroup> userGroups = userController.searchUserGroups(searchString);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
////      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserGroup.class), tranquilityBuilder.createPropertyInjectInstruction("memberCount", new UserGroupMemberCountValueGetter()));
//    
//    return Response.ok(
//      tranquility.entities(userGroups)
//    ).build();
//  }
//
//  private class UserGroupMemberCountValueGetter implements ValueGetter<Long> {
//    @Override
//    public Long getValue(TranquilizingContext context) {
//      UserGroup userGroup = (UserGroup) context.getEntityValue();
//      return userController.getUserGroupMemberCount(userGroup);
//    }
//  }
//  
}
