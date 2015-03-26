package fi.muikku.plugins.material.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@RequestScoped
@Path("/materials/image")
@Stateful
@Produces("application/json")
public class ImageMaterialRESTService extends BinaryMaterialRESTService {

  private static final long serialVersionUID = -589875308882097784L;

}
