package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.TranquilizingContext;
import fi.tranquil.instructions.PropertyInjectInstruction.ValueGetter;
import fi.tranquil.instructions.SuperClassInstructionSelector;

@Path("/users")
@Stateless
@Produces ("application/json")
@Consumes ("application/json")
public class UsersRESTService extends AbstractRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private UserController userController;
  
//  @GET
//  @Path ("/listEnvironmentUsers")
//  public Response listEnvironmentUsers() {
//    List<EnvironmentUser> users = userController.listEnvironmentUsers(); 
//
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entities(users)
//    ).build();
//  }
  
  @GET
  @Path ("/searchUsers")
  public Response searchUsers(
      @QueryParam("searchString") String searchString
      ) {
    List<EnvironmentUser> eusers = userController.searchUsers(searchString);
    List<UserEntity> users = new ArrayList<UserEntity>();
    for (EnvironmentUser e : eusers) 
      users.add(e.getUser());
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("fullName", new UserNameValueGetter()));
    
    return Response.ok(
      tranquility.entities(users)
    ).build();
  }
  
  private class UserEntityHasPictureValueGetter implements ValueGetter<Boolean> {
    @Override
    public Boolean getValue(TranquilizingContext context) {
      UserEntity userEntity = (UserEntity) context.getEntityValue();
      return userController.hasPicture(userEntity);
    }
  }

  private class UserNameValueGetter implements ValueGetter<String> {
    @Override
    public String getValue(TranquilizingContext context) {
      UserEntity userEntity = (UserEntity) context.getEntityValue();
      User user = userController.findUser(userEntity);
      return user.getFirstName() + " " + user.getLastName();
    }
  }
}
