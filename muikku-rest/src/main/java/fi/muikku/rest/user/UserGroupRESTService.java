package fi.muikku.rest.user;

import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.controller.SchoolBridgeController;
import fi.muikku.model.users.UserGroup;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.UserController;
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

@Path("/usergroup")
@Stateless
@Produces ("application/json")
public class UserGroupRESTService extends AbstractRESTService {

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
  @Path ("/searchGroups")
  public Response searchGroups(
      @QueryParam("searchString") String searchString
      ) {
    List<UserGroup> userGroups = userController.searchUserGroups(searchString);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE))
//      .addInstruction(new SuperClassInstructionSelector(UserEntity.class), tranquilityBuilder.createPropertyInjectInstruction("hasPicture", new UserEntityHasPictureValueGetter()))
      .addInstruction(new SuperClassInstructionSelector(UserGroup.class), tranquilityBuilder.createPropertyInjectInstruction("memberCount", new UserGroupMemberCountValueGetter()));
    
    return Response.ok(
      tranquility.entities(userGroups)
    ).build();
  }

  private class UserGroupMemberCountValueGetter implements ValueGetter<Long> {
    @Override
    public Long getValue(TranquilizingContext context) {
      UserGroup userGroup = (UserGroup) context.getEntityValue();
      return userController.getUserGroupMemberCount(userGroup);
    }
  }
  
}
