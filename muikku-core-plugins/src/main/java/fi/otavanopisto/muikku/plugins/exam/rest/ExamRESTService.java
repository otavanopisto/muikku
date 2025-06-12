package fi.otavanopisto.muikku.plugins.exam.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspace/exam")
@RestCatchSchoolDataExceptions
public class ExamRESTService {
  
  @Path("/start/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response startExam(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    return Response.noContent().build();
  }

  @Path("/end/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response endExam(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    return Response.noContent().build();
  }

  @Path("/contents/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listContents(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    return Response.noContent().build();
  }

  @Path("/attendees/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAttendees(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    return Response.noContent().build();
  }

}
