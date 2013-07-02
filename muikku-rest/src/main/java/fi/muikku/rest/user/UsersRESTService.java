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

}
