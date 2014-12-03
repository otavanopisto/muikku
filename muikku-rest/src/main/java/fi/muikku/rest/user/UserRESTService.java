package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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

  @GET
  @Path ("/searchUsers")
  public Response searchUsers(
      @QueryParam("searchString") String searchString
      ) {

    boolean hasImage = false;
    
//    List<User> listUsers = userController.listUsers();
    List<UserEntity> listUserEntities = userEntityController.listUserEntities();
    
    List<fi.muikku.rest.model.User> ret = new ArrayList<fi.muikku.rest.model.User>();
    
    searchString = searchString != null ? searchString.toLowerCase() : null;
    
//    for (User user : listUsers) {
    for (UserEntity userEntity : listUserEntities) {
      User user = userController.findUserByUserEntityDefaults(userEntity);
      
      if ((user.getFirstName() != null) && (user.getFirstName().toLowerCase().contains(searchString))) {
//        UserEntity userEntity = userEntityController.findUserEntityByUser(user);
        ret.add(new fi.muikku.rest.model.User(userEntity.getId(), user.getFirstName(), user.getLastName(), hasImage));
      } else if ((user.getLastName() != null) && (user.getLastName().toLowerCase().contains(searchString))) {
//        UserEntity userEntity = userEntityController.findUserEntityByUser(user);
        ret.add(new fi.muikku.rest.model.User(userEntity.getId(), user.getFirstName(), user.getLastName(), hasImage));
      }
    }
    
    return Response.ok(ret).build();
  }
  
}
