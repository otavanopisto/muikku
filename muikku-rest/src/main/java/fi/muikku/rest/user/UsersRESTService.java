package fi.muikku.rest.user;

import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import fi.muikku.rest.AbstractRESTService;

@Path("/users")
@Stateless
@Produces ("application/json")
@Consumes ("application/json")
public class UsersRESTService extends AbstractRESTService {
//
// FIXME: Re-enable this service  
//  @Inject
//  private UserController userController;
//  
////  @GET
////  @Path ("/listEnvironmentUsers")
////  public Response listEnvironmentUsers() {
////    List<EnvironmentUser> users = userController.listEnvironmentUsers(); 
////
////    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
////    Tranquility tranquility = tranquilityBuilder.createTranquility()
////      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
////    
////    return Response.ok(
////      tranquility.entities(users)
////    ).build();
////  }
//  
//  @GET
//  @Path ("/searchUsers")
//  public Response searchUsers(
//      @QueryParam("searchString") String searchString
//      ) {
//    List<EnvironmentUser> eusers = userController.searchUsers(searchString);
//    List<UserEntity> users = new ArrayList<UserEntity>();
//    for (EnvironmentUser e : eusers) 
//      users.add(e.getUser());
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
//    
//    return Response.ok(
//      tranquility.entities(users)
//    ).build();
//  }
//  
//  private class UserEntityHasPictureValueGetter implements ValueGetter<Boolean> {
//    @Override
//    public Boolean getValue(TranquilizingContext context) {
//      UserEntity userEntity = (UserEntity) context.getEntityValue();
//      return userController.hasPicture(userEntity);
//    }
//  }
//
//  private class UserNameValueGetter implements ValueGetter<String> {
//    @Override
//    public String getValue(TranquilizingContext context) {
//      UserEntity userEntity = (UserEntity) context.getEntityValue();
//      User user = userController.findUser(userEntity);
//      return user.getFirstName() + " " + user.getLastName();
//    }
//  }
}
