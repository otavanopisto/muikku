package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

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

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;

@Path("/records")
@RequestScoped
@Stateful
@Produces ("application/json")
@RestCatchSchoolDataExceptions
public class TranscriptofRecordsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;
  
  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;
  
  @GET
  @Path("/files/{ID}/content)")
  @RESTPermitUnimplemented
  public Response getFileContent(@PathParam("ID") Long fileId) {
    
    // TODO security
    // TODO caching?
    
    TranscriptOfRecordsFile file = transcriptOfRecordsFileController
        .findFileById(fileId);
    
    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("File not found").build();
    }
    
    StreamingOutput output = s -> transcriptOfRecordsFileController.getFileContent(file, s);
    
    String contentType = file.getContentType();
    
    return Response.ok().type(contentType).entity(output).build();
  }
  
}
