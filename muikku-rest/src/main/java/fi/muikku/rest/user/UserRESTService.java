package fi.muikku.rest.user;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.model.users.UserEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.entity.User;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@Path("/user")
@Stateless
@Produces ("application/json")
@Consumes ("application/json")
public class UserRESTService extends AbstractRESTService {

  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @GET
  @Path ("/users/{ID}")
  public Response findUser(@PathParam ("ID") Long id) {
    UserEntity userEntity = userEntityController.findUserEntityById(id);
    if (userEntity == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    User user = userController.findUserByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
    if (user == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    return Response.ok(createRestModel(userEntity, user)).build();
  }

  private fi.muikku.rest.model.User createRestModel(UserEntity userEntity, User user) {
    // TODO: User Image
    boolean hasImage = false;
    return new fi.muikku.rest.model.User(userEntity.getId(), user.getFirstName(), user.getLastName(), hasImage);
  }
  
//
// FIXME: Re-enable this service  
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
