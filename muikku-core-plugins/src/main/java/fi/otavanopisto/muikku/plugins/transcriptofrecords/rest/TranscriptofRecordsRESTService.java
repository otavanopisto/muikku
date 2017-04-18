package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/records")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class TranscriptofRecordsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;
  
  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @GET
  @Path("/files/{ID}/content")
  @RESTPermit(handling = Handling.INLINE)
  @Produces("*/*")
  public Response getFileContent(@PathParam("ID") Long fileId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();

    TranscriptOfRecordsFile file = transcriptOfRecordsFileController
        .findFileById(fileId);
    
    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("File not found").build();
    }

    boolean isLoggedUser = Objects.equals(file.getUserEntityId(), loggedUserEntity.getId());
    
    if (!isLoggedUser) {
      return Response.status(Status.FORBIDDEN).entity("Not your file").build();
    }
    
    StreamingOutput output = s -> transcriptOfRecordsFileController.outputFileToStream(file, s);
    
    String contentType = file.getContentType();
    
    return Response.ok().type(contentType).entity(output).build();
  }

  @GET
  @Path("/vops/{IDENTIFIER}")
  @RESTPermit(handling = Handling.INLINE)
  public Response getVops(@PathParam("IDENTIFIER") String studentIdentifier) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    List<Subject> subjects = courseMetaController.listSubjects();
    subjects = subjects.subList(0, Math.max(9, subjects.size()));
    
    List<VopsRESTModel.VopsRow> rows = new ArrayList<>();
    for (Subject subject : subjects) {
      rows.add(new VopsRESTModel.VopsRow(subject.getName(), Arrays.asList(
        new VopsRESTModel.VopsItem(1, true),
        new VopsRESTModel.VopsItem(2, true),
        new VopsRESTModel.VopsItem(3, true),
        new VopsRESTModel.VopsItem(4, false),
        new VopsRESTModel.VopsItem(5, false))));
    }
    
    VopsRESTModel result = new VopsRESTModel(rows);
    
    return Response.ok(result).build();
  }
  
}
