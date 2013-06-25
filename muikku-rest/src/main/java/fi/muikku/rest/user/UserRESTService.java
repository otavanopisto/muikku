package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.controller.SchoolBridgeController;
import fi.muikku.controller.UserController;
import fi.muikku.model.base.Environment;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.TranquilizingContext;
import fi.tranquil.instructions.PropertyInjectInstruction.ValueGetter;
import fi.tranquil.instructions.SuperClassInstructionSelector;

@Path("/user")
@Stateless
@Produces ("application/json")
public class UserRESTService extends AbstractRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  private UserController userController;

  @Inject
  private SchoolBridgeController schoolBridgeController;
  
  @GET
  @Path ("/listEnvironmentUsers")
  public Response listEnvironmentUsers() {
    Environment environment = sessionController.getEnvironment();
    
    List<EnvironmentUser> users = userController.listEnvironmentUsers(environment); 
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entities(users)
    ).build();
  }
  
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

  @POST
  @Path ("/registerUser")
//  @Permit (Permissions.REPRESENT_USER)
  public Response registerUser(
      @FormParam ("firstName") String firstName,
      @FormParam ("lastName") String lastName,
      @FormParam ("email") String email,
      @FormParam ("passwordHash") String passwordHash
   ) {
    // TODO
    SchoolDataSource dataSource = schoolBridgeController.findSchoolDataSourceById(1L);
    
    userController.registerUser(dataSource, firstName, lastName, email, passwordHash);
    
    try {
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/login")
  public Response login(
      @FormParam ("email") String email,
      @FormParam ("passwordHash") String passwordHash
   ) {
    localSessionController.login(email, passwordHash);
    
    try {
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @GET
  @Path ("/logout")
  public Response logout() {
    localSessionController.logout();
    
    try {
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }
  
/**
  @POST
  @Path ("/representUser")
  @Permit (Permissions.REPRESENT_USER)
  public Response representUser(
      @FormParam ("environmentUserId") Long environmentUserId
   ) {
    EnvironmentUser environmentUser = environmentUserDAO.findById(environmentUserId);

    sessionController.representUser(environmentUser.getUser());
    
    try {
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }

  @POST
  @Path ("/endUserRepresentation")
  public Response endUserRepresentation() {
    sessionController.endRepresentation();
    
    try {
      return Response.ok().build();
    } catch (ConstraintViolationException violationException) {
      return getConstraintViolations(violationException);
    }
  }
**/
  
  private class UserEntityHasPictureValueGetter implements ValueGetter<Boolean> {
    @Override
    public Boolean getValue(TranquilizingContext context) {
      UserEntity user = (UserEntity) context.getEntityValue();
      return userController.getUserHasPicture(user);
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
