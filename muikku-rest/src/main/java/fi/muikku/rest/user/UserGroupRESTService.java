package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.rest.model.UserGroupRESTModel;
import fi.muikku.rest.model.UserGroupUserRESTModel;
import fi.muikku.users.UserGroupController;

@Path("/usergroup")
@Stateless
@Produces ("application/json")
public class UserGroupRESTService extends AbstractRESTService {
  
  @Inject
  private UserGroupController userGroupController;
  
  @GET
  @Path("/groups/{ID}")
  public Response findById(@PathParam("ID") Long groupId) {
    UserGroup userGroup = userGroupController.findUserGroup(groupId);
    if (userGroup == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      UserGroupRESTModel restModel = new UserGroupRESTModel(userGroup);
      return Response.ok(restModel).build();
    }
  }
  
  @GET
  @Path("/groups/{ID}/users")
  public Response listGroupUsersByGroup(@PathParam("ID") Long groupId) {
    
    UserGroup userGroup = userGroupController.findUserGroup(groupId);
    ArrayList<UserGroupUserRESTModel> result = new ArrayList<>();
    for (UserGroupUser userGroupUser : userGroupController.listUserGroupUsers(userGroup)) {
        result.add(new UserGroupUserRESTModel(userGroupUser));
    }

    return Response.ok(result).build();
    
  }
}
