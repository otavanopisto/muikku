package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.ArrayList;
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
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.VopsController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/records")
@RequestScoped
@Stateful
@Produces("application/json")
@RestCatchSchoolDataExceptions
public class TranscriptofRecordsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;
  private static final int MAX_COURSE_NUMBER = 15;
  
  @Inject
  private TranscriptOfRecordsFileController transcriptOfRecordsFileController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private CourseMetaController courseMetaController;
  
  @Inject
  private VopsController vopsController;
    
  @Inject
  private UserController userController;
 
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
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
  public Response getVops(@PathParam("IDENTIFIER") String studentIdentifierString) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).entity("Must be logged in").build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierString);
    
    if (studentIdentifier == null) {
      return Response.status(Status.NOT_FOUND).entity("Student identifier not found").build();
    }
    
    if (!Objects.equals(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.FORBIDDEN).entity("Can only look at own information").build();
    }
    
    User student = userController.findUserByIdentifier(studentIdentifier);
    
    List<Subject> subjects = courseMetaController.listSubjects();
    List<VopsRESTModel.VopsRow> rows = new ArrayList<>();
    for (Subject subject : subjects) {
      if (vopsController.subjectAppliesToStudent(student, subject)) {
        List<VopsRESTModel.VopsItem> items = new ArrayList<>();
        for (int i=1; i<MAX_COURSE_NUMBER; i++) {
          List<Workspace> workspaces =
              workspaceController.listWorkspacesBySubjectIdentifierAndCourseNumber(
                  subject.getSchoolDataSource(),
                  subject.getIdentifier(),
                  i);
          if (!workspaces.isEmpty()) {
            boolean workspaceUserExists = false;
            findWorkspaceUser: for (Workspace workspace : workspaces) {
              WorkspaceEntity workspaceEntity =
                  workspaceController.findWorkspaceEntity(workspace);
              WorkspaceUserEntity workspaceUser =
                  workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(
                      workspaceEntity,
                      studentIdentifier);
              if (workspaceUser != null) {
                workspaceUserExists = true;
                break findWorkspaceUser;
              }
            }
            
            items.add(new VopsRESTModel.VopsItem(i, workspaceUserExists));
          }
        }
        rows.add(new VopsRESTModel.VopsRow(subject.getCode(), items));
      }
    }
    
    VopsRESTModel result = new VopsRESTModel(rows);
    
    return Response.ok(result).build();
  }
}
