package fi.muikku.rest.user;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.rest.AbstractRESTService;

@Path("/usergroup")
@Stateless
@Produces ("application/json")
public class UserGroupRESTService extends AbstractRESTService {
  
  @GET
  @Path("/groups/{ID}")
  public Response findById(@PathParam("ID") Long groupId) {
    return null;
  }
  
  @GET
  @Path("/groups/{ID}/users")
  public Response listGroupUsersByGroup(@PathParam("ID") Long groupId) {
    return null;
  }
}
